export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeId?: string;
  boardId: string;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  category?: string;
  color?: string;
  teamId: string;
  columns: { [key: string]: Column };
  columnOrder: string[];
  tasks: Task[];
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  owners: User[];
  members: User[];
}

export interface TeamState {
  teams: Team[];
  users: User[];
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export interface NotificationState {
  notifications: Notification[];
}
