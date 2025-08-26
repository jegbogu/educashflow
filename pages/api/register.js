import connectDB from "../../utils/connectmongo"
import Register from '../../model/registerSchema'
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()

//this is for date and time
function getFormattedDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

// Send activation email
async function sendActivationEmail(email, userId, fullname) {
  // transporter (use your SMTP config, e.g. Gmail, Mailgun, etc.)
  const transporter = nodemailer.createTransport({
    service: "gmail", // or any SMTP service
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // your app password
    },
  });

  const activationLink = `${process.env.BASE_URL}/api/activate/${userId}`;

  await transporter.sendMail({
  from: `"Educashflow" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Activate your Educashflow Account",
  text: `
Welcome to Educashflow!

Thank you for registering. To activate your account, click the link below:

${activationLink}

If you did not create this account, please ignore this email.

----------------------
Educashflow Team
${new Date().getFullYear()} © All rights reserved.
Support: ${process.env.EMAIL_USER}
  `,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
      
      <!-- Header -->
      <div style="background-color: #2b6cb0; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">Educashflow</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px; color: #333;">
        <h2 style="color: #2b6cb0; margin-top: 0;">Welcome, ${fullname || "User"}!</h2>
        <p style="font-size: 15px; line-height: 1.6;">
          Thank you for registering with <b>Educashflow</b>. To activate your account and get started, 
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

      <!-- Footer -->
      <div style="background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 13px; color: #777;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Educashflow. All rights reserved.</p>
        <p style="margin: 5px 0;">Need help? <a href="mailto:${process.env.EMAIL_USER}" style="color: #2b6cb0; text-decoration: none;">Contact Support</a></p>
      </div>
    </div>
  `,
});

}

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { fullname, username, email, password } = req.body;
       
      await connectDB();

      // Check if email or username exists
      const existingUser = await Register.findOne({
        $or: [{ email: email }, { username: username }]
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email or Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = new Register({
        _id: new mongoose.Types.ObjectId(),
        fullname,
        username,
        email,
        password: hashedPassword,
        activate: "false",
        createdAt: getFormattedDateTime(),
        role: "user"
      });

      await newUser.save();
      console.log("newUser", newUser)

      // Send activation email
      await sendActivationEmail(email, newUser._id,fullname);

      res.status(200).json({ message: "Registration successful, please check your email to activate your account" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default handler;
