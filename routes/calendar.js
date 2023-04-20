import { Router } from "express";
const router = Router();
import constants from "./../constants/constants.js";
import eventDataFunctions from "../data/events.js";
import utils from "../utils/utils.js";
import dayjs from "dayjs";
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
    res.status(404).render("errors/error", {
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
    // prevMonth,
    // prevYear,
    // nextMonth,
    // nextYear,
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
    timeslots: constants.timeslots,
  });
});

router.route("/day/:currentDate?").get(async (req, res) => {
  let currentDate = req.params?.currentDate;
  try {
    utils.validateDate(currentDate);
    currentDate = dayjs(currentDate.trim()).toDate();
  } catch (e) {
    currentDate = dayjs().toDate();
  }

  const {
    now,
    month,
    year,
    modalsData,
    // prevMonth,
    // prevYear,
    // nextMonth,
    // nextYear,
  } = await getWeeksData(req, currentDate);

  let week = modalsData.weeks.find((week) => {
    return week.find((day) => {
      return (
        now.getDate() === day.day &&
        now.getMonth() === day.month &&
        now.getFullYear() === day.year
      );
    });
  });
  let day = week.find((days) => {
    return (
      days.day === currentDate.getDate() &&
      days.month === currentDate.getMonth() &&
      days.year === currentDate.getFullYear()
    );
  });

  res.render("calendar/calendarv2", {
    title: "Calendar",
    day: day,
    weekdays: [constants.weekdays[week.indexOf(day)]],
    timeslots: constants.timeslots,
  });
});

router.route("/getSelectedDayItems/:selectedDate?").get(async (req, res) => {
  let selectedDate = req.params?.selectedDate;
  try {
    utils.validateDate(selectedDate);
    selectedDate = dayjs(selectedDate.trim()).toDate();
  } catch (e) {
    selectedDate = dayjs().toDate();
  }
  const userId = req?.session?.user?.user_id.trim();
  utils.checkObjectIdString(userId);
  const selectedDayItems = await getSelectedDayItems(userId, selectedDate);
  res.status(200).json({ selectedDayItems, userId });
});
async function getWeeksData(req, currentDate = undefined) {
  // get the current month and year
  const now = currentDate || dayjs().toDate();
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

  const modalsData = await getModalData(weeks, userId, now);
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
// Returns an array of weeks and days in the calendar for the specified month and year
function getCalendar(month, year, prevMonth, prevYear, nextMonth, nextYear) {
  let calendar = [];

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
    if (month === 11) {
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
  let weeks = [];
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

async function getModalData(weeks, userId, now) {
  try {
    const response = await eventDataFunctions.getAllEvents(userId);
    weeks.forEach((week) => {
      week.forEach((day) => {
        let modalData = {};
        delete response.userId;
        for (let eventType in response) {
          modalData[eventType] = response[eventType].filter((x) => {
            const date = dayjs(x.dateAddedTo).toDate();
            const dayAddedTo = date.getDate();
            const monthAddedTo = date.getMonth();
            const yearAddedTo = date.getFullYear();
            return (
              dayAddedTo === day.day &&
              monthAddedTo === day.month &&
              yearAddedTo === day.year
            );
          });
          modalData[eventType].forEach((eventData) => {
            eventData.timeslotStart = getTimeSlot(eventData.dateAddedTo);
            eventData.timeslotEnd = getTimeSlot(eventData.dateDueOn);
          });
        }
        let dayjsDateId = day.year + "-" + (day.month + 1) + "-" + day.day;
        day.dayjsDateId = dayjsDateId;

        // add modalData property to day object
        day.modalData = modalData;
      });
    });

    //filter based on top 50 items of month
    // let top50Data = [];
    // for (let eventType in response) {
    //   const temp = response[eventType].filter((x) => {
    //     // get unassigned items
    //     return dayjs(x.dateAddedTo).format() === "Invalid Date";
    //   });
    //   top50Data = top50Data.concat(temp);
    // }
    return {
      weeks: weeks,
    };
  } catch (error) {
    throw Error("Internal server error");
  }
}

function getTimeSlot(dateString) {
  // Create a new Date object from the date string
  const date = new Date(dateString);

  // Extract the hours and minutes from the Date object
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Format the hours and minutes as a string in the format "H:MM AM/PM"
  let time = "";
  if (minutes < 30) {
    minutes = "00";
  } else {
    minutes = "30";
  }
  if (hours === 0) {
    time = "12:" + minutes + " AM";
  } else if (hours < 12) {
    time = hours + ":" + minutes + " AM";
  } else if (hours === 12) {
    time = "12:" + minutes + " PM";
  } else {
    time = hours - 12 + ":" + minutes + " PM";
  }

  // Find the index of the time slot in the timeslots array
  const index = constants.timeslots.indexOf(time);
  return time;
}

async function getSelectedDayItems(userId, selectedDate) {
  const now = dayjs(selectedDate).toDate();
  const response = await eventDataFunctions.getAllEvents(userId);
  delete response.userId;
  let selectedDateItems = [];
  for (let eventType in response) {
    const temp = response[eventType].filter((x) => {
      const date = dayjs(x.dateAddedTo).toDate();
      const dayAddedTo = date.getDate();
      const monthAddedTo = date.getMonth();
      const yearAddedTo = date.getFullYear();
      return (
        dayAddedTo === now.getDate() &&
        monthAddedTo === now.getMonth() &&
        yearAddedTo === now.getFullYear()
      );
    });
    selectedDateItems = selectedDateItems.concat(temp);
    return selectedDateItems;
  }
}
export default router;
