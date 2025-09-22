import connectDB from "../../utils/connectmongo";
import  Quiz from "../../model/quizCreation"
import mongoose from "mongoose";
 
 




async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { question, correctAnswer, options,category, subcategory, level} = req.body;
      console.log({ question, correctAnswer, options,category, subcategory, level} )
       
      if( !question|| correctAnswer===undefined || correctAnswer===null || !options ||!category ||!subcategory ||  !level){
         return res.status(402).json({success:"false", message:"All fileds are required"})
      } 
       
       
    
      await connectDB();
       

      // Create new admin record
      const doc = new Quiz({
        _id: new mongoose.Types.ObjectId(),
        question,
        correctAnswer,
        options,
        category,
        subcategory,
        level
         
      });

      await doc.save();

    

     return res.status(200).json({ success: true, message: "Question created successfully" });
    } catch (error) {
        // console.log(error)
    return  res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
   return res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default handler;
