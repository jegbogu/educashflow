import mongoose, { Schema, models } from "mongoose";

const ConfirmPaymentSchema = new Schema({
  packageName: {
    type: String,
    required: true,
  
    trim: true,
  },
  price: {
    type: String,
    required: true,
  
    trim: true,
  },
  paymentConfirmation: {
    type: String,
    required: true,
    default:"Pending",
    trim: true,
  },
  userData:{
    type: Object
  },
  coupon:{
    type: String,
    default:"Null"
  },
   
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Avoid model overwrite in dev
const ConfirmPayment  = models.ConfirmPayment || mongoose.model("ConfirmPayment", ConfirmPaymentSchema);

export default ConfirmPayment;
