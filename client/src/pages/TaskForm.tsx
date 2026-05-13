import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Rocket, Calendar, AlertCircle, ChevronLeft, Save, User as UserIcon } from 'lucide-react';
import Layout from '../components/Layout';
import type { AppDispatch, RootState } from '../store';
import { createTask, updateTask } from '../features/boardSlice';
import type { Task, Board, User } from '../types';

const TaskForm: React.FC = () => {
  const { boardId, taskId } = useParams<{ boardId: string; taskId?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { boards } = useSelector((state: RootState) => state.boards);
  const { teams } = useSelector((state: RootState) => state.teams);
  
  const board = boards.find((b: Board) => b.id === boardId);
  const team = teams.find(t => t.id === board?.team);
  const existingTask = board?.tasks.find((t: Task) => t.id === taskId);

  // Combine owners and members for potential assignees
  const members = team ? [...team.owners, ...team.members] : [];
  // Remove duplicates just in case
  const uniqueMembers = members.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState('todo');
  const [assigneeId, setAssigneeId] = useState('');
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDueDate(existingTask.dueDate);
      setDescription(existingTask.description || '');
      setColumnId(existingTask.columnId);
      setAssigneeId(existingTask.assignee?.id || '');
    }
  }, [existingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; dueDate?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today && !existingTask) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (existingTask) {
      await dispatch(updateTask({
        id: existingTask.id,
        title,
        dueDate,
        description,
        columnId,
        assignee: assigneeId,
        boardId: boardId!
      }));
    } else {
      await dispatch(createTask({
        title,
        dueDate,
        description,
        boardId: boardId!,
        columnId: 'todo',
        assignee: assigneeId
      }));
    }
    
    navigate(`/boards/${boardId}`);
  };

  if (boardId && !board) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <h2 className="text-headline-md text-slate-800">Board not found</h2>
          <Link to="/boards" className="text-primary font-bold hover:underline flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" />
            Back to Boards
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <Link 
            to={`/boards/${boardId}`} 
            className="inline-flex items-center gap-2 text-label-md text-slate-500 hover:text-primary transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Board
          </Link>
          <h1 className="text-headline-lg text-slate-800">
            {existingTask ? 'Edit Task' : 'Create New Task'}
          </h1>
          <p className="text-slate-500 text-body-base mt-2">
            {existingTask 
              ? 'Update your task details to keep your project on track.' 
              : 'Set up your next milestone with clarity and precision.'}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft-float border border-slate-100 p-6 xl:p-8 space-y-8">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="block text-label-md font-bold text-slate-700 uppercase tracking-wider" htmlFor="task-title">
              Title <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                className={`w-full px-4 py-3 rounded-lg border-2 bg-slate-50 text-body-base placeholder:text-slate-400 outline-none transition-all ${
                  errors.title ? 'border-error focus:border-error' : 'border-slate-200 focus:border-primary'
                }`}
                id="task-title"
                placeholder="e.g., Finalize Q4 Engineering Roadmap"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                autoFocus
              />
              {errors.title && (
                <div className="mt-2 flex items-center gap-1.5 text-error">
                  <AlertCircle className="w-4 h-4 fill-current" />
                  <span className="text-label-sm font-bold">{errors.title}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Due Date */}
            <div className="space-y-2">
              <label className="block text-label-md font-bold text-slate-700 uppercase tracking-wider" htmlFor="due-date">
                Due Date <span className="text-error">*</span>
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  className={`w-full px-4 py-3 pl-12 rounded-lg border-2 bg-slate-50 text-body-base outline-none transition-all ${
                    errors.dueDate ? 'border-error focus:border-error' : 'border-slate-200 focus:border-primary'
                  }`}
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    if (e.target.value) setErrors((prev) => ({ ...prev, dueDate: undefined }));
                  }}
                />
              </div>
              {errors.dueDate && (
                <div className="mt-2 flex items-center gap-1.5 text-error">
                  <AlertCircle className="w-4 h-4 fill-current" />
                  <span className="text-label-sm font-bold">{errors.dueDate}</span>
                </div>
              )}
            </div>

            {/* Assignee Selection */}
            <div className="space-y-2">
              <label className="block text-label-md font-bold text-slate-700 uppercase tracking-wider" htmlFor="assignee">
                Assignee
              </label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <select
                  id="assignee"
                  className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-slate-200 bg-slate-50 text-body-base outline-none focus:border-primary transition-all appearance-none"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                >
                  <option value="">Select Assignee</option>
                  {uniqueMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-label-md font-bold text-slate-700 uppercase tracking-wider" htmlFor="task-description">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-primary bg-slate-50 text-body-base resize-none outline-none transition-all"
              id="task-description"
              placeholder="Detail the objectives, stakeholders, and success criteria..."
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
            <button
              className="px-6 py-3 rounded-xl text-label-md font-bold text-slate-500 hover:bg-slate-100 transition-all active:scale-95"
              type="button"
              onClick={() => navigate(`/boards/${boardId}`)}
            >
              Cancel
            </button>
            <button
              className="px-10 py-3 rounded-xl text-label-md font-bold bg-primary text-white shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              type="submit"
            >
              {existingTask ? (
                <>
                  <Save className="w-5 h-5" />
                  Update Task
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default TaskForm;
