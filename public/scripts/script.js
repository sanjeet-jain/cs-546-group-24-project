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
        // document.getElementById("header").innerText = data.dateString;
        document.getElementById("calendar").innerHTML = data.calendarHTML;
        const monthDropDown = document.getElementById("monthDropDown");
        monthDropDown.selectedIndex = data.currentMonth;
        const yearDropDown = document.getElementById("yearDropDown");
        yearDropDown.selectedIndex = yearRange.findIndex(
          (x) => x === data.currYear
        );
        monthNav = 0;
        oldMonthNav = 0;
        yearNav = 0;
        oldYearNav = 0;
        // // Update modal data
        // const cellIds = data.cellIds;
        // for (let i = 0; i < cellIds.length; i++) {
        //   const cellId = cellIds[i];
        //   const modalTitle = `New Title ${i}`;
        //   const modalDescription = `New Description ${i}`;
        //   $(`#modal-${cellId} .modal-title`).text(modalTitle);
        //   $(`#modal-${cellId} .modal-body`).text(modalDescription);
        // }
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

    oldMonthNav = monthNav--;
    load();
  });
  document.getElementById("nextMonth").addEventListener("click", () => {
    const monthDropDown = document.getElementById("monthDropDown");
    currentSelectedMonth = monthDropDown.value;
    const yearDropDown = document.getElementById("yearDropDown");
    currentSelectedYear = yearDropDown.value;
    if (
      currentSelectedYear <= yearRange[yearRange.length - 1] &&
      currentSelectedYear >= yearRange[0]
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
    oldYearNav = yearNav--;
    load();
  });
  document.getElementById("nextYear").addEventListener("click", () => {
    const yearDropDown = document.getElementById("yearDropDown");
    currentSelectedYear = parseInt(yearDropDown.value);
    oldYearNav = yearNav++;
    load();
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

dropDownYear();
dropDownMonth();
navigationButtonsMonth();
navigationButtonsYear();
load();
