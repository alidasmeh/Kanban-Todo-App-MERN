import express from 'express';
import { getBoards, createBoard, getBoardById, updateBoard } from '../controllers/boardController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getBoards)
  .post(protect, createBoard);

router.route('/:id')
  .get(protect, getBoardById)
  .put(protect, updateBoard);

export default router;
