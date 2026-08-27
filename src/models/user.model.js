import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "customer", "store"],
      default: "customer"
    },
    documents: [
     {
       name: { type: String, required: true },
       reference: { type: String, required: true }, 
       docType: { type: String, required: true },   
       mimeType: { type: String },
       size: { type: Number },
       uploadedAt: { type: Date, default: Date.now }
     }
   ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
