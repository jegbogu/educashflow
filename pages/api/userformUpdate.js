import connectDB from "../../utils/connectmongo";
import Register from "../../model/registerSchema";
import Activity from "../../model/recentactivities";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

/** ---------- Helpers ---------- **/

function getFormattedDateTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendActivationEmail({ email, fullname }) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Educashflow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Profile Successfully Updated",
    text: `
Hello ${fullname},

Your Educashflow profile was successfully updated.  

If you did not request this change, please contact support.

----------------------
Educashflow Team
${new Date().getFullYear()} © All rights reserved.
Support: ${process.env.EMAIL_USER}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <div style="background-color: #2b6cb0; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Educashflow</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <h2>Hello, ${fullname || "User"}!</h2>
          <p>Your Educashflow profile has been successfully updated.</p>
          <p>If you did not make this change, please contact support immediately.</p>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 13px; color: #777;">
          <p>&copy; ${new Date().getFullYear()} Educashflow. All rights reserved.</p>
          <p>Need help? <a href="mailto:${process.env.EMAIL_USER}" style="color: #2b6cb0;">Contact Support</a></p>
        </div>
      </div>
    `,
  });
}

/** ---------- Validation ---------- **/

function sanitizeInput({ fullname, username, email }) {
  return {
    fullname: (fullname ?? "").trim(),
    username: (username ?? "").trim(),
    email: (email ?? "").trim().toLowerCase(),
   
  };
}

function validate({ fullname, username, email }) {
  const isPlaceholderEmail = email === "noemail@gmail.com";
  const isPlaceholderFullname = fullname === "nofullname";

  if (!username) return { ok: false, message: "Username is required" };
  if (username.length < 3) return { ok: false, message: "Username must be at least 3 characters" };

  if (!isPlaceholderEmail) {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) return { ok: false, message: "Invalid email address" };
  }

  return { ok: true, flags: { isPlaceholderEmail, isPlaceholderFullname } };
}

/** ---------- Handler ---------- **/

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const raw = req.body || {};
    const { fullname, username, email } = sanitizeInput(raw);
    console.log({ fullname, username, email });

    const verdict = validate({ fullname, username, email });
    if (!verdict.ok) {
      return res.status(400).json({ message: verdict.message });
    }

    await connectDB();

    // Ensure the user exists before updating
    const existingUser = await Register.findOne({ username });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate emails (optional)
    if (!verdict.flags.isPlaceholderEmail) {
      const emailInUse = await Register.findOne({ email, username: { $ne: username } });
      if (emailInUse) {
        return res.status(400).json({ message: "Email already in use by another user" });
      }
    }

    // Update User
    const updateUser = await Register.findOneAndUpdate(
      { username },
      { $set: { fullname, email } },
      { new: true }
    );

    // Log activity
    const activity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: "User profile updated",
      description: `Profile update for ${username}`,
      createdAt: getFormattedDateTime(),
    });
    await activity.save();

    // Send update notification
    if (!verdict.flags.isPlaceholderEmail && !verdict.flags.isPlaceholderFullname) {
      try {
        await sendActivationEmail({ email, fullname });
      } catch (err) {
        console.error("Email send error:", err.message);
      }
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updateUser,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
