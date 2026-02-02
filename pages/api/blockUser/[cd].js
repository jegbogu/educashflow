import connectDB from "../../../utils/connectmongo";
import Activity from "@/model/recentactivities";
import Register from "@/model/registerSchema";
import mongoose from "mongoose";

/** ---------- Helpers ---------- **/

function getFormattedDateTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { cd } = req.query;
    const [userid, adminEmail, username] = cd.split("-");

    const user = await Register.findById(userid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔁 Toggle role
    const isBlocked = user.role === "user-blocked";
    const newRole = isBlocked ? "user" : "user-blocked";

    user.role = newRole;
    await user.save();

    // 📝 Activity log
    const actionText = isBlocked ? "Unblocked User" : "Blocked User";

    const newActivity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: actionText,
      description: `User with username ${username} was ${isBlocked ? "unblocked" : "blocked"} by ${adminEmail}`,
      createdAt: getFormattedDateTime(),
    });

    await newActivity.save();

    return res.status(200).json({
      message: isBlocked ? "User unblocked successfully" : "User blocked successfully",
      role: newRole,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default handler;
