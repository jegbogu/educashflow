import connectDB from "@/utils/connectmongo";
import Quiz from "@/model/quizCreation";

async function handler(req,res){
     
    if(req.method==="POST"){
        try {
            
    await connectDB()      
    const{data} = req.body;
    
  const deleted = await Quiz.deleteMany(
  { _id: { $in: data } }
   

);

if(deleted){
    return res.status(200).json({message:"Selected questions were successfully deleted "})
}

        } catch (error) {
            console.error(error)
            return res.status(500).json({message:"Internal Server Error"})
        }

    }
    
     
   
}

export default handler