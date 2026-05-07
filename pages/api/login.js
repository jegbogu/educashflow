import connectDB from "../../utils/connectmongo";
import Register from "../../model/registerSchema";
import Admin from "../../model/adminSchema";
import Activity from "../../model/recentactivities";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import fetch from "node-fetch";

// format date
function getFormattedDateTime() {
  const now = new Date();
  return now.toISOString(); // cleaner for DB
}

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { email, password, role } = req.body;
    console.log({ email, password, role })

    // =======================
    // ADMIN LOGIN
    // =======================
    if (role === "admin") {
      const admin = await Admin.findOne({ email });

      if (!admin) {
        return res.status(403).json({ message: "Not an Admin" });
      }

      const valid = await bcrypt.compare(password.trim(), admin.password);

      if (!valid) {
        return res.status(403).json({ message: "Invalid credentials" });
      }

      return res.status(200).json(admin);
    }

    // =======================
    // USER LOGIN
    // =======================
    const user = await Register.findOne({
      $or: [{ email }, { username: email }],
    });

  

    if (!user) {
      return res.status(403).json({ message: "Invalid email or password" });
    }

    const validUser = await bcrypt.compare(password.trim(), user.password);

    if (!validUser) {
      return res.status(403).json({ message: "Invalid email or password" });
    }

    // prevent multiple login
    if (user.isloggedin) {
      return res.status(403).json({ message: "User already logged in" });
    }

    // =======================
    // GET USER IP
    // =======================
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "8.8.8.8";

    // =======================
    // GET LOCATION
    // =======================
    let locationData = {};
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      locationData = await response.json();
    } catch (err) {
      console.log("Location fetch failed:", err);
    }

    // =======================
    // UPDATE USER (ONE QUERY)
    // =======================
    const updatedUser = await Register.findOneAndUpdate(
      { _id: user._id, isloggedin: false },
      {
        $set: {
          isloggedin: true,
          userlocation: {
            ip,
            city: locationData.city || "Unknown",
            region: locationData.region || "Unknown",
            country: locationData.country_name || "Unknown",
            latitude: locationData.latitude || null,
            longitude: locationData.longitude || null,
            updatedAt: new Date() 
            },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(403).json({ message: "Already logged in" });
    }

    // =======================
    // SAVE ACTIVITY
    // =======================
    const newActivity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: "User Logged In",
      description: email,
      createdAt: getFormattedDateTime(),
    });

    await newActivity.save();

    // =======================
    // RESPONSE
    // =======================
    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export default handler;