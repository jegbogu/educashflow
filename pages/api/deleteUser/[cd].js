 import connectDB from "../../../utils/connectmongo";
//  import Activity from "../../model/recentactivities";
import Register from "@/model/registerSchema";

async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      await connectDB()
      const { cd } = req.query;
     console.log(cd)
 
  const [userid, adminEmail, useremail ] = cd.split("-")
   const deleteItem =  await Register.findByIdAndDelete(userid)
   if(!deleteItem){
    return res.status(404).json({message:"Not found"})
   }

   // Log activity
    const newActivity = new Activity({
      _id: new mongoose.Types.ObjectId(),
      activity: `Deletion of User`,
      description: `A User With The Email ${useremail} Has Been Successfully Deleted by ${adminEmail}`,
      createdAt: getFormattedDateTime(),
    });

    await newActivity.save();

    return res.status(200).json({message:"Deleted Successfully"})

    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Err"})
    }
     
    
  }
}

export default handler