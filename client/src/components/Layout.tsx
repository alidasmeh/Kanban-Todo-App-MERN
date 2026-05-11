import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Settings, 
  LayoutDashboard, 
  UserCheck, 
  Plus, 
  LogOut,
  Rocket
} from 'lucide-react';
import { logout } from '../features/authSlice';
import { createBoard, fetchBoards } from '../features/boardSlice';
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
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchBoards());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateBoard = (title: string) => {
    dispatch(createBoard({ title }));
  };

  const navItems = [
    { name: 'All Boards', icon: LayoutDashboard, path: '/boards' },
    { name: 'Assigned to Me', icon: UserCheck, path: '/assigned' },
  ];

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/boards" className="text-headline-md font-extrabold text-primary tracking-tight">
            Kinetic Board
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <Settings className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </header>

      <div className="flex pt-16 ">
        {/* Side Navigation Bar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 flex flex-col p-4 border-r border-slate-200 bg-slate-50 z-40 hidden md:flex">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-label-md font-bold text-primary">Workspace</h2>
              <p className="text-[10px] text-slate-500">Engineering Team</p>
            </div>
          </div>
          
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
                      ? 'text-primary font-bold bg-indigo-50' 
                      : 'text-slate-500 hover:bg-slate-200/50'
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
            className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white rounded-lg text-label-md shadow-sm hover:opacity-90 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create New Board
          </button>

          <div className="mt-auto space-y-1 border-t border-slate-200 pt-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-200/50 rounded-lg transition-all w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-label-md">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around py-3 px-2 z-50">
        <Link to="/boards" className={`flex flex-col items-center gap-1 ${location.pathname === '/boards' ? 'text-primary' : 'text-slate-500'}`}>
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-bold">Boards</span>
        </Link>
        <Link to="/assigned" className={`flex flex-col items-center gap-1 ${location.pathname === '/assigned' ? 'text-primary' : 'text-slate-500'}`}>
          <UserCheck className="w-6 h-6" />
          <span className="text-[10px]">My Tasks</span>
        </Link>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <Settings className="w-6 h-6" />
          <span className="text-[10px]">Settings</span>
        </button>
      </nav>

      {/* Contextual FAB for Mobile */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-50 active:scale-90 transition-transform"
      >
        <Plus className="w-7 h-7" />
      </button>

      <CreateBoardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateBoard} 
      />
    </div>
  );
};

export default Layout;
