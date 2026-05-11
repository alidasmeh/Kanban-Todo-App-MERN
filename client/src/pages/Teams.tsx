import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Shield,
  ArrowRight
} from 'lucide-react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import { 
  fetchTeams, 
  createTeam 
} from '../features/teamSlice';
import type { RootState, AppDispatch } from '../store';

const Teams: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { teams, loading } = useSelector((state: RootState) => state.teams);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      dispatch(createTeam({ name: newTeamName, description: newTeamDesc }));
      setNewTeamName('');
      setNewTeamDesc('');
      setIsCreateModalOpen(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-headline-lg text-slate-800">Teams & Users</h2>
          <p className="text-body-base text-slate-500">Manage your teams and collaborate with others.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-label-md font-bold shadow-sm hover:brightness-110 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Create New Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Link 
            key={team.id} 
            to={`/teams/${team.id}`}
            className="group bg-white rounded-xl shadow-soft-float border border-slate-200 p-6 hover:border-primary transition-all flex flex-col h-full relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Users className="w-6 h-6" />
              </div>
              {currentUser?.id && team.owners.some(o => o.id === currentUser.id) && (
                <Shield className="w-5 h-5 text-amber-500" />
              )}
            </div>
            
            <h3 className="text-headline-md text-slate-800 mb-2 group-hover:text-primary transition-colors">
              {team.name}
            </h3>
            <p className="text-body-sm text-slate-500 mb-6 line-clamp-2">
              {team.description || 'No description provided.'}
            </p>
            
            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-label-md text-slate-500">
                {team.members.length} {team.members.length === 1 ? 'Member' : 'Members'}
              </span>
              <div className="flex items-center gap-1 text-primary font-bold text-label-md opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                Manage <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}

        {teams.length === 0 && !loading && (
          <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-headline-md text-slate-400">No teams found</h3>
            <p className="text-body-base text-slate-400 mt-2">Create a team to start collaborating with others.</p>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Team">
        <form onSubmit={handleCreateTeam} className="space-y-6">
          <div className="space-y-2">
            <label className="text-label-md text-slate-500 uppercase tracking-wider">Team Name</label>
            <input
              className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-base"
              placeholder="e.g., Frontend Engineering"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-label-md text-slate-500 uppercase tracking-wider">Description (Optional)</label>
            <textarea
              className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-base min-h-[100px]"
              placeholder="What is this team about?"
              value={newTeamDesc}
              onChange={(e) => setNewTeamDesc(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-6 py-2.5 text-label-md font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-primary text-white rounded-lg text-label-md font-bold shadow-sm hover:brightness-110 transition-all"
            >
              Create Team
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Teams;
