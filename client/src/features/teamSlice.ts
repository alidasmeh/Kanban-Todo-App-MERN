import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { TeamState } from '../types';
import api from '../utils/api';
import { showNotification } from './notificationSlice';

const initialState: TeamState = {
  teams: [],
  users: [],
  loading: false,
  error: null,
};

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<any[]>('/teams');
      const teams = response.data.map((t: any) => ({
        ...t,
        id: t._id,
        owners: t.owners.map((o: any) => ({ ...o, id: o._id })),
        members: t.members.map((m: any) => ({ ...m, id: m._id }))
      }));
      return teams;
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
      const response = await api.post<any>('/teams', teamData);
      const newTeam = {
        ...response.data,
        id: response.data._id,
        owners: response.data.owners.map((o: any) => ({ ...o, id: o._id })),
        members: response.data.members.map((m: any) => ({ ...m, id: m._id }))
      };
      dispatch(showNotification({ message: 'Team created successfully!', type: 'success' }));
      return newTeam;
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
      const response = await api.post<any>(`/teams/${teamId}/members`, { userId });
      const updatedTeam = {
        ...response.data,
        id: response.data._id,
        owners: response.data.owners.map((o: any) => ({ ...o, id: o._id })),
        members: response.data.members.map((m: any) => ({ ...m, id: m._id }))
      };
      dispatch(showNotification({ message: 'Member added successfully!', type: 'success' }));
      return updatedTeam;
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
      const response = await api.delete<any>(`/teams/${teamId}/members/${userId}`);
      const updatedTeam = {
        ...response.data,
        id: response.data._id,
        owners: response.data.owners.map((o: any) => ({ ...o, id: o._id })),
        members: response.data.members.map((m: any) => ({ ...m, id: m._id }))
      };
      dispatch(showNotification({ message: 'Member removed successfully!', type: 'success' }));
      return updatedTeam;
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
      const response = await api.put<any>(`/teams/${teamId}/members/${userId}/admin`);
      const updatedTeam = {
        ...response.data,
        id: response.data._id,
        owners: response.data.owners.map((o: any) => ({ ...o, id: o._id })),
        members: response.data.members.map((m: any) => ({ ...m, id: m._id }))
      };
      dispatch(showNotification({ message: 'Admin status updated!', type: 'success' }));
      return updatedTeam;
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
      const response = await api.get<any[]>('/teams/users');
      const users = response.data.map((u: any) => ({
        ...u,
        id: u._id
      }));
      return users;
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
