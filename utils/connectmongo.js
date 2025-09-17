 
const mongoose = require('mongoose')
const dbLink = `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@cluster0.zvp7krc.mongodb.net/${process.env.DB}`
 
 

const connectDB = async ()=>{
    try {
        await mongoose.connect(dbLink,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('mongoDB is connected Successfully')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
    
}

export default connectDB