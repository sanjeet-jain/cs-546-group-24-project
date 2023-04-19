// same array in public/scripts/scripts.js
let yeaRangeRef = new Date().getFullYear();

const constants = {
  pwRounds: 16,
  min_age: 13,
  max_age: 150,
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
  stringLimits: {
    title: 100,
    textBody: 200,
    tag: 20,
    password: 8,
    first_last_names: 20,
  },
};

export default constants;
