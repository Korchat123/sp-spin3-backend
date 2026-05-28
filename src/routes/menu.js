import { Router } from 'express'
import { Menu } from '../modules/Menus/Menu.js'
import { MenuLog } from '../modules/Menus/MenuLog.js'
import { isAuth, isEligible } from '../middleware/auth.js'

export const router = Router()

// GET all menus
// ?all=true returns all items (owner app)
// default returns only available:true items (customer app)
router.get('/', async (req, res) => {
  try {
    const { category, all } = req.query
    let filter = {}
    if (all !== 'true') {
      filter.available = true
    }
    if (category) {
      filter.category = category
    }
    const menus = await Menu.find(filter).sort({ category: 1, name: 1 })
    res.json(menus)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET menu activity log
router.get('/logs/all', isAuth, isEligible('owner'), async (req, res) => {
  try {
    const logs = await MenuLog.find().sort({ timestamp: -1 }).limit(100)
    res.json(logs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET single menu item
router.get('/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
    if (!menu) return res.status(404).json({ message: 'Menu item not found' })
    res.json(menu)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST create new menu item (owner only)
router.post('/', isAuth, isEligible('owner'), async (req, res) => {
  try {
    const { name, description, price, image, category, cookingTime } = req.body
    if (!name || price === undefined || !category) {
      return res.status(400).json({
        message: 'Missing required fields: name, price, category',
      })
    }
    const menu = new Menu({ name, description, price, image, category, cookingTime })
    const newMenu = await menu.save()

    await MenuLog.create({
      action: 'created',
      menuId: newMenu._id,
      menuName: newMenu.name,
      performedBy: req.user.name || req.user.email,
      performedByRole: req.user.role,
    })

    res.status(201).json(newMenu)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PATCH update menu item (owner only)
router.patch('/:id', isAuth, isEligible('owner'), async (req, res) => {
  try {
    const { name, description, price, image, category, cookingTime, available } = req.body
    const menu = await Menu.findById(req.params.id)
    if (!menu) return res.status(404).json({ message: 'Menu item not found' })

    if (name !== undefined) menu.name = name
    if (description !== undefined) menu.description = description
    if (price !== undefined) menu.price = price
    if (image !== undefined) menu.image = image
    if (category !== undefined) menu.category = category
    if (cookingTime !== undefined) menu.cookingTime = cookingTime

    if (available !== undefined) {
      const changed = menu.available !== available
      menu.available = available
      if (changed) {
        await MenuLog.create({
          action: available ? 'activated' : 'deactivated',
          menuId: menu._id,
          menuName: menu.name,
          performedBy: req.user.name || req.user.email,
          performedByRole: req.user.role,
        })
      }
    }

    const updatedMenu = await menu.save()
    res.json(updatedMenu)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE menu item (owner only)
router.delete('/:id', isAuth, isEligible('owner'), async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
    if (!menu) return res.status(404).json({ message: 'Menu item not found' })

    await MenuLog.create({
      action: 'deleted',
      menuId: menu._id,
      menuName: menu.name,
      performedBy: req.user.name || req.user.email,
      performedByRole: req.user.role,
    })

    await Menu.deleteOne({ _id: req.params.id })
    res.json({ message: 'Menu item deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
