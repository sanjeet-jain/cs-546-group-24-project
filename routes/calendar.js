import { Router } from "express";
const router = Router();
import constants from "./../constants/constants.js";
let dt = new Date();

router.route("/calendarv2").get((req, res) => {
  // get the current month and year
  const now = new Date();
  const month = req.query.month ? parseInt(req.query.month) : now.getMonth();
  const year = req.query.year ? parseInt(req.query.year) : now.getFullYear();
  // calculate the previous and next month and year
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = year - 1;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = year + 1;

  // generate the calendar data
  const weeks = getCalendar(month, year);

  // render the calendarv2 template with the calendar data and navigation links
  res.render("calendar/calendarv2", {
    currentMonth: month,
    yearRange: constants.yearRange,
    months: constants.months,
    weekdays: constants.weekdays,
    currYear: year,
    weeks: weeks,
    greyedOutDays: getGreyedOutDays(month, year),
    prevMonth: prevMonth,
    prevYear: prevYear,
    nextMonth: nextMonth,
    nextYear: nextYear,
  });
});

// Returns an array of weeks and days in the calendar for the specified month and year
function getCalendar(month, year) {
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
    calendar.push({ day: day, month: month - 1, year: year, greyedOut: true });
  }

  // Loop through the current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendar.push({ day: i, month: month, year: year });
  }

  // Loop through the next month days
  for (let i = 0; i < nextMonthDays; i++) {
    calendar.push({
      day: i + 1,
      month: month + 1,
      year: year,
      greyedOut: true,
    });
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

// Returns an array of booleans indicating which days of the previous month should be greyed out
function getGreyedOutDays(month, year) {
  const greyedOutDays = [];

  // Get the number of days in the previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Get the index of the first day of the month (0-6)
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Get the number of days to display from the previous month
  const prevMonthDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // Loop through the previous month days and mark them as greyed out
  for (let i = 0; i < prevMonthDays; i++) {
    greyedOutDays.push(true);
  }

  // Loop through the current month days and mark them as not greyed out
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    greyedOutDays.push(false);
  }

  // Get the number of days to display from the next month
  const lastDayIndex = new Date(year, month, daysInMonth).getDay();
  const nextMonthDays = lastDayIndex === 0 ? 0 : 7 - lastDayIndex;

  // Loop through the next month days and mark them as greyed out
  for (let i = 0; i < nextMonthDays; i++) {
    greyedOutDays.push(true);
  }

  return greyedOutDays;
}

export default router;
