import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { BoardState, Board, Task } from '../types';
import api from '../utils/api';
import { showNotification } from './notificationSlice';

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
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch boards');
    }
  }
);

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (boardData: Partial<Board>, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post<Board & { _id: string }>('/boards', boardData);
      const newBoard = { ...response.data, id: response.data._id, tasks: [] } as Board;
      dispatch(showNotification({ message: 'Board created successfully!', type: 'success' }));
      return newBoard;
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Failed to create board';
      dispatch(showNotification({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const createTask = createAsyncThunk(
  'boards/createTask',
  async (taskData: TaskPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post<Task & { _id: string }>('/tasks', taskData);
      const newTask = { ...response.data, id: response.data._id } as Task;
      dispatch(showNotification({ message: 'Task created successfully!', type: 'success' }));
      return newTask;
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Failed to create task';
      dispatch(showNotification({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'boards/updateTask',
  async (taskData: Partial<Task> & { id: string }, { dispatch, rejectWithValue }) => {
    try {
      const { id, ...updateData } = taskData;
      const response = await api.put<Task & { _id: string }>(`/tasks/${id}`, updateData);
      const updatedTask = { ...response.data, id: response.data._id } as Task;
      dispatch(showNotification({ message: 'Task updated successfully!', type: 'success' }));
      return updatedTask;
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Failed to update task';
      dispatch(showNotification({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'boards/deleteTask',
  async ({ taskId, boardId, columnId }: DeleteTaskPayload, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      dispatch(showNotification({ message: 'Task deleted successfully!', type: 'success' }));
      return { taskId, boardId, columnId };
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Failed to delete task';
      dispatch(showNotification({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const moveTask = createAsyncThunk(
  'boards/moveTask',
  async (moveData: MoveTaskPayload, { dispatch, rejectWithValue }) => {
    try {
      await api.put(`/tasks/${moveData.taskId}/move`, {
        sourceColId: moveData.sourceColId,
        destColId: moveData.destColId,
        sourceIndex: moveData.sourceIndex,
        destIndex: moveData.destIndex
      });
      return moveData;
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Failed to move task';
      dispatch(showNotification({ message, type: 'error' }));
      return rejectWithValue(message);
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
          state.currentBoard = action.payload.find((b: Board) => b.id === state.currentBoard?.id) || null;
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
          board.tasks.push(task);
          if (board.columns[task.columnId]) {
            board.columns[task.columnId].taskIds.push(task.id);
          }
        }
        if (state.currentBoard?.id === task.boardId) {
          state.currentBoard.tasks.push(task);
          if (state.currentBoard.columns[task.columnId]) {
            state.currentBoard.columns[task.columnId].taskIds.push(task.id);
          }
        }
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const task = action.payload;
        const board = state.boards.find(b => b.id === task.boardId);
        if (board) {
          const index = board.tasks.findIndex(t => t.id === task.id);
          if (index !== -1) {
            board.tasks[index] = task;
          }
        }
        if (state.currentBoard?.id === task.boardId) {
          const index = state.currentBoard.tasks.findIndex(t => t.id === task.id);
          if (index !== -1) {
            state.currentBoard.tasks[index] = task;
          }
        }
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        const { taskId, boardId, columnId } = action.payload;
        const board = state.boards.find(b => b.id === boardId);
        if (board) {
          board.tasks = board.tasks.filter((t: Task) => t.id !== taskId);
          if (board.columns[columnId]) {
            board.columns[columnId].taskIds = board.columns[columnId].taskIds.filter(id => id !== taskId);
          }
        }
        if (state.currentBoard?.id === boardId) {
          state.currentBoard.tasks = state.currentBoard.tasks.filter((t: Task) => t.id !== taskId);
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
            const task = board.tasks.find((t: Task) => t.id === taskId);
            if (task) {
              task.columnId = destColId;
              task.status = destColId.toUpperCase().replace('-', '_') as 'TODO' | 'IN_PROGRESS' | 'DONE';
            }
          }
        }
        if (state.currentBoard?.id === boardId) {
          const start = state.currentBoard.columns[sourceColId];
          const finish = state.currentBoard.columns[destColId];

          start.taskIds.splice(sourceIndex, 1);
          finish.taskIds.splice(destIndex, 0, taskId);

          if (sourceColId !== destColId) {
            const task = state.currentBoard.tasks.find((t: Task) => t.id === taskId);
            if (task) {
              task.columnId = destColId;
              task.status = destColId.toUpperCase().replace('-', '_') as 'TODO' | 'IN_PROGRESS' | 'DONE';
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
