import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Activity from "@/model/recentactivities";
import connectDB from "@/utils/connectmongo";
import ConfirmPayment from "@/model/confirmPayment";
import Register from "@/model/registerSchema";

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

/** ---------- EMAIL TEMPLATES ---------- **/

async function sendAdminAlertEmail({
  fullname,
  email,
  packageName,
  price,
}) {
  const transporter = createTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color:#2b6cb0;">
        Eduquizz Global Limited - Payment Successfully Verified Alert
      </h2>

      <p>A user payment has been successfully verified.</p>

      <ul>
        <li><b>Name:</b> ${fullname}</li>
        <li><b>Email:</b> ${email}</li>
        <li><b>Package:</b> ${packageName}</li>
        <li><b>Amount:</b> ₦${price}</li>
        <li><b>Request Time:</b> ${getFormattedDateTime()}</li>
      </ul>

      <p>Eduquizz Global Limited Admin Panel</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Eduquizz Global Limited" <${process.env.EMAIL_USER}>`,
    to: process.env.CHIEF_ADMIN_EMAIL,
    subject: `User Payment Verification - ${fullname}`,
    html,
  });
}

async function sendUserConfirmationEmail({
  fullname,
  email,
  packageName,
  price,
}) {
  const transporter = createTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color:#2b6cb0;">Hello ${fullname},</h2>

      <p>
        We’ve verified your payment for
        <b>${packageName}</b> package (₦${price}).
      </p>

      <p>
        Thank you for choosing us. Please ensure to play within
        the valid days as there would be no refund if it expires.
      </p>

      <p>
        Thank you for using <b>Eduquizz Global Limited</b>.
      </p>

      <hr />

      <p style="font-size: 13px; color: #777;">
        &copy; ${new Date().getFullYear()}
        Eduquizz Global Limited. All rights reserved.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Eduquizz Global Limited" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Payment Verification",
    html,
  });
}

/** ---------- MAIN HANDLER ---------- **/

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    await connectDB();

    const {
      confirmPaymentId,
      userDataId,
      packageName,
      newStatus,
    } = req.body;

    console.log({
      confirmPaymentId,
      userDataId,
      packageName,
      newStatus,
    });

    if (!confirmPaymentId || !userDataId) {
      return res.status(400).json({
        message: "Missing user details",
      });
    }

    // Find user and payment
    const user = await Register.findById(userDataId);
    const payment = await ConfirmPayment.findById(confirmPaymentId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

let latestPurchaseItem = null;
let validDays = 0;
let expiryDate = "";
let DOCdate = "";

// Always update user
user.paymentConfirmation = newStatus;
user.membership = packageName;

// Check if latestPurchase exists
if (
  user.latestPurchase &&
  Array.isArray(user.latestPurchase) &&
  user.latestPurchase.length > 0
) {
  const lastIndex = user.latestPurchase.length - 1;

  latestPurchaseItem = user.latestPurchase[lastIndex];

  validDays = latestPurchaseItem?.validDays || 0;

  if (newStatus === "Successful") {
    expiryDate = new Date(
      Date.now() + validDays * 24 * 60 * 60 * 1000
    );

    DOCdate = new Date();
  }

  // Update latest purchase item
  latestPurchaseItem.status = newStatus;
  latestPurchaseItem.DOC = DOCdate;
  latestPurchaseItem.expiryDate = expiryDate;

  user.markModified("latestPurchase");
}

// Save user
await user.save();
    // Log activity
    const activity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: "Payment confirmation",
      description: `User with ID: ${userDataId} and Package: ${packageName} payment has been set to ${newStatus}.`,
      createdAt: getFormattedDateTime(),
    });

    await activity.save();

    // Update confirmation collection
    await ConfirmPayment.findByIdAndUpdate(
      confirmPaymentId,
      {
        $set: {
          paymentConfirmation: newStatus,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Send emails if successful
    if (newStatus === "Successful") {
      await Promise.all([
        sendAdminAlertEmail({
          fullname: user.fullname,
          email: user.email,
          packageName,
          price: payment?.price || 0,
        }),

        sendUserConfirmationEmail({
          fullname: user.fullname,
          email: user.email,
          packageName,
          price: payment?.price || 0,
        }),
      ]);

      return res.status(200).json({
        message:
          "Successfully confirmed. Admin and user have been notified.",
      });
    }

    return res.status(200).json({
      message: `${newStatus} status has been set`,
    });

  } catch (error) {
    console.error("Payment confirmation error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}