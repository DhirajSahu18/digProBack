import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../controllers/order.controller.js';

const router = express.Router();

// Route to create a new order
router.post('/', createOrder);

// Route to get all orders
router.get('/', getOrders);

// Route to get a single order by ID
router.get('/:id', getOrderById);

// Route to update an order by ID
router.put('/:id', updateOrder);

// Route to delete an order by ID
router.delete('/:id', deleteOrder);

export default router;
