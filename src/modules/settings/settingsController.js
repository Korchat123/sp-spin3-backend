import { Settings } from './Settings.js'

const DEFAULT_RESERVATION_THRESHOLDS = { oneTwoMin: 300, threeSixMin: 600, sevenTenMin: 1000 }

export const getBookingConfig = async (req, res) => {
  try {
    const doc = await Settings.findOne({ key: 'reservationThresholds' })
    if (!doc) {
      return res.json(DEFAULT_RESERVATION_THRESHOLDS)
    }
    return res.json({ ...DEFAULT_RESERVATION_THRESHOLDS, ...doc.value })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateBookingConfig = async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      { key: 'reservationThresholds' },
      { value: req.body },
      { upsert: true, new: true }
    )
    return res.json(updated.value)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
