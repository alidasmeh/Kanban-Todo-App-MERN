"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBoard = exports.getBoardById = exports.createBoard = exports.getBoards = void 0;
const Board_1 = __importDefault(require("../models/Board"));
const Task_1 = __importDefault(require("../models/Task"));
const Team_1 = __importDefault(require("../models/Team"));
// @desc    Get all boards for user (including tasks)
// @route   GET /api/boards
// @access  Private
const getBoards = async (req, res) => {
    const userId = req.user._id;
    try {
        // Find teams where user is a member or owner
        const userTeams = await Team_1.default.find({
            $or: [
                { owners: userId },
                { members: userId }
            ]
        }).select('_id');
        const teamIds = userTeams.map(team => team._id);
        // Find boards belonging to those teams
        const boards = await Board_1.default.find({
            team: { $in: teamIds }
        }).lean();
        const boardsWithTasks = await Promise.all(boards.map(async (board) => {
            const tasks = await Task_1.default.find({ boardId: board._id }).lean();
            // Transform tasks to match frontend structure (mapping _id to id)
            const transformedTasks = tasks.map((t) => ({
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getBoards = getBoards;
// @desc    Create a new board
// @route   POST /api/boards
// @access  Private
const createBoard = async (req, res) => {
    const { title, description, category, color, teamId } = req.body;
    const userId = req.user._id;
    if (!teamId) {
        return res.status(400).json({ message: 'Team ID is required' });
    }
    try {
        const board = await Board_1.default.create({
            title,
            description,
            category,
            color,
            owner: userId,
            team: teamId,
            members: [userId]
        });
        res.status(201).json(board);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createBoard = createBoard;
// @desc    Get board by ID
// @route   GET /api/boards/:id
// @access  Private
const getBoardById = async (req, res) => {
    const userId = req.user._id;
    try {
        const board = await Board_1.default.findById(req.params.id);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        // Verify user is in the team
        const team = await Team_1.default.findById(board.team);
        if (!team || (!team.members.includes(userId) && !team.owners.includes(userId))) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const tasks = await Task_1.default.find({ boardId: board._id });
        res.json({ ...board.toObject(), id: board._id.toString(), tasks });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getBoardById = getBoardById;
// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private
const updateBoard = async (req, res) => {
    try {
        const board = await Board_1.default.findById(req.params.id);
        if (board) {
            board.title = req.body.title || board.title;
            board.description = req.body.description || board.description;
            board.category = req.body.category || board.category;
            board.color = req.body.color || board.color;
            board.columns = req.body.columns || board.columns;
            board.columnOrder = req.body.columnOrder || board.columnOrder;
            const updatedBoard = await board.save();
            res.json(updatedBoard);
        }
        else {
            res.status(404).json({ message: 'Board not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateBoard = updateBoard;
