import Activity from "@/model/recentactivities";
import mongoose from "mongoose";
import Register from "@/model/registerSchema";
import connectDB from "@/utils/connectmongo";

// Optional: keep the helper if you really want formatted strings
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

    // Create a new activity
    const newActivity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: "A User Just Started a Quiz",
      description: uniqueID,
      createdAt: new Date(), // store as Date object (better for querying)
    });

    await newActivity.save();

    // Find and update user
    const user = await Register.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.playedGames.push(startQuiz);
    await user.save();

    return res.status(200).json({ message: "Activity recorded successfully", data: startQuiz });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
