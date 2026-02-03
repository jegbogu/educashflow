import connectDB from "../../utils/connectmongo";
 import Admin from "@/model/adminSchema";
import Activity from "../../model/recentactivities";
 
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
    const { profileData } = req.body;
    console.log("profileData",profileData)

    if (!profileData.email || !profileData.newUsername) {
      return res.status(400).json({
        message: "Email and Username are both required",
      });
    }

    // 🔐 Get admin user (adjust query if needed)
    const user = await Admin.findById(profileData.id);
 
     

    if (user.email !== profileData.email) {
      return res.status(404).json({ message: "Admin not found" });
    }

     

    

    // ✅ Update password
    await Admin.findByIdAndUpdate(user._id, {
      username: profileData.newUsername,
    });

    // 📝 Save activity log
    const newActivity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: "Admin updated username",
      description: `${user._id.toString()} || ${user.email}`,
      createdAt: getFormattedDateTime(),
    });

    await newActivity.save();

    return res.status(200).json({
      message: "Username updated successfully",
    });
  } catch (error) {
    console.error("Username update error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
