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
  useractivated: String,
  userloggedin: String,
  
},
  createdAt: {
    type: String,
    
  },
  level:{
    type:Number
  },
  amountMade:{
    type:Number
  },
  points:{
    type:Number
  },
  membership:{
    type:String
  },
  paymentConfirmation:{
    type:String
  },
  coupon:{
    type: String,
    default:"Null"
  },
  playedGames:{
    type: Array,
    default:[]
  },
  usergames:{
    type: Array,
    default:[]
  },
   
  usedCoupons:{
     type: Array,
    default:[]
  },
  latestPurchase:{
     type: Array,
    default:[]
  },
   latestPurchaseGames:{
     type: Array,
    default:[]
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
  spaceFour: {
    type: Number,
  },
  spaceFive: {
    type: String,
  },
  spaceSix: {
    type: String,
  },
  
 userlocation: {

  ip: String,

  city: String,

  region: String,

  country: String,

  latitude: Number,

  longitude: Number,

  timezone: String,

  isp: String,

  org: String,

  updatedAt: Date,
}
});

// Avoid model overwrite error in Next.js
const Register = models.Register || mongoose.model("Register", registerSchema);

export default Register;
