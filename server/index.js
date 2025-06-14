import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/authRoute.js'
import { app, server } from './config/socket.js'

dotenv.config()
// const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "chat.ninin.xyz",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // credentials: true // Allow cookies to be sent with requests
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', authRoute)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
})

server.listen(process.env.PORT || 5000, "0.0.0.0",() => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`)
})