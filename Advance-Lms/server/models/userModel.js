import mongoose, { Schema } from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 2, max: 50 },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
    max: 50,
  },

  password: { type: String, required: true, minlength: 6, Select: false },

  avatar: {
    public_id: { type: String, required: true },
    url: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/diviym6af/image/upload/v1745609046/WhatsApp_Image_2025-04-26_at_00.52.24_ea06d92f_ukc5us.jpg",
    },
  },

  role: { type: String, enum: ["admin", "user"], default: "user" },

  subscription: { id: String, status: String },

  enrolledCourses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      enrolledAt: {
        type: Date,
        default: Date.now,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],

  createdAt: { type: Date, default: Date.now },

  resetPasswordToken: String,

  resetPasswordExpire: String,
});

userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
