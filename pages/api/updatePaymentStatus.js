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
      <h2 style="color:#2b6cb0;">Eduquizz Global Limited - Payment Successfuly Verified Alert</h2>
      <p>A user Payment has been Successfully Verified.</p>
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
    to: process.env.CHIEF_ADMIN_EMAIL, // add ADMIN_EMAIL in .env
    subject: `User Payment Verification - ${fullname}`,
    html,
  });
}

// Email to USER
async function sendUserConfirmationEmail({ fullname, email, packageName, price }) {
  const transporter = createTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color:#2b6cb0;">Hello ${fullname},</h2>
      <p>We’ve Verified your Payment for <b>${packageName}</b> package ($${price}).</p>
      <p>Thank you for Choosing us. Please ensure to play with in the valid days as there would be no refund if it expries</p>
      <p>Thank you for using <b>Eduquizz Global Limited</b>.</p>
      <hr />
      <p style="font-size: 13px; color: #777;">&copy; ${new Date().getFullYear()} Eduquizz Global Limited. All rights reserved.</p>
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
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    await connectDB();


    const { confirmPaymentId,userDataId, packageName, newStatus} = req.body;
 
    if (!confirmPaymentId|| !userDataId) {
      return res.status(400).json({ message: "Missing user details" });
    }

    // Update user info
    //Get the validity of the package


 const user = await Register.findById(userDataId);
const payment = await ConfirmPayment.findById(confirmPaymentId);

if (!user) throw new Error("User not found");

const lastIndex = user.latestPurchase.length - 1;
const validDays = user.latestPurchase[lastIndex].validDays;

let expiryDate;
//DOC : Date of Confirmation
let DOCdate
if(newStatus !=="Successful"){
  expiryDate = " "
  DOCdate = " "
}else{
 expiryDate = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000);
 DOCdate = new Date(); 
}


user.paymentConfirmation = newStatus;
user.membership = packageName;
user.latestPurchase[lastIndex].status = newStatus;
user.latestPurchase[lastIndex].DOC = DOCdate
user.latestPurchase[lastIndex].expiryDate = expiryDate;

// ✅ Tell Mongoose a nested field changed
user.markModified("latestPurchase");

const updatedPayment = await user.save();
 
//Making sure we have the right information
 



    // Log activity
const activity = new Activity({
  _id: new mongoose.Types.ObjectId(),
  activity: "Payment confirmation",
  description: `User with the ID: ${userDataId} and Package: ${packageName} Payment has been set to ${newStatus}.`,
  createdAt: getFormattedDateTime(),
});
await activity.save();

 
const updateConfirmation = await ConfirmPayment.findByIdAndUpdate(
  confirmPaymentId,
  {
    $set: { paymentConfirmation: newStatus },
    
  },
  { new: true, runValidators: true }
);

` `

if(newStatus ==="Successful"){
   // Send emails in parallel (non-blocking)
    await Promise.all([
      sendAdminAlertEmail({
        fullname: user.fullname,
        email: user.email,
        packageName,
         price: payment.price,
      }),
      sendUserConfirmationEmail({
        fullname: user.fullname,
        email: user.email,
        packageName,
        price: payment.price,
      }),
    ]);

    return res.status(200).json({
      message: "Successfully Confirmed. Admin and user have been notified.",
    });
} else{
   return res.status(200).json({
      message: `${newStatus} Status has been set`,
    });
}


   
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}
