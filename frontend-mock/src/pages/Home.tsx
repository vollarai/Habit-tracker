import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { mockHabits } from '../mocks/habits.ts'; 

interface Habit {
  id: string;
  name: string;
  history: string[];
}

const Home = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setHabits(mockHabits);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleAddHabit = () => {
    if (!newHabit.trim()) return;

    const newId = (habits.length + 1).toString();
    const newHabitObj: Habit = {
      id: newId,
      name: newHabit,
      history: [],
    };

    setHabits([...habits, newHabitObj]);
    setNewHabit('');
  };

  const handleMarkHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];

    const updated = habits.map((habit) =>
      habit.id === habitId && !habit.history.includes(today)
        ? { ...habit, history: [...habit.history, today] }
        : habit
    );

    setHabits(updated);
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
