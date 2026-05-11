import React, { useState } from 'react';
import Modal from './Modal';
import { Search, User, X } from 'lucide-react';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title);
      setTitle('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Board">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-label-md text-slate-500 uppercase tracking-wider" htmlFor="board-title">
            Board Title
          </label>
          <input
            className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-base"
            id="board-title"
            placeholder="e.g., Q4 Product Roadmap"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-label-md text-slate-500 uppercase tracking-wider">Add Members</label>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
              Optional
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-base"
              placeholder="Search by name or invite by email..."
              type="text"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: '1', name: 'Sarah Chen' },
              { id: '2', name: 'Marcus T.' }
            ].map(user => (
              <div key={user.id} className="flex items-center gap-2 bg-indigo-50/50 px-3 py-1.5 rounded-full border border-indigo-100">
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="w-3 h-3 text-indigo-600" />
                </div>
                <span className="text-body-sm font-bold text-indigo-700">{user.name}</span>
                <button type="button" className="text-indigo-400 hover:text-indigo-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-label-md font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 bg-primary text-white rounded-lg text-label-md font-bold shadow-sm hover:brightness-110 transition-all active:scale-[0.98]"
          >
            Create Board
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBoardModal;
