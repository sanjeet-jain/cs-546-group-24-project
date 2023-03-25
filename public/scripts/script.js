let nav = 0;
const months = [
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
];

const calendar = document.getElementById("calendar");

function load() {
  const dt = new Date();
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
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

  const monthDropwDown = document.getElementById("monthDropwDown");
  months.forEach((monthName) => {
    let el = document.createElement("option");
    el.textContent = monthName;
    el.value = monthName;
    monthDropwDown.appendChild(el);
  });
  monthDropwDown.selectedIndex = firstDayOfMonth.getMonth();

  const paddingDays = firstDayOfMonth.getDay();

  let weekrow = document.createElement("tr");
  weekrow.classList.add("table-row", "table-bordered");

  calendar.innerHTML = "";
  for (let i = 1; i <= daysInMonth + paddingDays; i++) {
    const daySquare = document.createElement("td");
    daySquare.classList.add("table-cell", "table-bordered");
    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
    } else {
      daySquare.innerText =
        new Date(year, month, 0).getDate() - paddingDays + i;
      daySquare.classList.add("table-active");
    }
    weekrow.appendChild(daySquare);
    if (i % 7 === 0 || i === daysInMonth + paddingDays) {
      const weekrowlen = weekrow.cells.length;
      if (i === daysInMonth + paddingDays && weekrowlen !== 7) {
        for (let j = 0; j < 7 - weekrowlen; j++) {
          const temp = document.createElement("td");
          temp.classList.add("table-cell", "table-bordered", "table-active");
          temp.innerText = new Date(year, month, 1 + j).getDate();
          weekrow.appendChild(temp);
        }
      }
      calendar.appendChild(weekrow);
      if (i / 7 > 0) {
        weekrow = document.createElement("tr");
        weekrow.classList.add("table-row", "table-bordered");
      }
    }
  }
}

function navigationButtons() {
  document.getElementById("prevMonth").addEventListener("click", () => {
    nav--, load();
  });
  document.getElementById("nextMonth").addEventListener("click", () => {
    nav++, load();
  });
}

navigationButtons();
load();
