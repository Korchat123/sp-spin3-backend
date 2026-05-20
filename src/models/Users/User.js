import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    role: { type: String, enum: ["user", "owner", "admin", "cashier","cook","rider", ], default: "user" },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },
    active_status:{ Boolean,} //must ?
  },

  { timestamps: true },
);
export const User = mongoose.model("User", userSchema);