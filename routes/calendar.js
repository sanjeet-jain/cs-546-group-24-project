import { Router } from "express";
const router = Router();
import constants from "./../constants/constants.js";
import eventDataFunctions from "../data/events.js";
import utils from "../utils/utils.js";

async function getWeeksData(req) {
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
  // get the userId

  const userId = req?.session?.user?.user_id.trim();
  utils.checkObjectIdString(userId);

  const modalsData = await getModalData(weeks, userId);
  // set global weeks data

  return {
    now,
    month,
    year,
    modalsData,
    prevMonth,
    prevYear,
    nextMonth,
    nextYear,
  };
}
router.route("/month").get(async (req, res) => {
  try {
    const {
      month,
      year,
      modalsData,
      prevMonth,
      prevYear,
      nextMonth,
      nextYear,
    } = await getWeeksData(req);

    // render the calendarv2 template with the calendar data and navigation links
    res.render("calendar/calendarv2", {
      title: "Calendar",
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
  } catch (error) {
    res
      .status(404)
      .render("errors/error", {
        title: "Error",
        error: new Error(error.message),
      });
  }
});

router.route("/week").get(async (req, res) => {
  const {
    now,
    month,
    year,
    modalsData,
    prevMonth,
    prevYear,
    nextMonth,
    nextYear,
  } = await getWeeksData(req);

  let week = modalsData.weeks.find((week) => {
    return week.find((day) => {
      return (
        now.getDate() === day.day &&
        now.getMonth() === day.month &&
        now.getFullYear() === day.year
      );
    });
  });
  res.render("calendar/calendarv2", {
    title: "Calendar",
    weekdays: constants.weekdays,
    week: week,
    currentMonth: month,
    currYear: year,
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

async function getModalData(weeks, userId) {
  try {
    const response = await eventDataFunctions.getAllEvents(userId);
    weeks.forEach((week) => {
      week.forEach((day) => {
        let modalData = {};
        delete response.userId;
        for (let eventType in response) {
          modalData[eventType] = response[eventType].filter((x) => {
            const date = new Date(x.dateAddedTo);
            const dayAddedTo = date.getDate();
            const monthAddedTo = date.getMonth();
            const yearAddedTo = date.getFullYear();
            return (
              dayAddedTo === day.day &&
              monthAddedTo === day.month &&
              yearAddedTo === day.year
            );
          });
        }
        let modalId = "" + day.month + "-" + day.day + "-" + day.year;
        day.modalId = modalId;

        // add modalData property to day object
        day.modalData = modalData;
      });
    });

    return {
      weeks: weeks,
    };
  } catch (error) {
    throw Error("Internal server error");
  }
}

export default router;
