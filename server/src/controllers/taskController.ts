import { Request, Response } from 'express';
import Task from '../models/Task';
import Board from '../models/Board';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: Request, res: Response) => {
  const { title, description, dueDate, boardId, columnId, status } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      boardId,
      columnId,
      status: status || 'TODO',
      assignee: (req as any).user._id
    });

    // Update Board columns taskIds
    const board = await Board.findById(boardId);
    if (board) {
      const column = board.columns.get(columnId);
      if (column) {
        column.taskIds.push(task._id as any);
        board.markModified('columns');
        await board.save();
      }
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.dueDate = req.body.dueDate || task.dueDate;
      task.status = req.body.status || task.status;
      task.columnId = req.body.columnId || task.columnId;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      const { boardId, columnId } = task;
      await task.deleteOne();

      // Remove from Board columns taskIds
      const board = await Board.findById(boardId);
      if (board) {
        const column = board.columns.get(columnId);
        if (column) {
          column.taskIds = column.taskIds.filter(id => id.toString() !== req.params.id);
          board.markModified('columns');
          await board.save();
        }
      }

      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Move a task (reorder or change column)
// @route   PUT /api/tasks/:id/move
// @access  Private
export const moveTask = async (req: Request, res: Response) => {
  const { sourceColId, destColId, sourceIndex, destIndex } = req.body;
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const board = await Board.findById(task.boardId);
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
    destCol.taskIds.splice(destIndex, 0, taskId as any);

    // Update task status and columnId if moved between columns
    if (sourceColId !== destColId) {
      task.columnId = destColId;
      task.status = destColId.toUpperCase().replace('-', '_') as any;
      await task.save();
    }

    board.markModified('columns');
    await board.save();

    res.json({ message: 'Task moved successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
