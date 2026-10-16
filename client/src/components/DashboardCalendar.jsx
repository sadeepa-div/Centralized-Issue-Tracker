import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function DashboardCalendar() {
  const today = new Date();

  const [currentDate, setCurrentDate] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

  const [selectedDate, setSelectedDate] =
    useState(today);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName =
    currentDate.toLocaleString("default", {
      month: "long",
    });

  const firstDay =
    new Date(year, month, 1).getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const previousMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };

  const goToday = () => {
    const now = new Date();

    setCurrentDate(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
    );

    setSelectedDate(now);
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    return (
      selectedDate &&
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const selectDay = (day) => {
    setSelectedDate(
      new Date(
        year,
        month,
        day
      )
    );
  };

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(
      <div
        key={`empty-${i}`}
        className="calendar-empty"
      />
    );
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(
      <button
        key={day}
        type="button"
        className={`
          calendar-day
          ${isToday(day) ? "calendar-today" : ""}
          ${
            isSelected(day)
              ? "calendar-selected"
              : ""
          }
        `}
        onClick={() =>
          selectDay(day)
        }
      >
        {day}
      </button>
    );
  }

  return (
    <div className="bugflow-calendar">

      <div className="calendar-header">

        <div className="calendar-title">

          <div className="calendar-icon">
            <CalendarDays size={21} />
          </div>

          <div>
            <h2>Calendar</h2>

            <p>
              Plan your work schedule
            </p>
          </div>

        </div>

        <button
          type="button"
          className="calendar-today-button"
          onClick={goToday}
        >
          Today
        </button>

      </div>

      <div className="calendar-month-header">

        <button
          type="button"
          className="calendar-nav-button"
          onClick={previousMonth}
        >
          <ChevronLeft size={19} />
        </button>

        <h3>
          {monthName} {year}
        </h3>

        <button
          type="button"
          className="calendar-nav-button"
          onClick={nextMonth}
        >
          <ChevronRight size={19} />
        </button>

      </div>

      <div className="calendar-weekdays">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      <div className="calendar-grid">
        {calendarDays}
      </div>

      {selectedDate && (
        <div className="calendar-selected-info">

          <span>
            Selected Date
          </span>

          <strong>
            {selectedDate.toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </strong>

        </div>
      )}

    </div>
  );
}

export default DashboardCalendar;