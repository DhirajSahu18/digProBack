import express from "express";
import { z } from "zod";
import Product from "../models/product.model.js";

const router = express.Router();

// Zod schema for product validation
const zodProductSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  binding: z.string().min(1),
  rewardPoints: z.number().int().nonnegative(),
  productCode: z.string().min(1),
  availability: z.string().min(1),
  price: z.object({
    original: z.number().positive(),
    discounted: z.number().positive(),
    discountPercentage: z.number().min(0).max(100),
  }),
  review: z.array(z.object({})), // Define the review structure if needed
  reviewsCount: z.number().int().nonnegative(),
  description: z.string().min(1),
  image: z.string().url(),
});

// POST route for creating a new product
router.post("/", async (req, res) => {
  try {
    const validatedData = zodProductSchema.parse(req.body);
    const product = new Product(validatedData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET route for fetching all products with optional sorting and filtering
router.get("/", async (req, res) => {
  try {
    const { sort, order, filter, ...filters } = req.query;
    let products;

    if (filter) {
      products = await Product.find({
        [filter]: { $regex: filters[filter], $options: "i" },
      });
    } else {
      products = await Product.find();
    }

    if (sort && order) {
      products = products.sort((a, b) => 
        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
      );
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET route for fetching a product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT route for updating a product by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = zodProductSchema.parse(req.body);
    const updatedProduct = await Product.findByIdAndUpdate(id, validatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE route for deleting a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
