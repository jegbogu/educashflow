// pages/api/activate-admin/[id].js

import connectDB from "../../../utils/connectmongo";
import Admin from "../../../model/adminSchema";

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;

      await connectDB();

      // Find admin by ID
      const admin = await Admin.findById(id);

      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      // Check if already activated
      if (admin.activate === "true") {
        return res.json({ success: true, message: "Admin already activated" });
      }

      // Activate account
      admin.activate = "true";
      await admin.save();

      res.json({ success: true, message: "Admin activated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default handler;
