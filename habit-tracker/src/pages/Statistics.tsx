import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHabits } from '../api/api';
import Layout from '../components/Layout';
import { FaFire, FaClock, FaTimesCircle } from "react-icons/fa";

interface Habit {
  id: number;
  name: string;
  history: string[];
}

const calculateStreak = (history: string[], includeToday: boolean) => {
  const today = new Date();
  let streak = 0;
  const sortedHistory = [...history].sort((a, b) => b.localeCompare(a));

  for (let i = 0; i < sortedHistory.length; i++) {
    const [year, month, day] = sortedHistory[i].split('-').map(Number);
    const date = new Date(year, month - 1, day);

    let diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (!includeToday) diffDays -= 1;

    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }
  return streak;
};

const getStreakStatus = (history: string[]) => {
  const todayStr = new Date().toLocaleDateString('sv-SE');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('sv-SE');

  const hasToday = history.includes(todayStr);
  const hasYesterday = history.includes(yesterdayStr);

  if (hasToday) return 'active';
  if (!hasToday && hasYesterday) return 'pending';
  return 'none';
};

const Statistics = () => {
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
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => {
          const status = getStreakStatus(habit.history);
          let streak = 0;

          if (status === 'active') {
            streak = calculateStreak(habit.history, true);
          } else if (status === 'pending') {
            streak = calculateStreak(habit.history, false);
          }

          let statusColor = 'text-red-500';
          let statusIcon = <FaTimesCircle className="text-2xl text-red-500" />;
          if (status === 'active') {
            statusColor = 'text-orange-500';
            statusIcon = <FaFire className="text-2xl" />;
          } else if (status === 'pending') {
            statusColor = 'text-black';
            statusIcon = <FaClock className="text-2xl text-black" />;
          }

          return (
            <div
              key={habit.id}
              className="bg-gradient-to-b from-blue-200 to-blue-300 rounded-lg shadow-lg p-6 flex flex-col justify-between hover:scale-[1.02] transition"
            >
              <h2 className="text-xl text-white font-semibold mb-4 ">{habit.name}</h2>

              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${statusColor}`}>
                  {statusIcon}
                  <span className="text-lg font-bold">
                    {streak} day{streak === 1 ? '' : 's'}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(streak, 30) * 3.3}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })} 
      </div>
    </Layout>
  );
};

export default Statistics;
