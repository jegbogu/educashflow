import connectDB from "@/utils/connectmongo";
import Register from "@/model/registerSchema";
import Activity from "@/model/recentactivities";
import bcrypt from "bcrypt";
import mongoose from "mongoose";


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

    const { profileData } = req.body;
console.log(profileData)
    if (!profileData.id) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    const user = await Register.findById(profileData.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    let updateFields = {};

     

    // 🔐 Password update
    if (profileData.password) {

      const hashedPassword = await bcrypt.hash(profileData.password, 10);

      updateFields.password = hashedPassword;

    }

    await Register.findByIdAndUpdate(user._id, updateFields);


    // Activity log
    const activity = new Activity({

      _id: new mongoose.Types.ObjectId(),

      activity: "User updated profile",

      description: `${user._id.toString()} || ${user.email}`,

      createdAt: getFormattedDateTime()

    });

    await activity.save();


    return res.status(200).json({
      message: "Profile updated successfully"
    });

  } catch (error) {

    console.error("Profile update error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });

  }

}