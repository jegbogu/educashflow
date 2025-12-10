import connectDB from "../../utils/connectmongo";
import Register from "../../model/registerSchema";
  import Activity from '../../model/recentactivities'
import bcrypt from "bcrypt"
import mongoose from "mongoose"

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
  


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { userID, newPassword, invalidateSessions } = req.body;
    

    if (!userID || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate user exists
    const user = await Register.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent resetting to same old password
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ message: "New password cannot be the same as old password" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password + optionally delete all sessions/tokens
    const updateFields = {
      password: hashedPassword,
    };

    // 🚀 Logout on all devices: invalidate refresh tokens / sessions
    if (invalidateSessions) {
      updateFields.refreshTokens = []; // OR whatever your session storage is
      updateFields.sessionVersion = (user.sessionVersion || 0) + 1;

      // If you store reset tokens in DB:
      updateFields.resetToken = null;
      updateFields.resetTokenExpiry = null;
    }

    await Register.findByIdAndUpdate(userID, updateFields);

    //saving activities for record sake
              const newActivity = new Activity({
                     _id: new mongoose.Types.ObjectId(),
                     activity:"A User just did forgot password",
                     description:userID,
                     createdAt: getFormattedDateTime()
                    
                   });
             
                   await newActivity.save();

    return res.status(200).json({
      message: "Password reset successful. All sessions invalidated.",
    });

  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
