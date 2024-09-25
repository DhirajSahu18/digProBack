import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'
import { z } from 'zod'

const router = express.Router()

// Define Zod schemas for input validation and sanitization
const registerSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6)
})

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
})

// Register route
router.post('/signup', async (req, res) => {
  try {
    // Validate and sanitize input
    const { username, password } = registerSchema.parse(req.body)

    // Check if user already exists
    let user = await User.findOne({ username })
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    user = new User({
      username,
      password: hashedPassword
    })

    await user.save()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors })
    }
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Login route
router.post('/login', async (req, res) => {
  try {
    // Validate and sanitize input
    const { username, password } = loginSchema.parse(req.body)

    // Check if user exists
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Create and send token
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err
        res.status(200).json({ token , message : "Login successful" })
      }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors })
    }
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router