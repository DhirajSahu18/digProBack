import mongoose from "mongoose";
import { z } from "zod";
import Order from "../models/order.model.js";

const orderValidationSchema = z.object({
  user: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid user ID",
  }),
  products: z
    .array(
      z.object({
        product: z
          .string()
          .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid product ID",
          }),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .nonempty(),
  orderTotal: z.number().positive(),
  shippingAddress: z.object({
    addressLine1: z.string().nonempty(),
    addressLine2: z.string().optional(),
    city: z.string().nonempty(),
    state: z.string().nonempty(),
    postalCode: z.string().nonempty(),
    country: z.string().nonempty(),
  }),
  paymentMethod: z.string().nonempty(),
  paymentStatus: z.enum(["Pending", "Completed", "Failed"]),
  orderStatus: z.enum(["Processing", "Shipped", "Delivered", "Cancelled"]),
});

export const createOrder = async (req, res) => {
  try {
    const validatedData = orderValidationSchema.parse(req.body);
    const newOrder = new Order(validatedData);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("products.product");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const validatedData = orderValidationSchema.partial().parse(req.body);
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
