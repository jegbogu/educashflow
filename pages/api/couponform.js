import mongoose from "mongoose";
import Coupon from "@/model/coupons";
import connectDB from "@/utils/connectmongo";
 


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


async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
await connectDB()
  try {
    const {
        code,
        description, 
        gameLimit, 
        expiryDays, 
        autoExpire,
    } = req.body;

    
console.log({
        code,
        description, 
        gameLimit, 
        expiryDays, 
        autoExpire,
    })

    const couponId = new mongoose.Types.ObjectId();
        const newCoupon = new Coupon({
          _id: couponId,
          code,
          description,
          gameLimit,
          expiryDays,
          activate: true,                 // boolean, not string
          createdAt: new Date(),  
          autoExpire,
          
        });
    
        await newCoupon.save();
    
return res.status(200).json({ message: "Coupon successfully created" });
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export default handler;
