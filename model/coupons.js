import mongoose, { Schema, models } from "mongoose";

const CouponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  pack:{
type: String,
    required: true,
   
    trim: true,
  },
  cost:{
type: String,
    required: true,
  
  },
  rate:{
type: Number,
    required: true,
  
  },
  description: {
    type: Array,
    trim: true,
  },
  gameLimit: {
    type: Number,
    default: 0,
  },
  expiryDays: {
    type: Number,
    default: 0,
  },
  autoExpire: {
    type: Boolean,
    default: false,
  },
  couponStatus:{
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Avoid model overwrite in dev
const Coupon = models.Coupon || mongoose.model("Coupon", CouponSchema);

export default Coupon;
