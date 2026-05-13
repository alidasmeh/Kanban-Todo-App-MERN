import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; team: string }) => void;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [team, setTeam] = useState('');
  const { teams } = useSelector((state: RootState) => state.teams);

  useEffect(() => {
    if (teams.length > 0 && !team) {
      setTeam(teams[0].id);
    }
  }, [teams, team]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && team) {
      onCreate({ title, team });
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

        <div className="space-y-2">
          <label className="text-label-md text-slate-500 uppercase tracking-wider" htmlFor="board-team">
            Assign to Team
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <select
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-base appearance-none cursor-pointer"
              id="board-team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              required
            >
              <option value="" disabled>Select a team</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          {teams.length === 0 && (
            <p className="text-[12px] text-amber-600 mt-1 italic">
              You must be a member of at least one team to create a board.
            </p>
          )}
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
