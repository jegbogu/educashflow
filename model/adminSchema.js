import { Schema, model, models } from 'mongoose'
const mongoose = require('mongoose')

const adminSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    minLength: [5, "Fullname must be more than 5 characters"],
    lowercase: true,
    trim: true,
  },
  
  email: {
    type: String,
    required: true,
    minLength: [5, "Email must be more than 5 characters"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must be more than 8 characters"],
    trim: true,
  },
  role: {
    type: String,
  },
  activate: {
    type: String,
  },
  createdAt: {
    type: String,
    
  },
  spaceOne: {
    type: String,
  },
  spaceTwo: {
    type: String,
  },
  spaceThree: {
    type: Number,
  }

   
})

module.exports = models.Admin || mongoose.model('Admin', adminSchema)