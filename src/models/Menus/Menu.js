import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "กรุณาระบุชื่อเมนู"],
      trim: true, // ตัดช่องว่างหัวท้าย
    },
    price: {
      type: Number,
      min: [0, "ราคาต้องไม่ติดลบ"],
    },
    quantity: {
      type: Number,
      required: [true, "กรุณาระบุจำนวน"],
      min: [0, "จำนวนต้องไม่ติดลบ"],
      default: 0, // ตั้งค่าเริ่มต้นเป็น 0
    },
    category: {
      type: String,
      required: [true, "ระบุประเภท"],
      enum: ["main", "side", "dessert", "drink"],
    },
    avaiable_count: {
      type: String,
      default: true,
    },
    avaiable_count: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true },
);

export const Menu = mongoose.model("Menu", menuSchema);
