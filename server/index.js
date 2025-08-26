import express from 'express'
import connectDB from "./config/db.js"
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.route.js'
import { app, server } from './config/socket.js'
import { expressMiddleware } from '@as-integrations/express5';
import createApolloServer from './graphql/index.js'

dotenv.config()
// const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies to be sent with monmorequests
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', authRoute)
app.use('/graphql', expressMiddleware(await createApolloServer(), {
  context: async ({ req, res }) => { return { req, res }},
}))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
})

server.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  connectDB()
  console.log(`Server is running on port ${process.env.PORT || 5000}`)
})