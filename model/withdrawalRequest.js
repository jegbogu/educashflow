import mongoose, { Schema, models } from "mongoose";
 
const WithdrawalRequestSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  
    trim: true,
  },
  email: {
    type: String,
    required: true,
  
    trim: true,
  },
  accountName: {
    type: String,
    required: true,
  
    trim: true,
  },
  bankName: {
    type: String,
    required: true,
  
    trim: true,
  },
  accountNumber: {
    type: String,
    required: true,
  
   
  },
  amount: {
    type: Number,
    required: true,
  
    trim: true,
  },
  withdrawalConfirmation: {
    type: String,
    required: true,
    default:"Pending",
    trim: true,
  },
  userData:{
    type: Object
  },
   
   
   
});

// Avoid model overwrite in dev
const WithdrawalRequest  = models.WithdrawalRequest || mongoose.model("WithdrawalRequest", WithdrawalRequestSchema);

export default WithdrawalRequest;
