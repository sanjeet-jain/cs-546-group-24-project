// same array in public/scripts/scripts.js
let yeaRangeRef = new Date().getFullYear();

const constants = {
  weekdays: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  yearRange: [
    yeaRangeRef - 2,
    yeaRangeRef - 1,
    yeaRangeRef,
    yeaRangeRef + 1,
    yeaRangeRef + 2,
  ],
  eventTypes: {
    task: "task",
    meeting: "meeting",
    notes: "notes",
    reminder: "reminder",
  },
};

export default constants;
