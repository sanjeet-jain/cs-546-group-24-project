import { Router } from "express";
const router = Router();
import constants from "./../constants/constants.js";

router.route("/").get((req, res) => {
  // get the current month and year
  const now = new Date();
  const month = req.query.month ? parseInt(req.query.month) : now.getMonth();
  const year = req.query.year ? parseInt(req.query.year) : now.getFullYear();

  // calculate the previous and next month and year
  let prevMonth = month === 0 ? 11 : month - 1;
  let prevYear = year - 1;
  let nextMonth = month === 11 ? 0 : month + 1;
  let nextYear = year + 1;
  if (year === 2021) {
    prevYear = 2021;
  }
  if (year === 2025) {
    nextYear = 2025;
  }
  // generate the calendar data
  const weeks = getCalendar(
    month,
    year,
    prevMonth,
    prevYear,
    nextMonth,
    nextYear
  );
  const modalsData = getModalData(weeks);

  // render the calendarv2 template with the calendar data and navigation links
  res.render("calendar/calendarv2", {
    currentMonth: month,
    yearRange: constants.yearRange,
    months: constants.months,
    weekdays: constants.weekdays,
    currYear: year,
    weeks: modalsData.weeks,
    modalsData: modalsData,
    prevMonth: prevMonth,
    prevYear: prevYear,
    nextMonth: nextMonth,
    nextYear: nextYear,
  });
});

// Returns an array of weeks and days in the calendar for the specified month and year
function getCalendar(month, year, prevMonth, prevYear, nextMonth, nextYear) {
  const calendar = [];

  // Get the number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get the index of the first day of the month (0-6)
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Get the index of the last day of the month (0-6)
  const lastDayIndex = new Date(year, month, daysInMonth).getDay();

  // Get the number of days in the previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Get the number of days to display from the previous month
  const prevMonthDays = firstDayIndex === 0 ? 0 : firstDayIndex;

  // Get the number of days to display from the next month
  const nextMonthDays = lastDayIndex === 0 ? 6 : 6 - lastDayIndex;

  // Loop through the previous month days
  for (let i = 0; i < prevMonthDays; i++) {
    const day = daysInPrevMonth - prevMonthDays + i + 1;
    if (month == 0) {
      calendar.push({
        day: day,
        month: prevMonth,
        year: prevYear,
        greyedOut: true,
      });
    } else {
      calendar.push({
        day: day,
        month: prevMonth,
        year: year,
        greyedOut: true,
      });
    }
  }

  // Loop through the current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendar.push({ day: i, month: month, year: year });
  }

  // Loop through the next month days
  for (let i = 0; i < nextMonthDays; i++) {
    if (month === 1) {
      calendar.push({
        day: i + 1,
        month: nextMonth,
        year: nextYear,
        greyedOut: true,
      });
    } else {
      calendar.push({
        day: i + 1,
        month: nextMonth,
        year: year,
        greyedOut: true,
      });
    }
  }

  // Group the days into weeks
  const weeks = [];
  let week = [];
  calendar.forEach((day, index) => {
    week.push(day);
    if ((index + 1) % 7 === 0) {
      weeks.push(week);
      week = [];
    }
  });

  return weeks;
}

function getModalData(weeks) {
  weeks.forEach((week) => {
    week.forEach((day) => {
      let modalId = "" + day.month + "-" + day.day + "-" + day.year;
      day.modalId = modalId;

      // add modalData property to day object
      day.modalData = {
        title: "Event Title for " + day.month + "/" + day.day + "/" + day.year,
        description:
          "Event Description for " + day.month + "/" + day.day + "/" + day.year,
      };
    });
  });

  return {
    weeks: weeks,
  };
}

export default router;
