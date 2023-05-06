function drag_end_date_time_cell() {
  // let buttonList = document.querySelectorAll(".draggable-event-button");

  // buttonList.forEach((button) => {
  //   button.addEventListener("dragstart", function (event) {
  //     let dataset = JSON.stringify(event.target.dataset);
  //     event.dataTransfer.setData("application/json", dataset);
  //   });
  // });

  let cells = document.querySelectorAll(".date-time-cell");
  console.log(cells.length);
  cells.forEach((cell) => {
    cell.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
    cell.addEventListener("drop", function (event) {
      event.preventDefault();

      let td = event.target.closest("td");
      let dateTime = td.dataset.bsDay.concat(" ", td.dataset.bsTimeslot);
      dateTime = dayjs(dateTime).format("YYYY-MM-DDTHH:mm");
      let buttonData = JSON.parse(
        event.dataTransfer.getData("application/json")
      );
      console.log(
        "Button " + buttonData.bsEventid + " dropped into cell " + dateTime
      );
      let button = document.querySelector(
        `button[data-bs-eventid='${buttonData.bsEventid}']`
      );
      $.ajax({
        method: "PUT",
        url: `/${buttonData.bsEventType}/${buttonData.bsUserid}/${buttonData.bsEventid}/dateAddedto`,
        data: { dateAddedTo: dateTime },
        success: function (data) {
          button.click();

          button.parentNode.removeChild(button);
          //update month view counters
          let event_display = td.querySelector("div.d-grid.gap-1");
          event_display.appendChild(button);
        },
        error: function (data) {
          alert(
            "Some Error Occured when adding the event, please try in some time"
          );
        },
      });

      //for week view
      // let button = document.querySelector(
      //   `[data-bs-eventid='${buttonData.bsEventid}']`
      // );
      // let wrapper = event.target.querySelector(".day-events");
      // if (!wrapper) {
      //   wrapper = document.createElement("div");
      //   wrapper.classList.add("day-events");
      //   event.target.appendChild(wrapper);
      // }
      // button.parentNode.removeChild(button);
      // wrapper.appendChild(button);
    });
  });
}
drag_end_date_time_cell();
