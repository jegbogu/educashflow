import connectDB from "../../utils/connectmongo"
import Register from '../../model/registerSchema'
import Admin from '../../model/adminSchema'
 import Activity from '../../model/recentactivities'
import bcrypt from "bcrypt"
import mongoose from "mongoose"
 
 
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
     
    
 async function handler(req,res){
    if(req.method === 'POST'){
        try {
        await connectDB()
        const{email, password, role} = req.body
       
        if(role==='admin'){
            console.log("ROLE",{ email, password })
            const user = await Admin.findOne({ email })
           
            if (!user) {
                res.status(403).json({ message: 'not an Admin' })
                return
            }
            const validUser = await bcrypt.compare(password, user.password)
          
            if (!validUser) {
                res.status(403).json({ message: 'not an Admin' })
                return
            }
            
            res.status(200).json(user);
        }
       
        const user = await Register.findOne({email}) 
        //  console.log(user)
         if(!user){
            res.status(403).json({message:'Password or Email is not correct'})
            return;
         }
         const validUser = await bcrypt.compare(password, user.password)
        //  console.log(validUser)
         if(!validUser){
            res.status(403).json({message:'Password or Email is not correct'})
          return;
         }
         //saving activities for record sake
          const newActivity = new Activity({
                 _id: new mongoose.Types.ObjectId(),
                 activity:"A User logged in",
                 description:email,
                 createdAt: getFormattedDateTime()
                
               });
         
               await newActivity.save();

         res.status(200).json(user);
        
         
         
        } catch (error) {
            console.log(error)
        }
    }
}

export default handler