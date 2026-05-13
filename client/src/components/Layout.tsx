import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Settings, 
  LayoutDashboard, 
  UserCheck, 
  Users,
  Plus, 
  LogOut,
  Rocket,
  User
} from 'lucide-react';
import { logout } from '../features/authSlice';
import { createBoard, fetchBoards } from '../features/boardSlice';
import { fetchTeams } from '../features/teamSlice';
import CreateBoardModal from './CreateBoardModal';
import type { RootState, AppDispatch } from '../store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchBoards());
      dispatch(fetchTeams());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateBoard = (data: { title: string; team: string }) => {
    dispatch(createBoard(data));
  };

  const navItems = [
    { name: 'All Boards', icon: LayoutDashboard, path: '/boards' },
    { name: 'Assigned to Me', icon: UserCheck, path: '/assigned' },
    { name: 'Teams & Users', icon: Users, path: '/teams' },
  ];

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container-lowest shadow-sm bg-white">
        <div className="flex items-center gap-8">
          <Link to="/boards" className="text-headline-md font-extrabold text-primary tracking-tight">
            Kinetic Board
          </Link>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Side Navigation Bar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 flex flex-col p-4 border-r border-outline-variant bg-surface-container-low z-40 hidden xl:flex">
          
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out ${
                    isActive 
                      ? 'text-primary font-bold bg-secondary-container' 
                      : 'text-on-surface-variant hover:bg-surface-container-highest'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-label-md">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-on-primary rounded-lg text-label-md shadow-sm hover:opacity-90 transition-all active:scale-95 text-white"
          >
            <Plus className="w-4 h-4" />
            Create New Board
          </button>

          <div className="mt-auto space-y-1 border-t border-outline-variant pt-4">
            {user && (
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-label-sm font-bold text-slate-700 truncate">{user.name}</span>
                  <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
                </div>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-all w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-label-md">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 xl:ml-64 p-3 pb-24 xl:pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="xl:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant flex justify-around py-3 px-2 z-50 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] bg-white">
        <Link to="/boards" className={`flex flex-col items-center gap-1 ${location.pathname === '/boards' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-tighter">Boards</span>
        </Link>
        <Link to="/assigned" className={`flex flex-col items-center gap-1 ${location.pathname === '/assigned' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
          <UserCheck className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-tighter">My Tasks</span>
        </Link>
        <Link to="/teams" className={`flex flex-col items-center gap-1 ${location.pathname === '/teams' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
          <Users className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-tighter">Teams</span>
        </Link>
      </nav>

      <CreateBoardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateBoard} 
      />
    </div>
  );
};

export default Layout;
