import mongoose, { Schema, models } from "mongoose";

const registerSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    minLength: [5, "Fullname must be more than 5 characters"],
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    minLength: [3, "Username must be more than 3 characters"],
    lowercase: true,
    trim: true,
    unique: true,
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
  },
});

// Avoid model overwrite error in Next.js
const Register = models.Register || mongoose.model("Register", registerSchema);

export default Register;
