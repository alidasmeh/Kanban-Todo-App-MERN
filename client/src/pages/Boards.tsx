import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2,
  Plus
} from 'lucide-react';
import Layout from '../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import CreateBoardModal from '../components/CreateBoardModal';
import { createBoard } from '../features/boardSlice';

const Boards: React.FC = () => {
  const { boards } = useSelector((state: RootState) => state.boards);
  const { teams } = useSelector((state: RootState) => state.teams);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateBoard = (data: { title: string; team: string }) => {
    dispatch(createBoard(data));
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-headline-lg text-slate-800">All Boards</h2>
          <p className="text-body-base text-slate-500">Manage and monitor your team's active workstreams.</p>
        </div>
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {boards.map((board) => {
          const taskCount = Object.values(board.columns).reduce((acc, col) => acc + col.taskIds.length, 0);
          const doneCount = board.columns['done']?.taskIds.length || 0;
          const progress = taskCount === 0 ? 0 : Math.round((doneCount / taskCount) * 100);
          const teamName = teams.find(t => t.id === board.team)?.name || 'Unknown Team';
          
          return (
            <Link 
              key={board.id} 
              to={`/boards/${board.id}`}
              className="bg-white rounded-xl shadow-soft-float border border-slate-200 p-6 hover:border-primary transition-all group flex flex-col h-full"
            >
              <h3 className="text-headline-md text-slate-800 mb-2 group-hover:text-primary transition-colors">
                {board.title}
              </h3>
              <p className="text-body-sm text-slate-500 mb-6 line-clamp-2">
                {teamName}
              </p>
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-slate-400" />
                    <span className="text-label-md text-slate-500">{taskCount} Tasks</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Create Board Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center gap-4 bg-white rounded-xl shadow-soft-float border-2 border-dashed border-slate-200 p-6 hover:border-primary hover:bg-slate-50 transition-all text-slate-500 hover:text-primary min-h-[200px] group h-full"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-label-md font-bold uppercase tracking-wider">Create New Board</span>
        </button>
      </div>

      <CreateBoardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateBoard} 
      />
    </Layout>
  );
};


export default Boards;
