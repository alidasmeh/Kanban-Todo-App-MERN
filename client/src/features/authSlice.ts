import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState } from '../types';
import api from '../utils/api';
import { showNotification } from './notificationSlice';

interface LoginCredentials {
  email: string;
  password?: string;
}

interface SignupData extends LoginCredentials {
  name: string;
}

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

const token = localStorage.getItem('token');

const initialState: AuthState = {
  user: null,
  token: token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      dispatch(showNotification({ message: `Welcome back, ${response.data.name}!`, type: 'success' }));
      return response.data;
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Login failed';
      dispatch(showNotification({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData: SignupData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', userData);
      localStorage.setItem('token', response.data.token);
      dispatch(showNotification({ message: 'Account created successfully!', type: 'success' }));
      return response.data;
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Signup failed';
      dispatch(showNotification({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<AuthResponse>('/auth/me');
      return response.data;
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      localStorage.removeItem('token');
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to load user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email
        };
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email
        };
        state.token = action.payload.token;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Load User
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = {
          id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email
        };
      })
      .addCase(loadUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
