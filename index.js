// Library Imports 
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Connection } from './db.js'

// Route imports
import authRoutes from './route/Auth.route.js'
import productRoutes from './route/Product.route.js'
import orderRoutes from './route/Order.route.js'
import cartRoutes from './route/Cart.routes.js'

// Configurations
dotenv.config()


// Server initialization
const app = express()
const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })

// Middlewares
app.use(cors())
app.use(express.json())


// Db connection
Connection()


// Basic Route
app.get('/', (req, res) => {
  res.send('Server Connected!')
})

// Routes finalising
app.use("/auth" , authRoutes)
app.use("/products" , productRoutes)
app.use("/order" , orderRoutes)
app.use("/cart" , cartRoutes)



