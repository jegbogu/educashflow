import { Schema, model, models } from "mongoose";
const mongoose = require("mongoose");

const CouponSchema = new Schema({
   
  code:{
    type: String
  },
  description: {
    type: String,
   
  },
  gameLimit: {
    type: Number,
 
  },
  
  expiryDays: {
    type: Number,
 
  },
  autoExpire: {
    type: Boolean,
 
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

 
const Quiz = models.Coupons || mongoose.model("Coupon", CouponSchema);

export default Coupon;