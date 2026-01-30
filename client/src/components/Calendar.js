import React, { useState } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import './Calendar.css';

function Calendar({ selectedDate, onDateClick, isDateLogged, isDatePredictedPeriod, loggedDates, predictedPeriodDays }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weeks = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="month-nav-btn">←</button>
        <h2>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={handleNextMonth} className="month-nav-btn">→</button>
      </div>

      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-days">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-week">
            {week.map((day, dayIndex) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = isSameDay(day, selectedDate);
              const isLogged = isDateLogged(day);
              const isPredictedPeriod = isDatePredictedPeriod(day);

              return (
                <button
                  key={dayIndex}
                  className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isLogged ? 'logged' : ''} ${isPredictedPeriod ? 'predicted-period' : ''}`}
                  onClick={() => onDateClick(day)}
                >
                  <span className="day-number">{day.getDate()}</span>
                  {isLogged && <span className="logged-dot"></span>}
                  {isPredictedPeriod && <span className="period-dot"></span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-dot logged"></span>
          <span>Days Logged</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot period"></span>
          <span>Predicted Period</span>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
