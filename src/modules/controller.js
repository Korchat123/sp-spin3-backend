import e from "express";
import { Menu } from "./Menus/Menu.js";

export const getMenus = async (req, res) => {
    try {
        const menus = await Menu.findOne({name});
        res.json(menus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createMenu = async (req, res) => {
    try {
        const { name, price, quantity, category } = req.body;

        const newMenu = new Menu({
            name,
            price,
            quantity,
            category,
        });

        const savedMenu = await newMenu.save();
        res.status(201).json({
            success: true,
            message: "สร้างเมนูสำเร็จ",
            data: savedMenu,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "ไม่สามารถสร้างเมนู",
            error: error.message,
        });
    }
};



