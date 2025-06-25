import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaChartBar, FaSignOutAlt, FaCalendarAlt } from "react-icons/fa";

const Sidebar = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 p-2 rounded transition ${
      isActive ? 'bg-blue-400' : 'hover:bg-blue-400'
    }`;

  return (
    <div className="sticky top-0 h-screen overflow-y-auto p-4 flex flex-col flex-shrink-0 
      bg-gradient-to-b from-blue-300 to-blue-500 text-white shadow-lg min-w-max">
      
      <div className="text-2xl font-bold mb-6 whitespace-nowrap">Habit Tracker</div>

      <div className="flex flex-col gap-4">
        <NavLink to="/" className={linkClass}>
          <FaHome /> Home
        </NavLink>

        <NavLink to="/statistics" className={linkClass}>
          <FaChartBar /> Statistics
        </NavLink>

        <NavLink to="/calendar" className={linkClass}>
          <FaCalendarAlt /> Calendar
        </NavLink>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-300 p-2 rounded mt-auto"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
