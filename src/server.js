import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './configs/mongodb.js'
import { router as apiRoutes } from './routes/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://spc-owner.vercel.app',
  'https://spc-customer.vercel.app',
  'https://sp-spin3-frontend.vercel.app',
]

app.use(cors({allowlist: allowedOrigins, credentials: true
    }
))
app.use(express.json())
app.use('/api', apiRoutes)

await connectDB()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

