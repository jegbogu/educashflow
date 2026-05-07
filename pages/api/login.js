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
  return now.toISOString();
}

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { email, password, role } = req.body;

    

    // =====================================
    // ADMIN LOGIN
    // =====================================
    if (role === "admin") {
      const admin = await Admin.findOne({ email });

      if (!admin) {
        return res.status(403).json({ message: "Not an Admin" });
      }

      const valid = await bcrypt.compare(
        password.trim(),
        admin.password
      );

      if (!valid) {
        return res.status(403).json({
          message: "Invalid credentials",
        });
      }

      return res.status(200).json(admin);
    }

    // =====================================
    // USER LOGIN
    // =====================================
    const user = await Register.findOne({
      $or: [{ email }, { username: email }],
    });

    console.log(user)

    if (!user) {
      return res.status(403).json({
        message: "Invalid email or password",
      });
    }

    const validUser = await bcrypt.compare(
      password.trim(),
      user.password
    );

    if (!validUser) {
      return res.status(403).json({
        message: "Invalid email or password",
      });
    }

    // =====================================
    // PREVENT MULTIPLE LOGIN
    // =====================================
    if (user.activate?.userloggedin === "true") {
      return res.status(403).json({
        message: "User already logged in",
      });
    }

     // =====================================
// GET REAL USER IP
// =====================================

let ip =
  req.headers["x-forwarded-for"] ||
  req.headers["x-real-ip"] ||
  req.socket?.remoteAddress ||
  "";

if (ip.includes(",")) {
  ip = ip.split(",")[0].trim();
}

// remove IPv6 prefix
if (ip.includes("::ffff:")) {
  ip = ip.replace("::ffff:", "");
}

console.log("USER IP:", ip);

// =====================================
// GET USER LOCATION
// =====================================

let data = {};

try {

  const response = await fetch(
    `https://ipapi.co/${ip}/json/`
  );

  data = await response.json();

   

} catch (err) {

  console.log("Location fetch failed:", err);

}

// =====================================
// UPDATE USER
// =====================================

const updatedUser = await Register.findByIdAndUpdate(
  user._id,
  {
    $set: {

      "activate.userloggedin": "true",

      userlocation: {

  ip ,

  city: data.city || "Unknown",

      region: data.region || "Unknown",

      country: data.country_name || "Unknown",

      latitude: data.latitude || null,

      longitude: data.longitude || null,

      timezone: data.timezone || "Unknown",

      isp: data.org || "Unknown",

      postal: data.postal || "Unknown",

      currency: data.currency || "Unknown",

      countryCode: data.country_code || "Unknown",

  updatedAt: new Date(),

},
    },
  },
  { new: true }
);

    // =====================================
    // SAVE ACTIVITY
    // =====================================
    const newActivity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: "User Logged In",
      description: email,
      createdAt: getFormattedDateTime(),
    });

    await newActivity.save();

    // =====================================
    // RESPONSE
    // =====================================
    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

export default handler;