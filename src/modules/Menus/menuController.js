import { Menu } from "./Menu.js";

export const getMenu = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createMenu = async (req, res) => {
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
