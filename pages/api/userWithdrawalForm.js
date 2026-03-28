import connectDB from "../../utils/connectmongo";
import Register from "../../model/registerSchema";
import Activity from "../../model/recentactivities";
import WithdrawalRequest from "@/model/withdrawalRequest";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

function getFormattedDateTime() {

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function createTransporter() {

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

async function sendWithdrawalEmails({
  fullname,
  email,
  accountName,
  accountNumber,
  bankName,
  amount
}) {

  const transporter = createTransporter();
  const adminEmail = process.env.CHIEF_ADMIN_EMAIL;

  await transporter.sendMail({
    from: `"Eduquizz Global Limited" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Withdrawal Request Received",
    html: `
    <h2>Hello ${fullname}</h2>
    <p>Your withdrawal request has been received.</p>
    <ul>
    <li>Bank: ${bankName}</li>
    <li>Account Name: ${accountName}</li>
    <li>Account Number: ${accountNumber}</li>
    <li>Amount: ₦${amount}</li>
    </ul>`
  });

  await transporter.sendMail({
    from: `"Eduquizz Global Limited" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: "New Withdrawal Request",
    html: `
    <h2>New Withdrawal Request</h2>
    <p>User: ${fullname}</p>
    <p>Email: ${email}</p>
    <p>Amount: ₦${amount}</p>
    <p>Time: ${getFormattedDateTime()}</p>`
  });
}

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const {
      accountName,
      accountNumber,
      bankName,
      amount,
      userData,
      minUserCanWithdraw,
      maxUserCanWithdraw
    } = req.body;

    const withdrawalAmount = Number(amount);

    if (!accountName || accountName.length < 3)
      return res.status(400).json({ message: "Account name is required" });

    if (!accountNumber || accountNumber.length < 6)
      return res.status(400).json({ message: "Account number is invalid" });

    if (!bankName || bankName.length < 3)
      return res.status(400).json({ message: "Bank name is required" });

    if (!withdrawalAmount || isNaN(withdrawalAmount))
      return res.status(400).json({ message: "Invalid amount" });

    if (withdrawalAmount > maxUserCanWithdraw)
      return res.status(400).json({
        message: `Amount cannot exceed ${maxUserCanWithdraw}`
      });

    if (withdrawalAmount < minUserCanWithdraw)
      return res.status(400).json({
        message: `Minimum withdrawal is ${minUserCanWithdraw}`
      });

    await connectDB();

    const existingUser = await Register.findOne({
      username: userData?.username
    });

    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    if (withdrawalAmount > existingUser.amountMade)
      return res.status(400).json({ message: "Insufficient funds" });

    if (existingUser.spaceTwo === "Pending")
      return res.status(400).json({
        message: "You already have a pending withdrawal"
      });

    const activity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: "Withdrawal Request",
      description: `Withdrawal of ₦${withdrawalAmount} requested by ${existingUser.username}`,
      createdAt: getFormattedDateTime()
    });

    await activity.save();

    const withdrawalRequest = new WithdrawalRequest({
      _id: new mongoose.Types.ObjectId(),
      fullname: existingUser.fullname,
      email: existingUser.email,
      accountName,
      bankName,
      accountNumber,
      amount: withdrawalAmount,
      withdrawalConfirmation: "Pending",
      userData
    });

    await withdrawalRequest.save();

    await Register.findByIdAndUpdate(
      existingUser._id,
      { $set: { spaceTwo: "Pending" } },
      { new: true }
    );

    try {

      await sendWithdrawalEmails({
        fullname: existingUser.fullname,
        email: existingUser.email,
        accountName,
        accountNumber,
        bankName,
        amount: withdrawalAmount
      });

    } catch (emailError) {

     
    }

    return res.status(200).json({
      message: "Withdrawal request submitted successfully"
    });

  } catch (err) {

    console.log("Server error:", err);

    return res.status(500).json({
      message: "Server error"
    });
  }
}