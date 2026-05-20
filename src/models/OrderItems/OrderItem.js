import mongoose from "mongoose";

const orderItemsSchema = new mongoose.Schema({
    orderId ={},
    menuId ={},
    quantity ={},
    price ={},
    date ={}
});
export const OrderItem = mongoose.model("OrderItem", orderItemsSchema);