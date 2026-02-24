import connectDB from "../../utils/connectmongo";
import Register from "../../model/registerSchema";
import Activity from "../../model/recentactivities";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

/** ---------- Helpers ---------- **/

// Use real Date objects for DB; keep this for readable Activity logs
function getFormattedDateTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// Create a nodemailer transporter from env
function createTransporter() {
  // Prefer explicit SMTP (works on most hosts), fallback to Gmail "service"
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  // Fallback (Gmail service). For Gmail, ensure you use an App Password.
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// Send activation email; swallow/throw errors to let handler decide behavior
async function sendActivationEmail({ email, userId, fullname }) {
  const transporter = createTransporter();

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const activationLink = `${baseUrl}/api/activate/${userId}`;

  await transporter.sendMail({
    from: `"Eduquizz Global Limited" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Activate your Eduquizz Global Limited Account",
    text: `
Welcome to Eduquizz Global Limited!

Thank you for registering. To activate your account, click the link below:

${activationLink}

If you did not create this account, please ignore this email.

----------------------
Eduquizz Global Limited Team
${new Date().getFullYear()} © All rights reserved.
Support: ${process.env.EMAIL_USER}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2b6cb0; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">Eduquizz Global Limited</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <h2 style="color: #2b6cb0; margin-top: 0;">Welcome, ${fullname || "User"}!</h2>
          <p style="font-size: 15px; line-height: 1.6;">
            Thank you for registering with <b>Eduquizz Global Limited</b>. To activate your account and get started, 
            please click the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${activationLink}" target="_blank" 
              style="background-color: #2b6cb0; color: #fff; text-decoration: none; 
                     padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block;">
              Activate My Account
            </a>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #555;">
            If you did not create this account, you can safely ignore this email.
          </p>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 13px; color: #777;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Eduquizz Global Limited. All rights reserved.</p>
          <p style="margin: 5px 0;">Need help? <a href="mailto:${process.env.EMAIL_USER}" style="color: #2b6cb0; text-decoration: none;">Contact Support</a></p>
        </div>
      </div>
    `,
  });
}

/** ---------- Validation ---------- **/

function sanitizeInput({ fullname, username, email, password }) {
  // Trim/normalize; keep placeholders intact if they are used intentionally
  const safe = {
    fullname: (fullname ?? "").toString().trim(),
    username: (username ?? "").toString().trim(),
    email: (email ?? "").toString().trim().toLowerCase(),
    password: (password ?? "").toString(),
  };
  return safe;
}

function validate({ fullname, username, email, password }) {
  // Your placeholders
  const isPlaceholderEmail = email === "noemail@gmail.com";
  const isPlaceholderFullname = fullname === "nofullname";

  // Bronze field presence:
  if (!username) return { ok: false, message: "Username is required" };
  if (!password) return { ok: false, message: "Password is required" };

  // Minimal sanity (you likely already enforce on client)
  if (username.length < 3) return { ok: false, message: "Username must be at least 3 characters" };

  // Password: 8 chars + upper + lower + digit + special (same regex as client)
  const passwordStrong =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(password);
  if (!passwordStrong)
    return {
      ok: false,
      message:
        "Password must be at least 8 chars and include uppercase, lowercase, a number, and a special character.",
    };

  // If not using placeholder email, ensure it's a reasonable email
  if (!isPlaceholderEmail) {
    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailLooksValid) return { ok: false, message: "Invalid email address" };
  }

  return {
    ok: true,
    flags: {
      isPlaceholderEmail,
      isPlaceholderFullname,
    },
  };
}

/** ---------- Handler ---------- **/

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const raw = req.body || {};
    const { fullname, username, email, password } = sanitizeInput(raw);
    console.log({ fullname, username, email, password })
   

    // Validate (server-side)
    const verdict = validate({ fullname, username, email, password });
    if (!verdict.ok) {
      res.status(400).json({ message: verdict.message });
      return;
    }

    await connectDB();

    // Uniqueness checks only when not placeholders
    if (!verdict.flags.isPlaceholderEmail) {
      const existingEmail = await Register.findOne({ email });
      if (existingEmail) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }
    }

    // NOTE: your original code checked "if (username !== 'nofullname')" — likely a bug.
    // I assume you meant "if (fullname !== 'nofullname')" to allow guest/anon flow.
    if (!verdict.flags.isPlaceholderFullname) {
      const existingUsername = await Register.findOne({ username });
      if (existingUsername) {
        res.status(400).json({ message: "Username already exists" });
        return;
      }
    }

    // Hash password
    const saltRounds = Number(process.env.BCRYPT_ROUNDS || 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user (store real Date; you can also keep formatted string if your schema needs it)
    const userId = new mongoose.Types.ObjectId();
    const newUser = new Register({
      _id: userId,
      fullname,
      username,
      email,
      password: hashedPassword,
      activate: false,                 // boolean, not string
      createdAt: new Date(),  
      level: 0,
      amountMade: 0,
      points: 0,
      coupon :"Null",
  paymentConfirmation : "Null",
      membership:"Free plan",
      role: "user",
       playedGames:[],
  usedCoupons:[],

  latestPurchase:[],
   latestPurchaseGames:[],
       spaceOne: "Null",
  spaceTwo: "Null",
  spaceThree: 0,


    });

    await newUser.save();

    // Log activity
    const activity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: verdict.flags.isPlaceholderEmail && verdict.flags.isPlaceholderFullname
        ? "New user registered without email"
        : "New user registered",
      description: verdict.flags.isPlaceholderEmail ? username : email,
      createdAt: getFormattedDateTime(),
    });

    // Send activation email when we have a real email & name
    if (!verdict.flags.isPlaceholderEmail && !verdict.flags.isPlaceholderFullname) {
      try {
        await sendActivationEmail({
          email,
          userId: userId.toString(),
          fullname,
        });
      } catch (mailErr) {
        // Log but don't fail the whole request
        console.error("sendActivationEmail error:", mailErr);
      }
    }

    await activity.save();

    // Response message
    if (verdict.flags.isPlaceholderEmail && verdict.flags.isPlaceholderFullname) {
      res.status(201).json({ message: "Sign up successful" });
      return;
    }

    if(email.includes("noemail")){
      res
      .status(201)
      .json({
        message:
          "Registration successful",
      });
    }else{
      res
      .status(201)
      .json({
        message:
          "Registration successful, please check your email to activate your account",
      });
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
