import mongoose, { Document } from 'mongoose';

export interface IColumn {
  id: string;
  title: string;
  taskIds: mongoose.Types.ObjectId[];
}

export interface IBoard extends Document {
  title: string;
  description?: string;
  category?: string;
  color: string;
  owner: mongoose.Types.ObjectId;
  team: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  columns: Map<string, IColumn>;
  columnOrder: string[];
}

const columnSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  taskIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  color: {
    type: String,
    default: 'indigo',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  columns: {
    type: Map,
    of: columnSchema,
    default: {
      'todo': { id: 'todo', title: 'TO DO', taskIds: [] },
      'in-progress': { id: 'in-progress', title: 'IN PROGRESS', taskIds: [] },
      'done': { id: 'done', title: 'DONE', taskIds: [] }
    }
  },
  columnOrder: {
    type: [String],
    default: ['todo', 'in-progress', 'done'],
  },
}, {
  timestamps: true,
});

const Board = mongoose.model<IBoard>('Board', boardSchema);

export default Board;
