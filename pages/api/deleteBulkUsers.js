import connectDB from "@/utils/connectmongo";
import Quiz from "@/model/quizCreation";
import Activity from "@/model/recentactivities";
import mongoose from "mongoose";

function getFormattedDateTime() {
  return new Date().toISOString();
}

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { data, adminemail } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No users IDs provided" });
    }

    const deleted = await Quiz.deleteMany({
      _id: { $in: data },
    });

    // ✅ Save activity FIRST
    const newActivity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: "Bulk Users Deleted",
      description: `${deleted.deletedCount} users(s) deleted by ${adminemail}`,
      createdAt: getFormattedDateTime(),
    });

    await newActivity.save();

    return res.status(200).json({
      message: "Selected users were successfully deleted",
      deletedCount: deleted.deletedCount,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default handler;
