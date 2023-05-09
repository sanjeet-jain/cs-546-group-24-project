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
    } = await getWeeksData(req, req?.query?.selectedDateCell);
    const userId = req?.session?.user?.user_id.trim();
    utils.checkObjectIdString(userId);
    let today = dayjs().format("MMMM DD YYYY");
    let todayItems = await getSelectedDayItems(userId, today);

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
      filter: req.session.user.filter,
      todayItems: todayItems,
      today: today,
      rightPaneItems: await getRightPaneItems(userId),
    });
  } catch (error) {
    res.status(404).render("errors/error", {
      title: "Error",
      error: new Error(error.message),
    });
  }
});

router.route("/week").get(async (req, res) => {
  let requestedWeek = dayjs(
    req?.query?.week || req?.query?.selectedDateCell
  ).toDate();
  if (requestedWeek === "Invalid Date") {
    requestedWeek = undefined;
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
  } = await getWeeksData(req, requestedWeek);

  let week = modalsData.weeks.find((week) => {
    return week.find((day) => {
      return (
        now.getDate() === day.day &&
        now.getMonth() === day.month &&
        now.getFullYear() === day.year
      );
    });
  });
  let prevWeekStart = dayjs(now).subtract(1, "week").format("YYYY-MM-DD");
  let nextWeekStart = dayjs(now).add(1, "week").format("YYYY-MM-DD");

  let displayString =
    dayjs(requestedWeek).startOf("week").format("MMMM DD YYYY") +
    " - " +
    dayjs(requestedWeek).endOf("week").format("MMMM DD YYYY");

  const userId = req?.session?.user?.user_id.trim();
  utils.checkObjectIdString(userId);
  let today = dayjs().format("YYYY-MM-DD");
  let todayItems = await getSelectedDayItems(
    userId,
    today,
    req.session.user.filter
  );
  res.render("calendar/calendarv2", {
    title: "Calendar",
    weekdays: constants.weekdays,
    week: week,
    currentMonth: month,
    currYear: year,
    timeslots: constants.timeslots,
    filter: req.session.user.filter,
    todayItems: todayItems,
    today: today,
    rightPaneItems: await getRightPaneItems(userId),
    prevWeekStart,
    nextWeekStart,
    displayString,
  });
});

router.route("/day/:selectedDate?").get(async (req, res) => {
  let currentDate;
  let selectedDate =
    req.params?.selectedDate?.trim() ||
    req?.query?.date?.trim() ||
    req?.query?.selectedDateCell?.trim();
  try {
    selectedDate = dayjs(selectedDate).format("YYYY-MM-DD");
    utils.validateDate(selectedDate, "Date of Birth");
    currentDate = dayjs(selectedDate.trim()).toDate();
  } catch (e) {
    selectedDate = dayjs().format("YYYY-MM-DD");
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
  const userId = req?.session?.user?.user_id.trim();
  utils.checkObjectIdString(userId);
  let displayItems = await getSelectedDayItems(
    userId,
    selectedDate,
    req.session.user.filter
  );
  selectedDate = dayjs(selectedDate).format("MMMM DD YYYY");

  utils.checkObjectIdString(userId);
  let today = dayjs().format("YYYY-MM-DD");
  let todayItems = await getSelectedDayItems(
    userId,
    today,
    req.session.user.filter
  );

  let prevDate = dayjs(now).subtract(1, "day").format("YYYY-MM-DD");
  let nextDate = dayjs(now).add(1, "day").format("YYYY-MM-DD");

  res.render("calendar/calendarv2", {
    title: "Calendar",
    day: day,
    weekdays: [constants.weekdays[week.indexOf(day)]],
    timeslots: constants.timeslots,
    filter: req.session.user.filter,
    displayItems: displayItems,
    selectedDate: selectedDate,
    todayItems: todayItems,
    today: today,
    rightPaneItems: await getRightPaneItems(userId),
    prevDate,
    nextDate,
  });
});

router.route("/filter").post((req, res) => {
  //set filter data and call subsequent view
  let incomingFilter = req.body.filter;
  if (incomingFilter === undefined) {
    incomingFilter = {};
    incomingFilter.eventTypeSelected = [];
    incomingFilter.tagsSelected = [];
  }
  if (incomingFilter.eventTypeSelected === undefined) {
    incomingFilter.eventTypeSelected = [];
  }
  if (incomingFilter.tagsSelected === undefined) {
    incomingFilter.tagsSelected = [];
  }

  let eventTypeSelected = incomingFilter.eventTypeSelected;
  let tagsSelected = incomingFilter.tagsSelected;
  try {
    utils.isStrArrValid(eventTypeSelected);
    eventTypeSelected.forEach((selected) => {
      if (!req.session.user.filter.eventTypes.includes(selected.trim())) {
        throw new Error();
      }
    });
    req.session.user.filter.eventTypeSelected = eventTypeSelected;
  } catch (e) {
    return res.status(400).json({ error: "eventType selected in not valid" });
  }

  try {
    utils.isStrArrValid(tagsSelected);
    tagsSelected.forEach((selected) => {
      if (!req.session.user.filter.tags.includes(selected.trim())) {
        throw new Error();
      }
    });
    req.session.user.filter.tagsSelected = tagsSelected;
  } catch (e) {
    return res.status(400).json({ error: "eventType selected in not valid" });
  }
  return res.status(200).json({ success: true });
});

router.route("/getSelectedDayItems/:selectedDate?").get(async (req, res) => {
  let selectedDate = req.params?.selectedDate;
  try {
    selectedDate = dayjs(selectedDate).format("YYYY-MM-DD");
    utils.validateDate(selectedDate, "Date of Birth");
    selectedDate = dayjs(selectedDate.trim()).toDate();
  } catch (e) {
    selectedDate = dayjs().toDate();
  }
  utils.checkIfDateIsBeyondRange(dayjs(selectedDate).format("YYYY-MM-DD"));
  const userId = req?.session?.user?.user_id.trim();
  utils.checkObjectIdString(userId);
  const selectedDayItems = await getSelectedDayItems(
    userId,
    selectedDate,
    req.session.user.filter
  );
  res.status(200).json({ selectedDayItems, userId });
});
async function getWeeksData(req, currentDate = undefined) {
  // get the current month and year
  if (currentDate === "null") {
    currentDate = undefined;
  }
  let now;
  if (currentDate) {
    now = dayjs(currentDate).toDate();
  } else {
    now = dayjs();
    const { month = now.month(), year = now.year() } = req.query;
    now = now.set("month", month).set("year", year).toDate();
  }
  const month = now.getMonth();
  const year = now.getFullYear();
  utils.checkIfDateIsBeyondRange(dayjs(now).format("YYYY-MM-DD"));
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

  const modalsData = await getModalData(
    weeks,
    userId,
    now,
    req.session.user.filter
  );
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

async function getModalData(weeks, userId, now, filter) {
  try {
    const response = await eventDataFunctions.getAllEvents(userId, filter);
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

async function getSelectedDayItems(userId, selectedDate, filter) {
  const now = dayjs(selectedDate).toDate();
  const response = await eventDataFunctions.getAllEvents(userId, filter);

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
  }
  return selectedDateItems.sort((a, b) => {
    if (a.priority > b.priority) {
      return -1;
    }
    if (a.priority < b.priority) {
      return 1;
    }
    return 0;
  });
}

async function getRightPaneItems(userId) {
  const response = await eventDataFunctions.getAllEvents(userId);
  delete response.userId;
  let rightPaneItems = {};
  for (let eventType in response) {
    rightPaneItems[eventType] = response[eventType]
      .filter((x) => {
        return x.dateAddedTo === null;
      })
      .sort((a, b) => {
        if (a.priority > b.priority) {
          return -1;
        }
        if (a.priority < b.priority) {
          return 1;
        }
        return 0;
      })
      .slice(0, 50);
  }

  rightPaneItems.backlogtasks =
    response?.tasks
      ?.filter((x) => {
        return !x.checked && x.expired && x.dateAddedTo !== null;
      })
      .slice(0, 50) || [];
  rightPaneItems.upcoming =
    response?.tasks?.filter((x) => {
      return !x.checked && !x.expired && x.dateAddedTo !== null;
    }) || [];
  rightPaneItems.upcoming = rightPaneItems.upcoming.concat(
    response?.meetings?.filter((x) => {
      return !x.expired && x.dateAddedTo !== null;
    }) || []
  );
  rightPaneItems.upcoming = rightPaneItems.upcoming.concat(
    response?.reminders?.filter((x) => {
      return !x.expired && x.dateAddedTo !== null;
    }) || []
  );
  rightPaneItems.upcoming = rightPaneItems.upcoming.concat(
    response?.notes?.filter((x) => {
      return !x.expired && x.dateAddedTo !== null;
    }) || []
  );
  rightPaneItems.upcoming
    .sort((a, b) => {
      const dateA = dayjs(a.dateAddedTo);
      const dateB = dayjs(b.dateAddedTo);
      const dateDiff = dateA.diff(dateB);
      if (dateDiff > 0) {
        return -1;
      }
      if (dateDiff < 0) {
        return 1;
      }
      if (a.priority > b.priority) {
        return -1;
      }
      if (a.priority < b.priority) {
        return 1;
      }
      return 0;
    })
    .slice(0, 50);
  rightPaneItems.totalTasksAssigned =
    response?.tasks?.filter((x) => {
      return x.dateAddedTo !== null;
    })?.length || 0;
  rightPaneItems.taskCompletionProgress = 0;
  if (rightPaneItems.totalTasksAssigned !== 0) {
    rightPaneItems.taskCompletionProgress = Number.parseFloat(
      (
        ((rightPaneItems.totalTasksAssigned -
          rightPaneItems.backlogtasks.length) *
          100) /
        rightPaneItems.totalTasksAssigned
      ).toFixed(0)
    );
  }

  let totalMeetingsPending =
    response?.meetings?.filter((x) => {
      return x.dateAddedTo !== null;
    })?.length || 0;
  rightPaneItems.pendingMeetingsCount =
    response?.meetings?.filter((x) => {
      return !x.expired && x.dateAddedTo !== null;
    })?.length || 0;
  rightPaneItems.meetingCompletionProgress = 0;
  if (totalMeetingsPending !== 0) {
    rightPaneItems.meetingCompletionProgress = Number.parseFloat(
      (
        ((totalMeetingsPending - rightPaneItems.pendingMeetingsCount) * 100) /
        totalMeetingsPending
      ).toFixed(0)
    );
  }

  let totalTasksComplete =
    response?.tasks?.filter((x) => {
      return x.checked && x.dateAddedTo !== null;
    })?.length || 0;
  rightPaneItems.totalTasksOnTime =
    response?.tasks?.filter((x) => {
      return x.checked && x.dateAddedTo !== null && x.onTime;
    })?.length || 0;

  rightPaneItems.onTimECompletionRate = 0;
  if (totalTasksComplete !== 0) {
    rightPaneItems.onTimECompletionRate = Number.parseFloat(
      (rightPaneItems.totalTasksOnTime * 100) / totalTasksComplete
    ).toFixed(0);
  }

  return rightPaneItems;
}
export default router;
