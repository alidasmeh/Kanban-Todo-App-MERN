import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Search,
  Shield,
  User as UserIcon,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import Layout from '../components/Layout';
import { 
  fetchTeams, 
  addMemberToTeam, 
  removeMemberFromTeam, 
  fetchAllUsers,
  toggleAdminStatus
} from '../features/teamSlice';
import type { RootState, AppDispatch } from '../store';

const TeamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { teams, users, loading } = useSelector((state: RootState) => state.teams);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  
  const team = teams.find(t => t.id === id);
  const [userSearch, setUserSearch] = useState('');

  const isCurrentUserOwner = team?.owners.some(o => o.id === currentUser?.id);

  useEffect(() => {
    if (teams.length === 0) {
      dispatch(fetchTeams());
    }
    dispatch(fetchAllUsers());
  }, [dispatch, teams.length]);

  const handleAddMember = (userId: string) => {
    if (team) {
      dispatch(addMemberToTeam({ teamId: team.id, userId }));
      setUserSearch('');
    }
  };

  const handleRemoveMember = (userId: string) => {
    if (team && window.confirm('Are you sure you want to remove this member?')) {
      dispatch(removeMemberFromTeam({ teamId: team.id, userId }));
    }
  };

  const handleToggleAdmin = (userId: string) => {
    if (team) {
      dispatch(toggleAdminStatus({ teamId: team.id, userId }));
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())) &&
    team && !team.members.some(m => m.id === u.id)
  );

  if (!team && !loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-headline-md text-slate-800">Team not found</h2>
          <button onClick={() => navigate('/teams')} className="mt-4 text-primary font-bold flex items-center justify-center gap-2 mx-auto">
            <ArrowLeft className="w-4 h-4" /> Back to Teams
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <header className="mb-8">
        <nav className="flex items-center gap-2 text-label-sm text-slate-500 mb-2">
          <Link to="/teams" className="hover:text-primary transition-colors">Teams</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary font-semibold">{team?.name}</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-headline-lg text-slate-800 flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              {team?.name}
            </h2>
            <p className="text-body-base text-slate-500 mt-1">{team?.description || 'No description provided.'}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Members List */}
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-soft-float border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-headline-md text-slate-800 flex items-center gap-2">
                Team Members
                <span className="text-label-sm bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                  {team?.members.length}
                </span>
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team?.members.map((member) => {
                  const isOwner = team.owners.some(o => o.id === member.id);
                  return (
                    <div key={member.id} className="flex flex-col p-4 rounded-xl border border-slate-100 hover:border-primary/20 transition-all bg-white group hover:shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                            <UserIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-label-md font-bold text-slate-800 flex items-center gap-1.5">
                              {member.name}
                              {isOwner && <Shield className="w-4 h-4 text-amber-500" />}
                            </p>
                            <p className="text-body-sm text-slate-500">{member.email}</p>
                          </div>
                        </div>
                        {isCurrentUserOwner && member.id !== currentUser?.id && (
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Remove member"
                          >
                            <UserMinus className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      
                      {isCurrentUserOwner && (
                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <span className="text-label-sm text-slate-500 font-bold uppercase tracking-wider">Admin Access</span>
                          <button
                            onClick={() => handleToggleAdmin(member.id)}
                            disabled={member.id === currentUser?.id}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                              isOwner ? 'bg-primary' : 'bg-slate-200'
                            } ${member.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isOwner ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Add Members Sidebar */}
        <div className="order-1 lg:order-2 space-y-6">
          {isCurrentUserOwner && (
            <div className="bg-white rounded-xl shadow-soft-float border border-slate-200 p-6">
              <h3 className="text-headline-sm text-slate-800 mb-4">Add New Members</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-sm"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

                <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {userSearch.length > 0 ? (
                    filteredUsers.length > 0 ? (
                      filteredUsers.map(u => (
                        <button
                          key={u.id}
                          onClick={() => handleAddMember(u.id)}
                          className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-primary hover:bg-indigo-50/30 transition-all text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white text-slate-500">
                              <UserIcon className="w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-label-sm font-bold text-slate-800 truncate">{u.name}</p>
                              <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                            </div>
                          </div>
                          <UserPlus className="w-4.5 h-4.5 text-slate-300 group-hover:text-primary flex-shrink-0" />
                        </button>
                      ))
                    ) : (
                      <p className="text-center py-4 text-slate-400 text-body-sm italic">No users found</p>
                    )
                  ) : (
                    <p className="text-center py-4 text-slate-400 text-body-sm italic">Start typing to search users</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <h4 className="text-label-md font-bold text-indigo-800 mb-2">Team Management Tips</h4>
            <ul className="text-body-sm text-indigo-700 space-y-2 list-disc list-inside">
              <li>Team owners can add or remove any member.</li>
              <li>New members will instantly see all boards assigned to this team.</li>
              <li>Removing a member revokes their access to this team's boards.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeamDetail;
