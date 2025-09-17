import { Schema, model, models } from 'mongoose'
const mongoose = require('mongoose')

const ActivitySchema = new Schema({
  activity: {
   type: String,
    required: true,
   
    trim: true,
  },
  
  description: {
    type: String,
    required: true,
   
    trim: true,
 
  },
   
  createdAt: {
   type: String,
    required: true,
   
    trim: true,
  },
   

   
})

 

const Activity = models.Activity || mongoose.model("Activity", ActivitySchema);

export default Activity;