function dropDownMonth() {
  const monthDropDown = document.getElementById("monthDropDown");
  monthDropDown.addEventListener("change", (event) => {
    const selectedMonth = event.target.value;
    const form = document.getElementById("monthCalendarForm");
    const yearDropDown = document.getElementById("yearDropDown");

    const selectedYear = yearDropDown.value;
    const monthInput = form.querySelector('input[name="month"]');
    const yearInput = form.querySelector('input[name="year"]');

    monthInput.value = selectedMonth;
    yearInput.value = selectedYear;

    form.submit();
  });
}

function dropDownYear() {
  const yearDropDown = document.getElementById("yearDropDown");
  yearDropDown.addEventListener("change", (event) => {
    const selectedyear = event.target.value;
    const form = document.getElementById("yearCalendarForm");
    const monthDropDown = document.getElementById("monthDropDown");

    const selectedMonth = monthDropDown.value;
    const monthInput = form.querySelector('input[name="month"]');
    const yearInput = form.querySelector('input[name="year"]');

    monthInput.value = selectedMonth;
    yearInput.value = selectedyear;

    form.submit();
  });
}

function viewRadioButtons() {
  const form = document.getElementById("viewRadioForm");
  const radioButtons = form.elements["viewBtnRadio"];
  form.method = "get";

  // Change the form action and method
  for (let i = 0; i < radioButtons.length; i++) {
    radioButtons[i].addEventListener("change", () => {
      const selectedValue = radioButtons[i].value;
      if (selectedValue === "month") {
        form.action = "/calendar/month";
      } else if (selectedValue === "week") {
        form.action = "/calendar/week";
      } else if (selectedValue === "day") {
        form.action = "/calendar/day";
      }
      form.submit();
    });
  }
}

viewRadioButtons();
dropDownYear();

dropDownMonth();
