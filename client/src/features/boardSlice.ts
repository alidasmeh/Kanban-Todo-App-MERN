import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BoardState, Board } from '../types';

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
};

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    fetchBoardsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBoardsSuccess: (state, action: PayloadAction<Board[]>) => {
      state.loading = false;
      state.boards = action.payload;
    },
    fetchBoardsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentBoard: (state, action: PayloadAction<Board>) => {
      state.currentBoard = action.payload;
    },
    updateBoard: (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
      if (state.currentBoard?.id === action.payload.id) {
        state.currentBoard = action.payload;
      }
    },
  },
});

export const { 
  fetchBoardsStart, 
  fetchBoardsSuccess, 
  fetchBoardsFailure, 
  setCurrentBoard,
  updateBoard
} = boardSlice.actions;
export default boardSlice.reducer;
