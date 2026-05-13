import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { TeamState, Team, User } from '../types';
import api from '../utils/api';
import { showNotification } from './notificationSlice';

interface BackendUser {
  _id: string;
  name: string;
  email: string;
}

interface BackendTeam {
  _id: string;
  name: string;
  description?: string;
  owners: BackendUser[];
  members: BackendUser[];
}

const initialState: TeamState = {
  teams: [],
  users: [],
  loading: false,
  error: null,
};

const transformUser = (u: BackendUser): User => ({
  id: u._id,
  name: u.name,
  email: u.email
});

const transformTeam = (t: BackendTeam): Team => ({
  id: t._id,
  name: t.name,
  description: t.description,
  owners: t.owners.map(transformUser),
  members: t.members.map(transformUser)
});

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<BackendTeam[]>('/teams');
      return response.data.map(transformTeam);
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch teams');
    }
  }
);

export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (teamData: { name: string; description?: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post<BackendTeam>('/teams', teamData);
      dispatch(showNotification({ message: 'Team created successfully!', type: 'success' }));
      return transformTeam(response.data);
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Failed to create team';
      dispatch(showNotification({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const addMemberToTeam = createAsyncThunk(
  'teams/addMember',
  async ({ teamId, userId }: { teamId: string; userId: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post<BackendTeam>(`/teams/${teamId}/members`, { userId });
      dispatch(showNotification({ message: 'Member added successfully!', type: 'success' }));
      return transformTeam(response.data);
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Failed to add member';
      dispatch(showNotification({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const removeMemberFromTeam = createAsyncThunk(
  'teams/removeMember',
  async ({ teamId, userId }: { teamId: string; userId: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete<BackendTeam>(`/teams/${teamId}/members/${userId}`);
      dispatch(showNotification({ message: 'Member removed successfully!', type: 'success' }));
      return transformTeam(response.data);
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Failed to remove member';
      dispatch(showNotification({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const toggleAdminStatus = createAsyncThunk(
  'teams/toggleAdmin',
  async ({ teamId, userId }: { teamId: string; userId: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put<BackendTeam>(`/teams/${teamId}/members/${userId}/admin`);
      dispatch(showNotification({ message: 'Admin status updated!', type: 'success' }));
      return transformTeam(response.data);
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Failed to update admin status';
      dispatch(showNotification({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'teams/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<BackendUser[]>('/teams/users');
      return response.data.map(transformUser);
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch users');
    }
  }
);

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
      })
      .addCase(addMemberToTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      .addCase(removeMemberFromTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      .addCase(toggleAdminStatus.fulfilled, (state, action) => {
        const index = state.teams.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});

export default teamSlice.reducer;
