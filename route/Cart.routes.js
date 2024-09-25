import express from 'express'
import { z } from 'zod'
const router = express.Router()
import Cart from '../models/Cart.model.js'

// Zod schema for cart input
const cartSchema = z.object({
  userId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
  totalPrice: z.number().nonnegative(),
})

// Create a new cart
router.post('/', async (req, res) => {
  try {
    const validatedData = cartSchema.parse(req.body)
    const newCart = new Cart(validatedData)
    const savedCart = await newCart.save()
    res.status(201).json(savedCart)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input", errors: error.errors })
    } else {
      res.status(400).json({ message: error.message })
    }
  }
})

// Get all carts
router.get('/', async (req, res) => {
  try {
    const carts = await Cart.find()
    res.json(carts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get a specific cart
router.get('/:id', async (req, res) => {
  try {
    const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/)
    const { id } = idSchema.parse({ id: req.params.id })
    const cart = await Cart.findById(id)
    if (!cart) return res.status(404).json({ message: 'Cart not found' })
    res.json(cart)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input", errors: error.errors })
    } else {
      res.status(500).json({ message: error.message })
    }
  }
})

// Update a cart
router.put('/:id', async (req, res) => {
  try {
    const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/)
    const { id } = idSchema.parse({ id: req.params.id })
    const validatedData = cartSchema.parse(req.body)
    const updatedCart = await Cart.findByIdAndUpdate(id, validatedData, { new: true })
    if (!updatedCart) return res.status(404).json({ message: 'Cart not found' })
    res.json(updatedCart)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input", errors: error.errors })
    } else {
      res.status(400).json({ message: error.message })
    }
  }
})

// Delete a cart
router.delete('/:id', async (req, res) => {
  try {
    const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/)
    const { id } = idSchema.parse({ id: req.params.id })
    const deletedCart = await Cart.findByIdAndDelete(id)
    if (!deletedCart) return res.status(404).json({ message: 'Cart not found' })
    res.json({ message: 'Cart deleted successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input", errors: error.errors })
    } else {
      res.status(500).json({ message: error.message })
    }
  }
})

export default router