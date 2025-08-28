import connectDB from "../../utils/connectmongo";
import Admin from "../../model/adminSchema";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

function generatePassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function getFormattedDateTime() {
  const now = new Date();
  return now.toISOString();
}

async function sendEmailToChiefAdmin(newAdmin, plainPassword, activationLink) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Or SMTP config if not Gmail
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"System Notification" <${process.env.EMAIL_USER}>`,
    to: process.env.CHIEF_ADMIN_EMAIL, // Chief Admin email from env
    subject: "New Admin Created - Activation Required",
    html: `
      <h2>New Admin Account Created</h2>
      <p><b>Full Name:</b> ${newAdmin.fullname}</p>
      <p><b>Email:</b> ${newAdmin.email}</p>
      <p><b>Temporary Password:</b> ${plainPassword}</p>
      <br/>
      <p>Please click the link below to activate this account:</p>
      <a href="${activationLink}" target="_blank">${activationLink}</a>
    `,
  });
}

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { fullname, email } = req.body;

      await connectDB();

      // Generate unique password
      const plainPassword = generatePassword();

      // Hash password
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Create new admin record
      const doc = new Admin({
        _id: new mongoose.Types.ObjectId(),
        fullname,
        email,
        password: hashedPassword,
        activate: "false",
        createdAt: getFormattedDateTime(),
        role: "admin",
      });

      await doc.save();

      // Generate activation link (adjust your frontend route)
      const activationLink = `${process.env.BASE_URL}/activate-admin/${doc._id}`;

      // Send email to Chief Admin
      await sendEmailToChiefAdmin(doc, plainPassword, activationLink);

      res.json({ success: true, message: "Admin created & email sent", doc });
    } catch (error) {
 
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default handler;
