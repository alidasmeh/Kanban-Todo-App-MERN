import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';

import { BoardProvider } from './context/BoardContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Boards from './pages/Boards';
import BoardDetail from './pages/BoardDetail';
import AssignedTasks from './pages/AssignedTasks';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <BoardProvider>
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/boards" />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/boards" />} />
          
          {/* Protected Routes */}
          <Route path="/boards" element={isAuthenticated ? <Boards /> : <Navigate to="/login" />} />
          <Route path="/boards/:id" element={isAuthenticated ? <BoardDetail /> : <Navigate to="/login" />} />
          <Route path="/assigned" element={isAuthenticated ? <AssignedTasks /> : <Navigate to="/login" />} />
          
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/boards" />} />
        </Routes>
      </Router>
    </BoardProvider>
  );
}

export default App;
