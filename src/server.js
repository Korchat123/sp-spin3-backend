import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './configs/mongodb.js'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())



await connectDB()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
