import connectDB from "../../utils/connectmongo";
import Register from "../../model/registerSchema";
import Activity from "../../model/recentactivities";
import mongoose from "mongoose";

// format date
function getFormattedDateTime() {
  return new Date().toISOString();
}

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // =======================
    // FIND USER
    // =======================
    const user = await Register.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Invalid User" });
    }

    // =======================
    // CHECK IF ALREADY LOGGED OUT
    // =======================
    if (!user.isloggedin) {
      return res.status(400).json({ message: "User already logged out" });
    }

    // =======================
    // UPDATE USER (LOGOUT)
    // =======================
    const updatedUser = await Register.findByIdAndUpdate(
      id,
      { $set: { isloggedin: false } },
      { new: true }
    );

    // =======================
    // SAVE ACTIVITY
    // =======================
    const newActivity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: `User with email ${user.email} just logged out`,
      description: user.email,
      createdAt: getFormattedDateTime(),
    });

    await newActivity.save();

    // =======================
    // RESPONSE
    // =======================
    return res.status(200).json({
      message: "Logout successful",
      user: updatedUser,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export default handler;