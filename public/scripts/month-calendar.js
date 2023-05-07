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
// https://stackoverflow.com/questions/15839649/pass-object-through-datatransfer
// https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData
function drag_end_date_cell() {
  // let buttonList = document.querySelectorAll(".draggable-event-button");

  // buttonList.forEach((button) => {
  //   button.addEventListener("dragstart", function (event) {
  //     let dataset = JSON.stringify(event.target.dataset);
  //     event.dataTransfer.setData("application/json", dataset);
  //   });
  // });

  let cells = document.querySelectorAll(".date-cell");

  cells.forEach((cell) => {
    cell.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
    cell.addEventListener("drop", function (event) {
      event.preventDefault();

      let td = event.target.closest("td");
      let cellId = td.dataset.bsDay;
      let buttonData = JSON.parse(
        event.dataTransfer.getData("application/json")
      );
      console.log(
        "Button " + buttonData.bsEventid + " dropped into cell " + cellId
      );
      // let buttonList = document.querySelectorAll(
      //   `button[data-bs-eventid='${buttonData.bsEventid}']`
      // );
      // let button = document
      //   .getElementById("right-menu-div")
      //   .querySelector(`button[data-bs-eventid='${buttonData.bsEventid}']`);
      $.ajax({
        method: "PUT",
        url: `/${buttonData.bsEventType}/${buttonData.bsUserid}/${buttonData.bsEventid}/dateAddedto`,
        data: { dateAddedTo: cellId },
        success: function (data) {
          // button.click();
          setPageUrlForSelectedDateCell(td.dataset.bsDay);
          // const previousDate = data.previousDate;
          // buttonList.forEach((button) => {
          //   if (buttonData.bsEventType === "task") {
          //     button.parentNode.parentNode.removeChild(button.parentNode);
          //   } else {
          //     button.parentNode.removeChild(button);
          //   }
          // });
          // let parentTd = document.querySelector(
          //   `td[data-bs-day="${dayjs(previousDate).format("YYYY-M-D")}"]`
          // );
          // let oldEventCounter = parentTd?.querySelector(
          //   `span.${buttonData.bsEventType}-counter`
          // );

          // let badgeCounter = "";
          // if (!previousDate) {
          //   badgeCounter = `.unassigned-${buttonData.bsEventType}s-counter`;
          // } else {
          //   if (dayjs(previousDate).diff(dayjs()) > 0) {
          //     badgeCounter = `.upcoming-items-counter`;
          //   } else {
          //     badgeCounter = `.backlog-${buttonData.bsEventType}s-counter`;
          //   }
          // }
          // badgeCounter = document.querySelector(badgeCounter);
          // //update month view counters
          // let event_counter = td.querySelector("div.event-counters");
          // let eventTypeCounter = event_counter.querySelector(
          //   `.${buttonData.bsEventType}-counter`
          // );
          // if (!eventTypeCounter) {
          //   let span = document.createElement("span");
          //   let logoClass = "";
          //   let buttonClass = "";
          //   if (buttonData.bsEventType === "meeting") {
          //     logoClass = "bi-calendar-event";
          //     buttonClass = "swatch-cyan";
          //   } else if (buttonData.bsEventType === "reminder") {
          //     logoClass = "bi-alarm";
          //     buttonClass = "swatch-indigo";
          //   } else if (buttonData.bsEventType === "task") {
          //     logoClass = "bi-check2-square";
          //     buttonClass = "bg-danger";
          //   } else if (buttonData.bsEventType === "notes") {
          //     logoClass = "bi-file-text";
          //     buttonClass = "bg-success";
          //   }

          //   span.classList.add("badge", buttonClass, "text-wrap", "text-start");

          //   let logo = document.createElement("i");
          //   logo.classList.add(logoClass);
          //   logo.innerText = " ";
          //   let eventType = document.createTextNode(
          //     ` ${buttonData.bsEventType}`
          //   );

          //   span.appendChild(logo);
          //   eventTypeCounter = document.createElement("span");

          //   span.appendChild(eventTypeCounter);
          //   span.appendChild(eventType);
          //   event_counter.appendChild(span);
          // }
          // if (oldEventCounter) {
          //   let oldCounter = Number.parseInt(
          //     oldEventCounter.innerText.trim() || 0
          //   );
          //   if (oldCounter - 1 === 0) {
          //     oldEventCounter.parentNode.parentNode.removeChild(
          //       oldEventCounter.parentNode
          //     );
          //   } else {
          //     oldEventCounter.innerText = oldCounter - 1;
          //   }
          // }
          // eventTypeCounter.innerText =
          //   Number.parseInt(eventTypeCounter.innerText.trim() || 0) + 1;
          // badgeCounter.innerText = Number.parseInt(badgeCounter.innerText) - 1;
        },
        error: function (data) {
          alert(
            "Some Error Occured when adding the event, please try in some time"
          );
        },
      });
    });
  });
}

drag_end_date_cell();
dropDownYear();
dropDownMonth();
