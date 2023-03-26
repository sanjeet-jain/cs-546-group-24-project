import { Router } from "express";
const router = Router();
import constants from "./../constants/constants.js";
const dt = new Date();

router.route("/:monthNav?/:yearNav?").get((req, res) => {
  const monthNav = Number(req.params.monthNav) || 0;
  const yearNav = Number(req.params.yearNav) || 0;

  const { dateString, calendarHTML, dt } = getData(monthNav, yearNav);

  res.setHeader("Content-Type", "text/html");
  res.render("calendar/calendar", {
    partial: "calendar-script",
    dateString: dateString,
    weekdays: constants.weekdays,
    calendarHTML: calendarHTML, // Pass the calendar HTML string to the template
    months: constants.months,
    currentMonth: dt.getMonth(),
    yearRange: constants.yearRange,
    currYear: constants.yearRange.find((x) => x === dt.getFullYear()),
  });
});
router.get("/api/:monthNav?/:yearNav?", (req, res) => {
  const monthNav = Number(req.params.monthNav) || 0;
  const yearNav = Number(req.params.yearNav) || 0;

  const { dateString, calendarHTML, dt } = getData(monthNav, yearNav);

  // Send the JSON response
  res.setHeader("Content-Type", "application/json");
  res.json({
    dateString: dateString,
    calendarHTML: calendarHTML, // Pass the calendar HTML string to the template
    currentMonth: dt.getMonth(),
    yearRange: constants.yearRange,
    currYear: constants.yearRange.find((x) => x === dt.getFullYear()),
    dt: dt,
  });
});

function getData(monthNav = 0, yearNav = 0) {
  const dt = new Date();
  if (monthNav !== 0) {
    dt.setMonth(new Date().getMonth() + monthNav);
  }
  if (yearNav !== 0) {
    const newYear = new Date().getFullYear() + yearNav;
    if (newYear >= dt.getFullYear() - 2 && newYear <= dt.getFullYear() + 2) {
      dt.setFullYear(newYear);
    }
  }
  const day = dt.getDay();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Remove the client-side code that manipulates the DOM,
  // as it will not work in the server-side code

  const paddingDays = firstDayOfMonth.getDay();

  // Initialize the HTML string for the calendar table
  let calendarHTML = "";

  // Add the weekdays row to the HTML string
  // calendarHTML += '<tr id="weekdays">';
  // constants.weekdays.forEach((weekday) => {
  //   calendarHTML += `<th scope="col">${weekday}</th>`;
  // });
  // calendarHTML += "</tr>";

  // Add the calendar days to the HTML string
  let weekrowHTML = '<tr class="table-row table-bordered">';
  for (let i = 1; i <= daysInMonth + paddingDays; i++) {
    if (i > paddingDays) {
      weekrowHTML += `<td class="table-cell table-bordered">${
        i - paddingDays
      }</td>`;
    } else {
      weekrowHTML += `<td class="table-cell table-bordered table-active">${
        new Date(year, month, 0).getDate() - paddingDays + i
      }</td>`;
    }
    if (i % 7 === 0 || i === daysInMonth + paddingDays) {
      const weekrowlen = weekrowHTML.match(/<td/g).length; // Count the number of table cells in the row
      if (i === daysInMonth + paddingDays && weekrowlen !== 7) {
        for (let j = 0; j < 7 - weekrowlen; j++) {
          weekrowHTML += `<td class="table-cell table-bordered table-active">${new Date(
            year,
            month,
            1 + j
          ).getDate()}</td>`;
        }
      }
      weekrowHTML += "</tr>";
      calendarHTML += weekrowHTML;
      if (i / 7 > 0) {
        weekrowHTML = '<tr class="table-row table-bordered">';
      }
    }
  }

  return { dateString, calendarHTML, dt };
}
export default router;
