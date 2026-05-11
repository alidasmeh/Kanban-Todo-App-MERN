import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  type DropResult 
} from '@hello-pangea/dnd';
import { 
  ChevronRight, 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  Edit2,
  Trash2
} from 'lucide-react';
import Layout from '../components/Layout';
import CreateTaskModal from '../components/CreateTaskModal';
import type { AppDispatch, RootState } from '../store';
import { 
  createTask as createTaskAction, 
  deleteTask as deleteTaskAction, 
  moveTask as moveTaskAction 
} from '../features/boardSlice';

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { boards } = useSelector((state: RootState) => state.boards);
  const board = boards.find((b: any) => b.id === id);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuTaskId(null);
      }
    };

    if (openMenuTaskId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuTaskId]);

  const handleCreateTask = (taskData: { title: string; dueDate: string; description: string }) => {
    const columnId = activeColumnId || 'todo';
    dispatch(createTaskAction({ boardId: id || '1', columnId, ...taskData }));
  };

  const handleDeleteTask = (taskId: string, columnId: string) => {
    dispatch(deleteTaskAction({ taskId, boardId: id || '1', columnId }));
    setOpenMenuTaskId(null);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch(moveTaskAction({
      boardId: id || '1',
      sourceColId: source.droppableId,
      destColId: destination.droppableId,
      sourceIndex: source.index,
      destIndex: destination.index,
      taskId: draggableId
    }));
  };

  if (!board) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <h2 className="text-headline-md text-slate-800">Board not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Board Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-2 text-label-sm text-slate-500 mb-1">
            <Link to="/boards" className="hover:text-primary">Boards</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary font-semibold">Kanban Board</span>
          </nav>
          <h1 className="text-headline-lg text-slate-800">{board.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setActiveColumnId('todo');
              setIsTaskModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-label-md hover:opacity-90 active:scale-95 transition-all"
          >
            <Plus className="w-4.5 h-4.5" />
            New Task
          </button>
        </div>
      </header>

      {/* Kanban Board Container */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6 items-start">
          {board.columnOrder.map((columnId) => {
            const column = board.columns[columnId];
            const columnTasks = column.taskIds.map((taskId) => board.tasks.find(t => t.id === taskId)!);

            return (
              <div key={column.id} className="min-w-[320px] w-[320px] flex flex-col gap-3">
                <div className="flex items-center justify-between px-2 mb-2 sticky top-0 bg-slate-100 py-2 z-10">
                  <div className="flex items-center gap-2">
                    <h3 className="text-label-md font-bold text-slate-500">{column.title}</h3>
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-label-sm font-bold">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`bg-slate-100/50 rounded-xl p-2 min-h-[500px] flex flex-col gap-3 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <article
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                transform: snapshot.isDragging 
                                  ? `${provided.draggableProps.style?.transform} rotate(2deg)` 
                                  : provided.draggableProps.style?.transform
                              }}
                              className={`bg-white p-4 rounded-lg shadow-soft-float border-t-4 group cursor-grab active:cursor-grabbing transition-all ${
                                snapshot.isDragging ? 'shadow-xl ring-2 ring-primary z-50' : 'border-slate-200'
                              } ${
                                task.columnId === 'todo' ? 'border-t-primary' :
                                task.columnId === 'in-progress' ? 'border-t-orange-400' :
                                'border-t-emerald-400 grayscale opacity-80'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-0.5 rounded text-label-sm font-bold ${
                                  task.columnId === 'todo' ? 'bg-indigo-50 text-indigo-700' :
                                  task.columnId === 'in-progress' ? 'bg-orange-50 text-orange-700' :
                                  'bg-emerald-50 text-emerald-700'
                                }`}>
                                  {task.columnId === 'done' ? 'Finished' : task.status.replace("_"," ")}
                                </span>
                                <div className="relative">
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setOpenMenuTaskId(openMenuTaskId === task.id ? null : task.id);
                                    }}
                                    className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>
                                  
                                  {openMenuTaskId === task.id && (
                                    <div 
                                      ref={menuRef}
                                      className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-[100] py-1"
                                    >
                                      <div className="border-t border-slate-50 my-1"></div>
                                      <button className="w-full text-left px-3 py-2 text-body-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                                        <Edit2 className="w-3.5 h-3.5" />
                                        Edit Task
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteTask(task.id, task.columnId)}
                                        className="w-full text-left px-3 py-2 text-body-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete Task
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <h4 className={`text-body-base font-bold text-slate-800 mb-2 ${task.columnId === 'done' ? 'line-through' : ''}`}>
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-body-sm text-slate-500 mb-4 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                              
                              {task.columnId === 'todo' && (
                                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2 text-slate-400">
                                  <Calendar className="w-4 h-4" />
                                  <span className="text-label-sm">{task.dueDate}</span>
                                </div>
                              </div>
                            </article>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <CreateTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onCreate={handleCreateTask} 
      />
    </Layout>
  );
};

export default BoardDetail;
