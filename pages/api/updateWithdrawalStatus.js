 import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Activity from "@/model/recentactivities";
import connectDB from "@/utils/connectmongo";
import WithdrawalRequest from "@/model/withdrawalRequest";
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
 
async function sendAdminAlertEmail({ fullname, email, adminFullname, amount, newStatus }) {
  const transporter = createTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color:#2b6cb0;">Eduquizzglobal - </h2>
      <p>A user withdrawal request status has been  Updated.</p>
      <ul>
        <li><b>Name:</b> ${fullname}</li>
        <li><b>Email:</b> ${email}</li>
        <li><b>Status:</b> ${newStatus}</li>
        <li><b>Amount:</b> ₦${amount}</li>
        <li><b>Request Time:</b> ${getFormattedDateTime()}</li>
      </ul>
      <p>This was done by ${adminFullname}</p>
      <p>Eduquizzglobal Admin Panel</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Eduquizzglobal" <${process.env.EMAIL_USER}>`,
    to: process.env.CHIEF_ADMIN_EMAIL, // add ADMIN_EMAIL in .env
    subject: `User withdrawal request - ${fullname}`,
    html,
  });
}


 
// Email to USER
async function sendUserConfirmationEmail({ fullname, email, amount,newStatus }) {
  const transporter = createTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color:#2b6cb0;">Hello ${fullname},</h2>
      <p>We’ve made payment for the withdrawal requested: <b>${amount}</b> </p>
       
      <p>Thank you for using <b>Eduquizzglobal</b>.</p>
      <hr />
      <p style="font-size: 13px; color: #777;">&copy; ${new Date().getFullYear()} Eduquizz Global Limited. All rights reserved.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Eduquizzglobal" <${process.env.EMAIL_USER}>`,
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


  const { withdrawalId, newStatus, adminData} = req.body;
 
  if (!withdrawalId|| !newStatus || !adminData) {
      return res.status(400).json({ message: "Missing user details" });
    }

  const user = await WithdrawalRequest.find({_id:withdrawalId})

    if (!user) {
      return res.status(400).json({ message: "Missing user details" });
    }
 
    // Log activity
const activity = new Activity({
  _id: new mongoose.Types.ObjectId(),
  activity: "Withdrawal update",
  description: `User with the fullname: ${user[0].userData.fullname} and transaction ID: ${withdrawalId} withdrawal payment has been set to ${newStatus} by ${adminData.email}.`,
  createdAt: getFormattedDateTime(),
});
await activity.save();

 
const updateConfirmation = await WithdrawalRequest.findByIdAndUpdate(
  withdrawalId,
  {
    $set: { withdrawalConfirmation: newStatus },
    
  },
  { new: true, runValidators: true }
);

if(newStatus==="Successful"){
  const foundUser = await Register.find({email:user[0].userData.email})
    console.log("foundUser", foundUser)

    if (!foundUser) {
      return res.status(400).json({ message: "Missing user details" });
    }
  const currentUseramountMade = foundUser[0].amountMade
  console.log("currentUseramountMade",currentUseramountMade)

  const newAmount = currentUseramountMade-user[0].amount
  console.log("newAmount", newAmount)

  const updateUser = await Register.findByIdAndUpdate(
    user[0].userData._id,
    {
        $set: { amountMade: newAmount },
    
  },
  { new: true, runValidators: true }
    
  )
  
}



if(newStatus){
   // Send emails in parallel (non-blocking)
    await Promise.all([
      sendAdminAlertEmail({
        fullname: user[0].userData.fullname,
        email: user[0].userData.email,
        adminFullname:adminData.fullname,
        amount : user[0].amount,
        newStatus:newStatus
      }),
      sendUserConfirmationEmail({
        fullname: user[0].userData.fullname,
        email: user[0].userData.email,
     
        amount : user[0].amount,
        newStatus:newStatus
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
