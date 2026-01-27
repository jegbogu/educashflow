import connectDB from "../../../utils/connectmongo";
import Quiz from "@/model/quizCreation";

async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      await connectDB()
      const { id } = req.query;
  
   const deleteItem =  await Quiz.findByIdAndDelete(id)
   if(!deleteItem){
    return res.status(404).json({message:"Not found"})
   }

    return res.status(200).json({message:"Deleted Successfully"})

    } catch (error) {
        console.error(error)
        return res.status(500).json({message:"Internal Server Err"})
    }
     
    
  }
}

export default handler