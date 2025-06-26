import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { FaFire, FaClock, FaTimesCircle } from "react-icons/fa";
import { mockHabits } from '../mocks/habits.ts'; 

interface Habit {
  id: string;
  name: string;
  history: string[];
}

const calculateStreak = (history: string[], includeToday: boolean) => {
  const today = new Date();
  let streak = 0;
  const sortedHistory = [...history].sort((a, b) => b.localeCompare(a));

  for (let i = 0; i < sortedHistory.length; i++) {
    const date = new Date(sortedHistory[i]);
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
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const hasToday = history.includes(todayStr);
  const hasYesterday = history.includes(yesterdayStr);

  if (hasToday) return 'active';
  if (!hasToday && hasYesterday) return 'pending';
  return 'none';
};

const Statistics = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHabits(mockHabits);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
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
            statusIcon = <FaFire className="text-2xl text-orange-500" />;
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
