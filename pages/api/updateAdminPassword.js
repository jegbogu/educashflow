import connectDB from "../../utils/connectmongo";
 import Admin from "@/model/adminSchema";
import Activity from "../../model/recentactivities";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
 

// date + time helper
function getFormattedDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    // ✅ MATCH FRONTEND PAYLOAD
    const { data } = req.body;

    if (!data.currentPassword || !data.newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    // 🔐 Get admin user (adjust query if needed)
    const user = await Admin.findById(data.id);
 
     

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // 🔑 Verify current password
    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // 🚫 Prevent same password reuse
    const isSame = await bcrypt.compare(data.newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    // 🔐 Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 12);

    // ✅ Update password
    await Register.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    // 📝 Save activity log
    const newActivity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: "Admin updated password",
      description: `${user._id.toString()} || ${user.email}`,
      createdAt: getFormattedDateTime(),
    });

    await newActivity.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Password update error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
