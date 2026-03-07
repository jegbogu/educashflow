// pages/api/activate-admin/[id].js

import connectDB from "../../../utils/connectmongo";
 import Register from "@/model/registerSchema";

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;

      await connectDB();

      // Find admin by ID
      const user = await Register.findById(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if already activated
      if (user.activate === "true") {
        return res.json({ success: true, message: "User already activated" });
      }

      // Activate account
      user.activate = "true";
      await user.save();

      res.json({ success: true, message: "user activated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default handler;
