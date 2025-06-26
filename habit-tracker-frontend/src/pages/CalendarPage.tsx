import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHabits } from '../api/api';
import HabitCalendar from '../components/HabitCalendar';
import Layout from '../components/Layout';

interface Habit {
  id: number;
  name: string;
  history: string[];
}

const CalendarPage = () => {
  const { token } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    getHabits(token)
      .then(setHabits)
      .catch(err => setError(err.message));
  }, [token]);

  return (
    <Layout>
      <div className="p-6">
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map(habit => (
            <div key={habit.id} className="p-4 bg-gradient-to-b from-blue-200 to-blue-400 rounded shadow">
              <h2 className="text-xl text-white font-semibold mb-2">{habit.name}</h2>
              <HabitCalendar history={habit.history} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
