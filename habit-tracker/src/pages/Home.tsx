import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHabits, addHabit, markHabit } from '../api/api';

interface Habit {
  id: number;
  name: string;
  history: string[];
}

const Home = () => {
  const { token } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    getHabits(token)
      .then(setHabits)
      .catch(err => setError(err.message));
  }, [token]);

  const handleAddHabit = async () => {
    if (!newHabit.trim()) return;
    try {
      const habit = await addHabit(token!, newHabit);
      setHabits([...habits, habit]);
      setNewHabit('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMarkHabit = async (habitId: number) => {
    try {
      const updatedHabit = await markHabit(token!, habitId);
      setHabits(habits.map(h => h.id === habitId ? updatedHabit : h));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isMarkedToday = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.history.includes(today);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white p-6 text-white">

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="New habit"
            className="border border-white p-2 rounded w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button 
            onClick={handleAddHabit} 
            className="bg-blue-300 text-white px-4 rounded hover:bg-blue-400"
          >
            Add
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <div key={habit.id} className="bg-gradient-to-b from-blue-200 to-blue-400 rounded-lg shadow-lg p-6 flex flex-col justify-between hover:scale-[1.02] transition">
              <span className="text-xl font-semibold mb-4">{habit.name}</span>
              <div className="flex justify-end">
                <button
                  onClick={() => handleMarkHabit(habit.id)}
                  className={`px-4 py-2 rounded transition font-medium ${
                    isMarkedToday(habit)
                      ? 'bg-blue-400 text-white cursor-default'
                      : 'bg-blue-300 text-white hover:bg-blue-500'
                  }`}
                  disabled={isMarkedToday(habit)}
                >
                  {isMarkedToday(habit) ? 'Done' : 'Mark today'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
};

export default Home;
