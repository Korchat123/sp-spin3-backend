import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './configs/mongodb.js'
import { router as apiRoutes } from './routes/index.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true
}))
app.use(express.json())
app.use('/api', apiRoutes)

await connectDB()

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on('error', (err) => {
  console.error(`Failed to start server on port ${PORT}:`, err.message)
  process.exit(1)
})
