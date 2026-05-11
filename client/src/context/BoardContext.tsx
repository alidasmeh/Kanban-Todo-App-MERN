import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Rocket, Layout, CreditCard as Payments, Megaphone as Campaign } from 'lucide-react';
import type { Board, Task } from '../types';

// Extend the default Board type with fields needed for the list views
export interface AppBoard extends Board {
  description?: string;
  category?: string;
  icon?: any;
  color?: string;
  tasks: Task[];
}

const BoardsData: { [key: string]: AppBoard } = {
  '1': {
    id: '1',
    title: 'Q5 Product Roadmap',
    description: 'Strategic planning for the final quarter including mobile app v2.0 release and cloud migration.',
    category: 'product',
    icon: Rocket,
    color: 'indigo',
    columns: {
      'todo': { id: 'todo', title: 'TO DO', taskIds: ['task-1', 'task-2'] },
      'in-progress': { id: 'in-progress', title: 'IN PROGRESS', taskIds: ['task-3', 'task-4'] },
      'done': { id: 'done', title: 'DONE', taskIds: ['task-5'] }
    },
    columnOrder: ['todo', 'in-progress', 'done'],
    tasks: [
      {
        id: 'task-1',
        title: 'Update API Documentation',
        description: 'Ensure all v2 endpoints are documented with request/response examples for the mobile team.',
        dueDate: 'Oct 12',
        status: 'TODO' as any,
        boardId: '1',
        columnId: 'todo'
      },
      {
        id: 'task-2',
        title: 'Refactor Database Schema',
        dueDate: 'Oct 15',
        status: 'TODO' as any,
        boardId: '1',
        columnId: 'todo'
      },
      {
        id: 'task-3',
        title: 'Fix Auth Regression',
        description: 'Users reporting 401 errors on the login page after the last deploy.',
        dueDate: 'Today',
        status: 'IN_PROGRESS' as any,
        boardId: '1',
        columnId: 'in-progress'
      },
      {
        id: 'task-4',
        title: 'UI Component Library Audit',
        dueDate: 'Oct 20',
        status: 'IN_PROGRESS' as any,
        boardId: '1',
        columnId: 'in-progress'
      },
      {
        id: 'task-5',
        title: 'Security Patch v4.2.1',
        dueDate: 'Oct 05',
        status: 'DONE' as any,
        boardId: '1',
        columnId: 'done'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Design System Overhaul',
    description: 'Migrating the legacy component library to Tailwind CSS and implementing a new token system.',
    category: 'design',
    icon: Layout,
    color: 'orange',
    columns: {
      'todo': { id: 'todo', title: 'TO DO', taskIds: [] },
      'in-progress': { id: 'in-progress', title: 'IN PROGRESS', taskIds: [] },
      'done': { id: 'done', title: 'DONE', taskIds: [] }
    },
    columnOrder: ['todo', 'in-progress', 'done'],
    tasks: []
  },
  '3': {
    id: '3',
    title: 'Billing Infrastructure',
    description: 'Integration of new Stripe payment flows and automated tax calculation for global customers.',
    category: 'engineering',
    icon: Payments,
    color: 'blue',
    columns: {
      'todo': { id: 'todo', title: 'TO DO', taskIds: [] },
      'in-progress': { id: 'in-progress', title: 'IN PROGRESS', taskIds: [] },
      'done': { id: 'done', title: 'DONE', taskIds: [] }
    },
    columnOrder: ['todo', 'in-progress', 'done'],
    tasks: []
  },
  '4': {
    id: '4',
    title: 'Marketing Campaigns',
    description: 'Coordination across social, email, and paid channels for the upcoming holiday season sale.',
    category: 'marketing',
    icon: Campaign,
    color: 'purple',
    columns: {
      'todo': { id: 'todo', title: 'TO DO', taskIds: [] },
      'in-progress': { id: 'in-progress', title: 'IN PROGRESS', taskIds: [] },
      'done': { id: 'done', title: 'DONE', taskIds: [] }
    },
    columnOrder: ['todo', 'in-progress', 'done'],
    tasks: []
  }
};

export interface BoardContextType {
  boards: { [key: string]: AppBoard };
  createTask: (boardId: string, columnId: string, taskData: Omit<Task, 'id' | 'boardId' | 'columnId' | 'status'>) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  moveTask: (boardId: string, sourceColId: string, destColId: string, sourceIndex: number, destIndex: number, taskId: string) => void;
}

export const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
};

export const BoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [boards, setBoards] = useState<{ [key: string]: AppBoard }>(BoardsData);

  const createTask = (boardId: string, columnId: string, taskData: Omit<Task, 'id' | 'boardId' | 'columnId' | 'status'>) => {
    const newTaskId = `task-${Date.now()}`;
    
    const newTask: Task = {
      id: newTaskId,
      ...taskData,
      status: columnId.toUpperCase().replace('-', '_') as any,
      boardId,
      columnId
    };

    setBoards(prev => {
      const board = prev[boardId];
      if (!board) return prev;

      const column = board.columns[columnId];
      const newColumn = {
        ...column,
        taskIds: [...column.taskIds, newTaskId]
      };

      return {
        ...prev,
        [boardId]: {
          ...board,
          tasks: [...board.tasks, newTask],
          columns: {
            ...board.columns,
            [columnId]: newColumn
          }
        }
      };
    });
  };

  const deleteTask = (boardId: string, columnId: string, taskId: string) => {
    setBoards(prev => {
      const board = prev[boardId];
      if (!board) return prev;

      const column = board.columns[columnId];
      const newColumn = {
        ...column,
        taskIds: column.taskIds.filter(id => id !== taskId)
      };

      return {
        ...prev,
        [boardId]: {
          ...board,
          tasks: board.tasks.filter(t => t.id !== taskId),
          columns: {
            ...board.columns,
            [columnId]: newColumn
          }
        }
      };
    });
  };

  const moveTask = (boardId: string, sourceColId: string, destColId: string, sourceIndex: number, destIndex: number, taskId: string) => {
    setBoards(prev => {
      const board = prev[boardId];
      if (!board) return prev;

      const start = board.columns[sourceColId];
      const finish = board.columns[destColId];

      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(sourceIndex, 1);
      
      const newStart = { ...start, taskIds: startTaskIds };

      const finishTaskIds = start === finish ? startTaskIds : Array.from(finish.taskIds);
      finishTaskIds.splice(destIndex, 0, taskId);

      const newFinish = { ...finish, taskIds: finishTaskIds };

      let newTasks = board.tasks;
      if (sourceColId !== destColId) {
        newTasks = board.tasks.map(t => 
          t.id === taskId 
            ? { ...t, columnId: destColId, status: destColId.toUpperCase().replace('-', '_') as any } 
            : t
        );
      }

      return {
        ...prev,
        [boardId]: {
          ...board,
          tasks: newTasks,
          columns: { ...board.columns, [newStart.id]: newStart, [newFinish.id]: newFinish }
        }
      };
    });
  };

  return (
    <BoardContext.Provider value={{ boards, createTask, deleteTask, moveTask }}>
      {children}
    </BoardContext.Provider>
  );
};