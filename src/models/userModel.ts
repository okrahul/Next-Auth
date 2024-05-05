import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide name"],
    unique: [true, "name should be unique"],
  },

  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: [true, "name should be unique"],
  },

  password: {
    type: String,
    required: [true, "Please provide password"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.user || mongoose.model("user", userSchema); // next js fetch user data on edge

export default User;
