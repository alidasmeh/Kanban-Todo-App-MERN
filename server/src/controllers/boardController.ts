import { Request, Response } from 'express';
import Board from '../models/Board';
import Task from '../models/Task';
import Team from '../models/Team';

// @desc    Get all boards for user (including tasks)
// @route   GET /api/boards
// @access  Private
export const getBoards = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;

  try {
    // Find teams where user is a member or owner
    const userTeams = await Team.find({
      $or: [
        { owners: userId },
        { members: userId }
      ]
    }).select('_id');

    const teamIds = userTeams.map(team => team._id);

    // Find boards belonging to those teams
    const boards = await Board.find({
      team: { $in: teamIds }
    }).lean();

    const boardsWithTasks = await Promise.all(boards.map(async (board: any) => {
      const tasks = await Task.find({ boardId: board._id }).lean();
      
      // Transform tasks to match frontend structure (mapping _id to id)
      const transformedTasks = tasks.map((t: any) => ({
        ...t,
        id: t._id.toString(),
      }));

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
  const { title, description, category, color, teamId } = req.body;
  const userId = (req as any).user._id;

  if (!teamId) {
    return res.status(400).json({ message: 'Team ID is required' });
  }

  try {
    const board = await Board.create({
      title,
      description,
      category,
      color,
      owner: userId,
      team: teamId,
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
  const userId = (req as any).user._id;
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Verify user is in the team
    const team = await Team.findById(board.team);
    if (!team || (!team.members.includes(userId) && !team.owners.includes(userId))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ boardId: board._id });
    res.json({ ...board.toObject(), id: board._id.toString(), tasks });
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
