import connectDB from "../../utils/connectmongo"
import Register from '../../model/registerSchema'
import Admin from '../../model/adminSchema'
 
import bcrypt from "bcrypt"
 
 
  
     
    
 async function handler(req,res){
    if(req.method === 'POST'){
        try {
        await connectDB()
        const{email, password, role} = req.body
        console.log("backend",{email, password,role})
        if(role==='admin'){
            console.log("ROLE",{ email, password })
            const user = await Admin.findOne({ email })
            console.log("user",user)
            if (!user) {
                res.status(403).json({ message: 'not an Admin' })
                return
            }
            const validUser = await bcrypt.compare(password, user.password)
            console.log(validUser)
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
         res.status(200).json(user);
        
         
         
        } catch (error) {
            console.log(error)
        }
    }
}

export default handler