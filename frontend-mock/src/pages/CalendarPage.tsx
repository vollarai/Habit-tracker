import { useEffect, useState } from 'react';
import HabitCalendar from '../components/HabitCalendar';
import Layout from '../components/Layout';
import { mockHabits } from '../mocks/habits.ts'; 

interface Habit {
  id: string;
  name: string;
  history: string[];
}

const CalendarPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHabits(mockHabits);
    }, 300); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className="p-6">
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
