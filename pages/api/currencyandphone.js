import mongoose from "mongoose";
import connectDB from "../../utils/connectmongo";
import Register from "../../model/registerSchema";
import Activity from "../../model/recentactivities";
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
         currency,
         phone,
         countryData,
         userData
    } = req.body;
     
if(currency !=="Naira" && currency!=="Dollar"){
    return res.status(400).json({message:"You must choose a currency"})
}
if(phone.length < 10 || phone== "" || countryData == null){
    return res.status(400).json({message:"You must put the right phone number"})
}
 
 const updatePhoneAndCurrency = await Register.findByIdAndUpdate(
  userData._id,
  {
    $set: { 
    spaceOne: `${currency}-${countryData.name}`, 
    spaceThree: phone 
  },
   
    
  },
   
  { new: true, runValidators: true }
);

 
    
     // Log activity
         const newActivity = new Activity({
           _id: new mongoose.Types.ObjectId(),
           activity: "Currency and Phone number updated",
           description: userData.email,
           createdAt: getFormattedDateTime(),
         });
         await newActivity.save()
    
return res.status(200).json({ message: "Completed" });
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export default handler;
