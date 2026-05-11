import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2
} from 'lucide-react';
import Layout from '../components/Layout';
import { useBoardContext } from '../context/BoardContext';

const Boards: React.FC = () => {
  const { boards } = useBoardContext();
  const boardsList = Object.values(boards);

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-headline-lg text-slate-800">All Boards</h2>
          <p className="text-body-base text-slate-500">Manage and monitor your team's active workstreams.</p>
        </div>
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boardsList.map((board) => {
          const taskCount = Object.values(board.columns).reduce((acc, col) => acc + col.taskIds.length, 0);
          const doneCount = board.columns['done']?.taskIds.length || 0;
          const progress = taskCount === 0 ? 0 : Math.round((doneCount / taskCount) * 100);
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
                {board.description}
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

      </div>
    </Layout>
  );
};

export default Boards;
