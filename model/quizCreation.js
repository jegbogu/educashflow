import { Schema, model, models } from "mongoose";
const mongoose = require("mongoose");

const QuizSchema = new Schema({
   
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: [
    
      { type: String, required: true, trim: true },
       
     
  ],
  correctAnswer:{
    type: Number
  },
  category: {
    type: String,
    trim: true,
  },
  level: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = models.Quiz || mongoose.model("Quiz", QuizSchema);
