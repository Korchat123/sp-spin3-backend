import { Router } from "express";
import { Menu } from "./Menu.js";

const router = Router();

export const getMenu = async (req, res, next) => {
  try {
    const menus = await Menu.find();
    res.status(200).json({ 
      success: true, 
      data: menus 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export const createMenu = async (req, res, next) => {
  try {
    const { name, price, quantity, category, active_status } = req.body;

    const newMenu = new Menu({
      name,
      price,
      quantity,
      category,
      active_status,
    });

    const savedMenu = await newMenu.save();
    res.status(201).json({
      success: true,
      message: "Sucess",
      data: savedMenu,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Can't create menu",
      error: err.message,
    });
  }
};

export const putMenu = async (req, res, next) => {
  try {
    // หาด้วย ID และอัปเดต พร้อมกับคืนค่า object ตัวใหม่กลับมา (new: true)
    const doc = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true // เพิ่มตัวเลือกนี้เพื่อให้ Mongoose เช็ค Schema ตอนอัปเดตด้วย
    });

    if (!doc) {
      return res.status(404).json({ success: false, error: "ไม่พบเมนูดังกล่าว (Menu not found)" });
    }
    return res.status(200).json({ success: true, message: "อัปเดตเมนูสำเร็จ", data: doc });
  } catch (err) {
    next(err); // ส่ง error ให้ Error Handler Middleware จัดการต่อ
  }
};

export const deleteMenu = async (req, res, next) => {
  try {
    const doc = await Menu.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({ success: false, error: "ไม่พบเมนูที่ต้องการลบ (Menu not found)" });
    }

    return res.status(200).json({ success: true, message: "ลบเมนูสำเร็จ (Success delete menu)", data: doc });
  } catch (err) {
    next(err);
  }
};