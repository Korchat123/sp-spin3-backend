import mongoose from "mongoose";
import { act } from "react";

const tableSchema = new mongoose.Schema({
  tableId: {type: String},
  status: {type: String},
  date_and_time: {type: String},
  active_status: {type: String},
  staff_id: {type: String},
  customerOrder_id: {type: String},
  orderId: {type: String},
});

export const Table = mongoose.model("Table", tableSchema);
