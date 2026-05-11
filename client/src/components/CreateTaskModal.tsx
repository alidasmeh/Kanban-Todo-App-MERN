import React, { useState } from 'react';
import Modal from './Modal';
import { Rocket, Calendar, AlertCircle, Lightbulb } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: { title: string; dueDate: string; description: string }) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required to create a task');
      return;
    }
    onCreate({ title, dueDate, description });
    setTitle('');
    setDueDate('');
    setDescription('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Task">
      <div className="flex flex-col gap-6">
        <header>
          <p className="text-slate-500 text-body-base">Set up your next milestone with clarity and precision.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="block text-label-md font-bold text-slate-700 uppercase tracking-wider" htmlFor="task-title">
              Title <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                className={`w-full px-4 py-3 rounded-lg border-2 bg-slate-50 text-body-base placeholder:text-slate-400 outline-none transition-all ${
                  error ? 'border-error focus:border-error' : 'border-slate-200 focus:border-primary'
                }`}
                id="task-title"
                placeholder="e.g., Finalize Q4 Engineering Roadmap"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value) setError('');
                }}
                autoFocus
              />
              {error && (
                <div className="mt-2 flex items-center gap-1.5 text-error">
                  <AlertCircle className="w-4 h-4 fill-current" />
                  <span className="text-label-sm font-bold">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div className="space-y-2">
              <label className="block text-label-md font-bold text-slate-700 uppercase tracking-wider" htmlFor="due-date">
                Due Date
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  className="w-full px-4 py-3 pl-12 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-body-base outline-none transition-all"
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-label-md font-bold text-slate-700 uppercase tracking-wider" htmlFor="task-description">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 text-body-base resize-none outline-none transition-all"
              id="task-description"
              placeholder="Detail the objectives, stakeholders, and success criteria..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              className="px-6 py-2.5 rounded-lg text-label-md font-bold text-slate-500 hover:bg-slate-100 transition-all active:scale-95"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-8 py-2.5 rounded-lg text-label-md font-bold bg-primary text-white shadow-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              type="submit"
            >
              <Rocket className="w-4.5 h-4.5" />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateTaskModal;
