import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Statistics from '../pages/Statistics';
import { useAuth } from '../context/AuthContext';
import CalendarPage from '../pages/CalendarPage';

const AppRouter = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/statistics" element={token ? <Statistics /> : <Navigate to="/login" />} />
        <Route path="/calendar" element={token ? <CalendarPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
