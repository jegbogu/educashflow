 import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Activity from "@/model/recentactivities";
import connectDB from "@/utils/connectmongo";
import ConfirmPayment from "@/model/confirmPayment";
import Register from "@/model/registerSchema";

/** ---------- Helpers ---------- **/

// Format date and time (for logs or DB entries)
function getFormattedDateTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// Create nodemailer transporter
function createTransporter() {
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
  // fallback to Gmail
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/** ---------- EMAIL TEMPLATES ---------- **/

// Email to ADMIN
async function sendAdminAlertEmail({ fullname, email, packageName, price }) {
  const transporter = createTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color:#2b6cb0;">Educashflow - Payment Confirmation Alert</h2>
      <p>A user has requested payment confirmation.</p>
      <ul>
        <li><b>Name:</b> ${fullname}</li>
        <li><b>Email:</b> ${email}</li>
        <li><b>Package:</b> ${packageName}</li>
        <li><b>Amount:</b> ₦${price}</li>
        <li><b>Request Time:</b> ${getFormattedDateTime()}</li>
      </ul>
      <p>Please review and confirm the payment at your earliest convenience.</p>
      <p>Educashflow Admin Panel</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Educashflow" <${process.env.EMAIL_USER}>`,
    to: process.env.CHIEF_ADMIN_EMAIL, // add ADMIN_EMAIL in .env
    subject: `User Awaiting Payment Confirmation - ${fullname}`,
    html,
  });
}

// Email to USER
async function sendUserConfirmationEmail({ fullname, email, packageName, price }) {
  const transporter = createTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color:#2b6cb0;">Hello ${fullname},</h2>
      <p>We’ve received your payment request for the <b>${packageName}</b> package ($${price}).</p>
      <p>Your payment will be confirmed shortly by our admin team. You will be notified once it is verified.</p>
      <p>Thank you for using <b>Educashflow</b>.</p>
      <hr />
      <p style="font-size: 13px; color: #777;">&copy; ${new Date().getFullYear()} Educashflow. All rights reserved.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Educashflow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Payment Confirmation Pending",
    html,
  });
}

/** ---------- MAIN HANDLER ---------- **/
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    await connectDB();

    const { packageName, price, userData ,  gameLimit, validDays,earningRate} = req.body;
    if (!userData?.email || !userData?.fullname) {
      return res.status(400).json({ message: "Missing user details" });
    }

    // Save in DB
    const confirmPayment = new ConfirmPayment({
      _id: new mongoose.Types.ObjectId(),
      packageName,
      paymentConfirmation:"Pending",
      price,
      userData,
      createdAt: new Date(),
    });
    await confirmPayment.save();

    // Log activity
const activity = new Activity({
  _id: new mongoose.Types.ObjectId(),
  activity: "Payment confirmation",
  description: `User ${userData.fullname} (${userData.email}) awaits payment confirmation for ₦${price}.`,
  createdAt: getFormattedDateTime(),
});
await activity.save();

// Update user record
const userRecentPurchase = {
  package: packageName,
  DOP: new Date(),
  gameLimit,
  validDays,
  earningRate,
  status: "Pending",
  expiryDate: new Date(Date.now() + validDays * 24 * 60 * 60 * 1000), // correct expiry
};

const updatedPayment = await Register.findByIdAndUpdate(
  userData._id,
  {
    $set: { paymentConfirmation: "Pending" },
    $push: { latestPurchase: userRecentPurchase },
  },
  { new: true, runValidators: true }
);





    // Send emails in parallel (non-blocking)
    await Promise.all([
      sendAdminAlertEmail({
        fullname: userData.fullname,
        email: userData.email,
        packageName,
        price,
      }),
      sendUserConfirmationEmail({
        fullname: userData.fullname,
        email: userData.email,
        packageName,
        price,
      }),
    ]);

    return res.status(200).json({
      message: "Successfully received. Admin and user have been notified.",
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}
