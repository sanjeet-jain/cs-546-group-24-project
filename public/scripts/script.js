let nav = 0;
let oldNav = nav;
let prevSelectedValue;
const calendar = document.getElementById("calendar");
const dt = new Date();

function load() {
  if (nav !== oldNav) {
    dt.setMonth(new Date().getMonth() + nav);
  }
  const monthDropDown = document.getElementById("monthDropDown");
  monthDropDown.selectedIndex = dt.getMonth();

  // const yearDropdown = document.getElementById("yearDropdown");
  // yearDropdown.selectedIndex = dt.getFullYear();

  if (nav !== oldNav) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const data = JSON.parse(this.response);
        document.getElementById("header").innerText = data.dateString;
        document.getElementById("calendar").innerHTML = data.calendarHTML;
      }
    };
    xhttp.open("GET", `/calendar/api/${nav}`, true);
    xhttp.send();
  }
}

function navigationButtons() {
  document.getElementById("prevMonth").addEventListener("click", () => {
    oldNav = nav--;
    load();
  });
  document.getElementById("nextMonth").addEventListener("click", () => {
    (oldNav = nav++), load();
  });
}

function dropDownMonth() {
  const monthDropDown = document.getElementById("monthDropDown");
  monthDropDown.selectedIndex = dt.getMonth();
  prevSelectedMonth = monthDropDown.value;
  monthDropDown.addEventListener("change", (event) => {
    const selectedMonth = event.target.value;
    nav = selectedMonth - prevSelectedMonth;

    console.log(`nav: ${nav}`);
    console.log(`oldNav: ${oldNav}`);
    load();
  });
}
dropDownMonth();
navigationButtons();
load();
