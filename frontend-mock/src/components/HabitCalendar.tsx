import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface HabitCalendarProps {
  history: string[];
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({ history }) => {
  const historySet = new Set(history);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = date.toLocaleDateString('sv-SE');
      if (historySet.has(dateStr)) {
        return 'highlight';
      }
    }
    return null;
  };

  return (
    <div className="p-4">
      <Calendar
        tileClassName={tileClassName}
        calendarType="iso8601"
      />
    </div>
  );
};

export default HabitCalendar;
