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

dropDownYear();
dropDownMonth();
