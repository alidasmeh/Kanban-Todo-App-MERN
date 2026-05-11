import { Request, Response } from 'express';
import Board from '../models/Board';
import Task from '../models/Task';

// @desc    Get all boards for user (including tasks)
// @route   GET /api/boards
// @access  Private
export const getBoards = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;

  try {
    const boards = await Board.find({
      $or: [
        { owner: userId },
        { members: userId }
      ]
    }).lean();

    const boardsWithTasks = await Promise.all(boards.map(async (board: any) => {
      const tasks = await Task.find({ boardId: board._id }).lean();
      
      // Transform tasks to match frontend structure (mapping _id to id)
      const transformedTasks = tasks.map((t: any) => ({
        ...t,
        id: t._id.toString(),
      }));

      // Transform columns taskIds to strings and populate columns with correct task structure if needed
      // Actually the frontend expects AppBoard which has tasks array and columns map
      return {
        ...board,
        id: board._id.toString(),
        tasks: transformedTasks
      };
    }));

    res.json(boardsWithTasks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Create a new board
// @route   POST /api/boards
// @access  Private
export const createBoard = async (req: Request, res: Response) => {
  const { title, description, category, color } = req.body;
  const userId = (req as any).user._id;

  try {
    const board = await Board.create({
      title,
      description,
      category,
      color,
      owner: userId,
      members: [userId]
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// @desc    Get board by ID
// @route   GET /api/boards/:id
// @access  Private
export const getBoardById = async (req: Request, res: Response) => {
  try {
    const board = await Board.findById(req.params.id);
    if (board) {
      const tasks = await Task.find({ boardId: board._id });
      res.json({ ...board.toObject(), tasks });
    } else {
      res.status(404).json({ message: 'Board not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private
export const updateBoard = async (req: Request, res: Response) => {
  try {
    const board = await Board.findById(req.params.id);

    if (board) {
      board.title = req.body.title || board.title;
      board.description = req.body.description || board.description;
      board.category = req.body.category || board.category;
      board.color = req.body.color || board.color;
      board.columns = req.body.columns || board.columns;
      board.columnOrder = req.body.columnOrder || board.columnOrder;

      const updatedBoard = await board.save();
      res.json(updatedBoard);
    } else {
      res.status(404).json({ message: 'Board not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
