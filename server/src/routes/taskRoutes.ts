import express from 'express';
import { createTask, updateTask, deleteTask, moveTask } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/:id/move')
  .put(protect, moveTask);

export default router;
