import mongoose from "mongoose";

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_type: {
      type: String,
      enum: ["DINE_IN", "TAKEAWAY", "DELIVERY"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COOKING", "SERVED", "COMPLETED", "CANCELLED"],
      required: true,
    },
    table_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      default: null,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
      default: null,
    },
    subtotal: { type: Number, required: true },
    discount_applied: { type: Number, default: 0 },
    total_tax: { type: Number, default: 0 },
    total_price: { type: Number, required: true },
    payment_method: {
      type: String,
      enum: ["cash", "card", "qr", null],
      default: null,
    }, // เช่น CASH, CREDIT_CARD, PROMPTPAY
    payment_time: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
