let monthNav = 0;
let oldMonthNav = monthNav;
let yearNav = 0;
let oldYearNav = yearNav;
let prevSelectedMonth;
let prevSelectedYear;
let currentSelectedMonth;
let currentSelectedYear;
const calendar = document.getElementById("calendar");
const dt = new Date();
let yeaRangeRef = new Date().getFullYear();
const yearRange = [
  yeaRangeRef - 2,
  yeaRangeRef - 1,
  yeaRangeRef,
  yeaRangeRef + 1,
  yeaRangeRef + 2,
];
function load() {
  if (monthNav !== oldMonthNav || yearNav !== oldYearNav) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const data = JSON.parse(this.response);
        document.getElementById("header").innerText = data.dateString;
        document.getElementById("calendar").innerHTML = data.calendarHTML;
        const monthDropDown = document.getElementById("monthDropDown");
        monthDropDown.selectedIndex = data.currentMonth;
        const yearDropDown = document.getElementById("yearDropDown");
        yearDropDown.selectedIndex = yearRange.findIndex(
          (x) => x === data.currYear
        );
      }
    };
    xhttp.open("GET", `/calendar/api/${monthNav}/${yearNav}`, true);
    xhttp.send();
  }
}

function navigationButtonsMonth() {
  document.getElementById("prevMonth").addEventListener("click", () => {
    const monthDropDown = document.getElementById("monthDropDown");
    currentSelectedMonth = monthDropDown.value;
    const yearDropDown = document.getElementById("yearDropDown");
    currentSelectedYear = yearDropDown.value;
    if (
      currentSelectedYear > 2021 ||
      (currentSelectedYear == 2021 && currentSelectedMonth > 0)
    ) {
      oldMonthNav = monthNav--;
      load();
    }
  });
  document.getElementById("nextMonth").addEventListener("click", () => {
    const monthDropDown = document.getElementById("monthDropDown");
    currentSelectedMonth = monthDropDown.value;
    const yearDropDown = document.getElementById("yearDropDown");
    currentSelectedYear = yearDropDown.value;
    if (
      currentSelectedYear < 2025 ||
      (currentSelectedYear == 2025 && currentSelectedMonth < 11)
    ) {
      oldMonthNav = monthNav++;
      load();
    }
  });
}

function navigationButtonsYear() {
  document.getElementById("prevYear").addEventListener("click", () => {
    const yearDropDown = document.getElementById("yearDropDown");
    currentSelectedYear = parseInt(yearDropDown.value);
    if (currentSelectedYear > 2021) {
      oldYearNav = yearNav--;
      load();
    }
  });
  document.getElementById("nextYear").addEventListener("click", () => {
    const yearDropDown = document.getElementById("yearDropDown");
    currentSelectedYear = parseInt(yearDropDown.value);
    if (currentSelectedYear < 2025) {
      oldYearNav = yearNav++;
      load();
    }
  });
}

function dropDownMonth() {
  const monthDropDown = document.getElementById("monthDropDown");
  monthDropDown.selectedIndex = dt.getMonth();
  prevSelectedMonth = monthDropDown.value;
  currentSelectedMonth = monthDropDown.value;
  monthDropDown.addEventListener("change", (event) => {
    currentSelectedMonth = event.target.value;
    monthNav = currentSelectedMonth - prevSelectedMonth;
    load();
  });
}

function dropDownYear() {
  const yearDropDown = document.getElementById("yearDropDown");
  yearDropDown.selectedIndex = yearRange.indexOf(dt.getFullYear());
  prevSelectedYear = yearDropDown.value;
  currentSelectedYear = yearDropDown.value;
  yearDropDown.addEventListener("change", (event) => {
    currentSelectedYear = event.target.value;
    yearNav = currentSelectedYear - prevSelectedYear;
    load();
  });
}

$(document).on("click", ".active", function () {
  const [month, date, year] = this.id.split("-");
  const modalContent = `<h2>${month} ${date}, ${year}</h2><p>Modal content goes here.</p>`;
  $("#modal .modal-content").html(modalContent);
  $("#modal").show();
});

$(document).on("click", ".close", function () {
  $("#modal").hide();
});

$(document).on("click", function (event) {
  if (event.target == $("#modal")[0]) {
    $("#modal").hide();
  }
});

dropDownYear();
dropDownMonth();
navigationButtonsMonth();
navigationButtonsYear();
load();
