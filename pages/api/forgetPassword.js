import connectDB from "../../utils/connectmongo";
import Register from "../../model/registerSchema";
import Activity from "../../model/recentactivities";
import mongoose from "mongoose";
import crypto from "crypto";
 import resetTokenStore from "@/utils/resetTokenStore";
import { sendResetEmail } from "../../utils/sendEmail";

function getFormattedDateTime() {
  const now = new Date();
  return now.toISOString();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { email } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    console.log("token", token)

    // Store in memory (expires in 15 min)
    const userID = user._id.toString()
      

      
    resetTokenStore( userID, token);

    // Build reset link
    const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}-${userID}`;

    // Send email
    await sendResetEmail(email, resetLink);

    // Log activity
    const newActivity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: "Password Reset Requested",
      description: email,
      createdAt: getFormattedDateTime(),
    });

    await newActivity.save();

    return res.status(200).json({
      message: "Reset link sent successfully",
    });

  } catch (error) {
    console.error("Error sending reset:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
