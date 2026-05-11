import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { BoardState, Board, Task } from '../types';
import api from '../utils/api';

interface TaskPayload {
  boardId: string;
  columnId: string;
  title: string;
  dueDate: string;
  description?: string;
}

interface MoveTaskPayload {
  taskId: string;
  boardId: string;
  sourceColId: string;
  destColId: string;
  sourceIndex: number;
  destIndex: number;
}

interface DeleteTaskPayload {
  taskId: string;
  boardId: string;
  columnId: string;
}

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
};

export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Board[]>('/boards');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch boards');
    }
  }
);

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (boardData: Partial<Board>, { rejectWithValue }) => {
    try {
      const response = await api.post<Board & { _id: string }>('/boards', boardData);
      return { ...response.data, id: response.data._id, tasks: [] } as Board;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create board');
    }
  }
);

export const createTask = createAsyncThunk(
  'boards/createTask',
  async (taskData: TaskPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<Task & { _id: string }>('/tasks', taskData);
      return { ...response.data, id: response.data._id } as Task;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'boards/deleteTask',
  async ({ taskId, boardId, columnId }: DeleteTaskPayload, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      return { taskId, boardId, columnId };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
    }
  }
);

export const moveTask = createAsyncThunk(
  'boards/moveTask',
  async (moveData: MoveTaskPayload, { rejectWithValue }) => {
    try {
      await api.put(`/tasks/${moveData.taskId}/move`, {
        sourceColId: moveData.sourceColId,
        destColId: moveData.destColId,
        sourceIndex: moveData.sourceIndex,
        destIndex: moveData.destIndex
      });
      return moveData;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to move task');
    }
  }
);

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setCurrentBoard: (state, action: PayloadAction<string>) => {
      const board = state.boards.find(b => b.id === action.payload);
      state.currentBoard = board || null;
    },
    clearBoardError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Boards
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
        if (state.currentBoard) {
          state.currentBoard = action.payload.find((b: any) => b.id === state.currentBoard?.id) || null;
        }
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Board
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        const task = action.payload;
        const board = state.boards.find(b => b.id === task.boardId);
        if (board) {
          (board as any).tasks.push(task);
          if (board.columns[task.columnId]) {
            board.columns[task.columnId].taskIds.push(task.id);
          }
        }
        if (state.currentBoard?.id === task.boardId) {
          (state.currentBoard as any).tasks.push(task);
          if (state.currentBoard.columns[task.columnId]) {
            state.currentBoard.columns[task.columnId].taskIds.push(task.id);
          }
        }
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        const { taskId, boardId, columnId } = action.payload;
        const board = state.boards.find(b => b.id === boardId);
        if (board) {
          (board as any).tasks = (board as any).tasks.filter((t: any) => t.id !== taskId);
          if (board.columns[columnId]) {
            board.columns[columnId].taskIds = board.columns[columnId].taskIds.filter(id => id !== taskId);
          }
        }
        if (state.currentBoard?.id === boardId) {
          (state.currentBoard as any).tasks = (state.currentBoard as any).tasks.filter((t: any) => t.id !== taskId);
          if (state.currentBoard.columns[columnId]) {
            state.currentBoard.columns[columnId].taskIds = state.currentBoard.columns[columnId].taskIds.filter(id => id !== taskId);
          }
        }
      })
      // Move Task
      .addCase(moveTask.fulfilled, (state, action) => {
        const { taskId, boardId, sourceColId, destColId, sourceIndex, destIndex } = action.payload;
        const board = state.boards.find(b => b.id === boardId);
        if (board) {
          const start = board.columns[sourceColId];
          const finish = board.columns[destColId];

          start.taskIds.splice(sourceIndex, 1);
          finish.taskIds.splice(destIndex, 0, taskId);

          if (sourceColId !== destColId) {
            const task = (board as any).tasks.find((t: any) => t.id === taskId);
            if (task) {
              task.columnId = destColId;
              task.status = destColId.toUpperCase().replace('-', '_');
            }
          }
        }
        if (state.currentBoard?.id === boardId) {
          const start = state.currentBoard.columns[sourceColId];
          const finish = state.currentBoard.columns[destColId];

          start.taskIds.splice(sourceIndex, 1);
          finish.taskIds.splice(destIndex, 0, taskId);

          if (sourceColId !== destColId) {
            const task = (state.currentBoard as any).tasks.find((t: any) => t.id === taskId);
            if (task) {
              task.columnId = destColId;
              task.status = destColId.toUpperCase().replace('-', '_');
            }
          }
        }
      });
  },
});

export const { 
  setCurrentBoard,
  clearBoardError
} = boardSlice.actions;
export default boardSlice.reducer;
