import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["main", "side", "dessert", "drink"], },
    value: { type: String, required: true,  },
    date_from: { type: String, required: true, },
    date_to:{ type: String, required: true, }, 
    active_status:{ Boolean,}
  },

  { timestamps: true },
);
export const Promotion = mongoose.model("Promotion", userSchema);