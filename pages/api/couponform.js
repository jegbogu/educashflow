import mongoose from "mongoose";
import Coupon from "@/model/coupons";
 


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
        const newCoupon = new Register({
          _id: couponId,
          fullname,
          username,
          email,
          password: hashedPassword,
          activate: false,                 // boolean, not string
          createdAt: new Date(),  
          level: 0,
          amountMade: 0,
          points: 0,
          membership:"Free plan",
          role: "user",
        });
    
        await newCoupon.save();
    

  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export default handler;
