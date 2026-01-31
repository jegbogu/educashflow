import Activity from "@/model/recentactivities";
import mongoose from "mongoose";
import Register from "@/model/registerSchema";
import connectDB from "@/utils/connectmongo";

// Optional: keep the helper
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
    const { uniqueID, userID, startQuiz } = req.body;
     
    await connectDB();

    // Find user
    const user = await Register.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ================================
    //   PACKAGE EXPIRY CHECKS
    // ================================
    const latestPurchase = user.latestPurchase;

    if (latestPurchase && latestPurchase.length > 0) {
      const expiryDate = latestPurchase[latestPurchase.length - 1].expiryDate;

      if (expiryDate) {
        const exp = new Date(expiryDate);
        const today = new Date();

        // Remove time for accurate date comparison
        exp.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        // Calculate days difference
        const diffMs = exp.getTime() - today.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // positive = days left, negative = expired

        // ❌ Package expired already
        if (diffDays < 0) {
          return res.status(403).json({
            message: `Package expired ${Math.abs(diffDays)} day(s) ago`,
          });
        }

        // ❌ Package expires today
        if (diffDays === 0) {
          return res.status(403).json({
            message: "Package expired today",
          });
        }

        // ❌ Package will expire in 3 days
        if (diffDays === 3) {
          return res.status(200).json({
            message: "Your package will expire in 3 days",
          });
        }
      }
    }

    // ==================================
    // CREATE ACTIVITY
    // ==================================
    const newActivity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: "A User Just Started a Quiz",
      description: `${startQuiz} || ${user.email}`,
      createdAt: new Date(),
    });

    await newActivity.save();

    // Update user game played count
    user.playedGames.push(startQuiz);
    await user.save();

    return res.status(200).json({
      message: "Activity recorded successfully",
      data: startQuiz,
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
