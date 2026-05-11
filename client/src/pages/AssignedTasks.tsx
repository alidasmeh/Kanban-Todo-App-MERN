import React from 'react';
import { Search, MoreVertical, Calendar, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout';

import { useBoardContext } from '../context/BoardContext';

const AssignedTasks: React.FC = () => {
  const { boards } = useBoardContext();
  const taskList = Object.values(boards).flatMap(board => board.tasks);

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-headline-lg text-slate-800 mb-2">Assigned to Me</h1>
        <p className="text-slate-500 text-body-base">Review and manage all tasks currently assigned to your profile across all boards.</p>
      </header>

      {/* Filter/Action Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-body-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-full md:w-64 transition-all" 
              placeholder="Search tasks..." 
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {taskList.map((task) => {
          const board = boards[task.boardId];
          const project = board ? board.title : 'Unknown Project';
          const statusDisplay = task.status.replace("_", " ");
          const isDone = task.status === 'DONE';
          const color = board?.color || 'blue';
          
          return (
          <div 
            key={task.id}
            className="group bg-white shadow-soft-float rounded-xl p-6 border border-slate-200 hover:border-primary transition-all cursor-pointer relative overflow-hidden"
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
              color === 'blue' || color === 'indigo' || color === 'purple' ? 'bg-primary' : 
              color === 'emerald' || isDone ? 'bg-emerald-500' : 
              color === 'orange' ? 'bg-orange-400' :
              'bg-slate-300'
            }`}></div>
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-label-sm">
                    {project}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-label-sm flex items-center gap-1.5 ${
                    task.status === 'IN_PROGRESS' ? 'bg-orange-50 text-orange-700' :
                    task.status === 'DONE' ? 'bg-emerald-50 text-emerald-700' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      task.status === 'IN_PROGRESS' ? 'bg-orange-600' :
                      task.status === 'DONE' ? 'bg-emerald-600' :
                      'bg-slate-400'
                    }`}></span>
                    {statusDisplay}
                  </span>
                </div>
                <h3 className={`text-headline-md text-slate-800 mb-4 ${isDone ? 'line-through opacity-60' : ''}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-6">
                  {isDone ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                      <span className="text-body-sm font-medium">Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4.5 h-4.5" />
                      <span className="text-body-sm">Due: {task.dueDate}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-4">
                <button className="text-slate-400 hover:text-primary transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default AssignedTasks;
