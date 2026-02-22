import connectDB from "../../utils/connectmongo";
import Register from "../../model/registerSchema";
import Activity from "../../model/recentactivities";
import WithdrawalRequest from "@/model/withdrawalRequest";
import mongoose from "mongoose";
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
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/** ---------- Email Function ---------- **/

async function sendWithdrawalEmails({
  fullname,
  email,
  accountName,
  accountNumber,
  bankName,
  amount,
}) {
  const transporter = createTransporter();
  const adminEmail = process.env.CHIEF_ADMIN_EMAIL;

  const currentYear = new Date().getFullYear();

  // Email to USER
  await transporter.sendMail({
    from: `"Educashflow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Withdrawal Request Received",
    html: `
      <div style="font-family: Arial; max-width:600px; margin:auto;">
        <h2>Hello ${fullname},</h2>
        <p>Your withdrawal request has been received successfully.</p>

        <h3>Withdrawal Details:</h3>
        <ul>
          <li><strong>Bank Name:</strong> ${bankName}</li>
          <li><strong>Account Name:</strong> ${accountName}</li>
          <li><strong>Account Number:</strong> ${accountNumber}</li>
          <li><strong>Amount:</strong> ₦${amount}</li>
        </ul>

        <p>Our team will process your request shortly.</p>
        <br/>
        <small>© ${currentYear} Educashflow. All rights reserved.</small>
      </div>
    `,
  });

  // Email to ADMIN
  await transporter.sendMail({
    from: `"Educashflow" <${process.env.CHIEF_ADMIN_EMAIL}>`,
    to: adminEmail,
    subject: "New Withdrawal Request",
    html: `
      <div style="font-family: Arial; max-width:600px; margin:auto;">
        <h2>New Withdrawal Request</h2>

        <p><strong>User:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>

        <h3>Withdrawal Details:</h3>
        <ul>
          <li><strong>Bank Name:</strong> ${bankName}</li>
          <li><strong>Account Name:</strong> ${accountName}</li>
          <li><strong>Account Number:</strong> ${accountNumber}</li>
          <li><strong>Amount:</strong> ₦${amount}</li>
        </ul>

        <small>Request Time: ${getFormattedDateTime()}</small>
      </div>
    `,
  });
}

/** ---------- Validation ---------- **/

function sanitizeInput({ accountName, accountNumber, bankName, amount, amountAvailableForUser, minUserCanWithdraw, maxUserCanWithdraw}) {
  return {
    accountName: (accountName ?? "").trim(),
    accountNumber:(accountNumber ?? ""),
    bankName: (bankName ?? "").trim(),
    amount: Number((amount ?? "")),
    amountAvailableForUser: Number((amountAvailableForUser ?? "")),
    minUserCanWithdraw ,
    maxUserCanWithdraw 
  };
}


 


function validate({ accountName, accountNumber, bankName, amount , amountAvailableForUser, minUserCanWithdraw, maxUserCanWithdraw}) {
  
   

  if (amount > maxUserCanWithdraw)
    return { ok: false, message: `Amount to withdrawal must NOT be more than ${maxUserCanWithdraw}` };

  if (amount < minUserCanWithdraw)
    return { ok: false, message: `Amount to withdrawal must be more than ${minUserCanWithdraw}` };

  if (amount > amountAvailableForUser)
    return { ok: false, message: `Amount to withdrawal should not be more than ${min}` };

  if (amount > amountAvailableForUser)
    return { ok: false, message: `Amount to withdrawal should not be more than ${min}` };

  if (!accountName || accountName.length < 5)
    return { ok: false, message: "Account name is required" };

  if (!accountNumber || accountNumber.length < 10)
    return { ok: false, message: "Valid account number is required" };

  if (!bankName || bankName.length < 3)
    return { ok: false, message: "Bank name is required" };

  if (!amount || isNaN(amount))
    return { ok: false, message: "Valid amount is required" };

  return { ok: true };
}

/** ---------- Handler ---------- **/

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const raw = req.body || {};
    const { accountName, accountNumber, bankName, amount , amountAvailableForUser, minUserCanWithdraw, maxUserCanWithdraw} =
      sanitizeInput(raw);

    console.log({ accountName, accountNumber, bankName, amount , amountAvailableForUser, minUserCanWithdraw, maxUserCanWithdraw})
   

    const verdict = validate({
      accountName,
      accountNumber,
      bankName,
      amount,
      amountAvailableForUser,
      minUserCanWithdraw,
      maxUserCanWithdraw
    });

    if (!verdict.ok) {
      return res.status(400).json({ message: verdict.message });
    }

    await connectDB();

    const { userData } = raw;

    const existingUser = await Register.findOne({
      username: userData?.username,
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log activity
    const activity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: "Withdrawal Request",
      description: `Withdrawal of ₦${amount} requested by ${existingUser.username}`,
      createdAt: getFormattedDateTime(),
    });

    await activity.save();

    const withdrawalRequest = new WithdrawalRequest({
      _id: new mongoose.Types.ObjectId(),
      fullname: userData?.fullname ,
  email: userData?.email ,
  accountName ,
  bankName ,
  accountNumber ,
  amount ,
  withdrawalConfirmation:"Pending" ,
  userData ,
 
    });
 
    await withdrawalRequest.save();

    // Send Emails
    try {
      await sendWithdrawalEmails({
        fullname: existingUser.fullname,
        email: existingUser.email,
        accountName,
        accountNumber,
        bankName,
        amount
        
      });
    } catch (err) {
      console.error("Email error:", err.message);
    }

    return res.status(200).json({
      message: "Withdrawal request submitted successfully",
    });
  } catch (err) {
    console.log("Server error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
