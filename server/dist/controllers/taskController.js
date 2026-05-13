"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveTask = exports.deleteTask = exports.updateTask = exports.createTask = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Task_1 = __importDefault(require("../models/Task"));
const Board_1 = __importDefault(require("../models/Board"));
// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    const { title, description, dueDate, boardId, columnId, status, assignee } = req.body;
    try {
        const task = await Task_1.default.create({
            title,
            description,
            dueDate,
            boardId,
            columnId,
            status: status || 'TODO',
            assignee: assignee || req.user._id
        });
        const populatedTask = await Task_1.default.findById(task._id).populate('assignee', 'name email');
        // Update Board columns taskIds
        const board = await Board_1.default.findById(boardId);
        if (board) {
            const column = board.columns.get(columnId);
            if (column) {
                column.taskIds.push(task._id);
                board.markModified('columns');
                await board.save();
            }
        }
        res.status(201).json(populatedTask);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createTask = createTask;
// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task_1.default.findById(req.params.id);
        if (task) {
            task.title = req.body.title || task.title;
            task.description = req.body.description || task.description;
            task.dueDate = req.body.dueDate || task.dueDate;
            task.status = req.body.status || task.status;
            task.columnId = req.body.columnId || task.columnId;
            task.assignee = req.body.assignee || task.assignee;
            const updatedTask = await task.save();
            const populatedTask = await Task_1.default.findById(updatedTask._id).populate('assignee', 'name email');
            res.json(populatedTask);
        }
        else {
            res.status(404).json({ message: 'Task not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateTask = updateTask;
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task_1.default.findById(req.params.id);
        if (task) {
            const { boardId, columnId } = task;
            await task.deleteOne();
            // Remove from Board columns taskIds
            const board = await Board_1.default.findById(boardId);
            if (board) {
                const column = board.columns.get(columnId);
                if (column) {
                    column.taskIds = column.taskIds.filter(id => id.toString() !== req.params.id);
                    board.markModified('columns');
                    await board.save();
                }
            }
            res.json({ message: 'Task removed' });
        }
        else {
            res.status(404).json({ message: 'Task not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteTask = deleteTask;
// @desc    Move a task (reorder or change column)
// @route   PUT /api/tasks/:id/move
// @access  Private
const moveTask = async (req, res) => {
    const { sourceColId, destColId, sourceIndex, destIndex } = req.body;
    const taskId = req.params.id;
    try {
        const task = await Task_1.default.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const board = await Board_1.default.findById(task.boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        const sourceCol = board.columns.get(sourceColId);
        const destCol = board.columns.get(destColId);
        if (!sourceCol || !destCol) {
            return res.status(400).json({ message: 'Invalid columns' });
        }
        // Remove from source
        sourceCol.taskIds.splice(sourceIndex, 1);
        // Add to destination
        destCol.taskIds.splice(destIndex, 0, new mongoose_1.default.Types.ObjectId(taskId));
        // Update task status and columnId if moved between columns
        if (sourceColId !== destColId) {
            task.columnId = destColId;
            task.status = destColId.toUpperCase().replace('-', '_');
            await task.save();
        }
        board.markModified('columns');
        await board.save();
        res.json({ message: 'Task moved successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.moveTask = moveTask;
