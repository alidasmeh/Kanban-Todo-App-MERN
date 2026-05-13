import mongoose, { Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  dueDate: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignee?: mongoose.Types.ObjectId;
  boardId: mongoose.Types.ObjectId;
  columnId: string;
}

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    default: 'TODO',
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  columnId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
