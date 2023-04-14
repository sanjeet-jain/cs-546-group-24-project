let dataGlobal;
let userIdGlobal;
function populateMeetingsModal(userId, meetingId) {
  $.ajax({ method: "GET", url: `/meeting/${userId}/${meetingId}` }).then(
    function (data) {
      dataGlobal = data;
      userIdGlobal = userId;

      let event_modal = document.getElementById("modal-meeting-display");

      event_modal.querySelector("#modal-meeting-label.modal-title").innerText =
        data.title;
      event_modal.querySelector("input#meeting_title").value = data.title;
      event_modal.querySelector("input#meeting_textBody").value = data.textBody;
      event_modal.querySelector("input#meeting_tag").value = data.tag;
      event_modal.querySelector("select#meeting_priority").value =
        data.priority;
      // issue with date time coming as a date string
      // it needs an iso string
      event_modal.querySelector("input#meeting_dateAddedTo").value =
        data.dateAddedTo;

      event_modal.querySelector("input#meeting_dateDueOn").value =
        data.dateDueOn;
      event_modal.querySelector("input#meeting_repeating").value =
        data.repeating;
      event_modal.querySelector("input#meeting_repeating").checked =
        data.repeating;

      event_modal.querySelector("select#meeting_repeatingIncrementBy").value =
        data.repeatingIncrementBy;
      event_modal.querySelector(
        "input#meeting_repeatingCounterIncrement"
      ).value = data.repeatingCounterIncrement;
      // if (!event_modal.querySelector("input#meeting_repeating").value) {
      //   event_modal.querySelector(
      //     "select#meeting_repeatingIncrementBy"
      //   ).disabled = true;
      //   event_modal.querySelector(
      //     "input#meeting_repeatingCounterIncrement"
      //   ).disabled = true;
      //   event_modal.querySelector("select#meeting_repeatingIncrementBy").value = "";
      //   event_modal.querySelector("input#meeting_repeatingCounterIncrement").value = "";
      // }
    }
  );
}
function repeatingCheckBoxTogglerMeeting() {
  let event_modal = document.getElementById("modal-meeting-display");
  let repeating = event_modal.querySelector("input#meeting_repeating");
  let repeatingIncrementBy = event_modal.querySelector(
    "select#meeting_repeatingIncrementBy"
  );
  let repeatingCounterIncrement = event_modal.querySelector(
    "input#meeting_repeatingCounterIncrement"
  );
  repeating.addEventListener("change", (event) => {
    if (event.target.checked) {
      event.target.value = true;
      repeatingIncrementBy.disabled = false;
      repeatingCounterIncrement.disabled = false;
      repeatingIncrementBy.setAttribute("required", "");
      repeatingIncrementBy.value = "day";
      repeatingCounterIncrement.setAttribute("required", "");
      repeatingCounterIncrement.value = 0;
    } else {
      repeatingIncrementBy.disabled = true;
      repeatingCounterIncrement.disabled = true;
      repeatingIncrementBy.removeAttribute("required");
      repeatingCounterIncrement.removeAttribute("required");
      event_modal.querySelector("select#meeting_repeatingIncrementBy").value =
        "";
      event_modal.querySelector(
        "input#meeting_repeatingCounterIncrement"
      ).value = "";
    }
  });
}

function enableMeetingFormEdit() {
  let calender_div = document.getElementById("calendar-div");
  editButtons = calender_div.querySelectorAll("button.btn-edit");
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      let event_modal = document.getElementById("modal-meeting-display");
      let fieldset = event_modal.querySelector("#meeting-form-enabler");
      fieldset.disabled = fieldset.disabled ? false : true;
      let repeating = event_modal.querySelector("input#meeting_repeating");
      let repeatingIncrementBy = event_modal.querySelector(
        "select#meeting_repeatingIncrementBy"
      );
      let repeatingCounterIncrement = event_modal.querySelector(
        "input#meeting_repeatingCounterIncrement"
      );
      if (!repeating.checked) {
        repeating.value = false;
        repeatingIncrementBy.disabled = true;
        repeatingCounterIncrement.disabled = true;
      }
    });
  });
}

function onMeetingModalClose() {
  dataGlobal = undefined;
  userIdGlobal = undefined;
  let event_modal = document.getElementById("modal-meeting-display");
  modalCloseButtons = event_modal.querySelectorAll('[data-bs-dismiss="modal"]');
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      let fieldset = event_modal.querySelector("#meeting-form-enabler");
      fieldset.disabled = true;
      event_modal.querySelector("#modal-meeting-label.modal-title").innerText =
        "";
      event_modal.querySelector("input#meeting_title").value = "";
      event_modal.querySelector("input#meeting_textBody").value = "";
      event_modal.querySelector("input#meeting_tag").value = "";
      event_modal.querySelector("select#meeting_priority").value = "";
      event_modal.querySelector("input#meeting_dateAddedTo").value = "";
      event_modal.querySelector("input#meeting_dateDueOn").value = "";
      event_modal.querySelector("input#meeting_repeating").value = "";
      event_modal.querySelector("input#meeting_repeating").checked = false;
      event_modal.querySelector("select#meeting_repeatingIncrementBy").value =
        "";
      event_modal.querySelector(
        "input#meeting_repeatingCounterIncrement"
      ).value = "";
      resultDiv = document.getElementById("update-result");
      resultDiv.classList = "";
      resultDiv.innerText = "";
    });
  });
}

function submitMeetingForm() {
  meetingform = document.getElementById("meeting-form");
  meetingform.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    let formData = new FormData(event.target);
    let jsonData = {};
    for (var [key, value] of formData.entries()) {
      jsonData[key] = value;
    }
    //todo validations
    checkMeetingValidations(event.target);
    $.ajax({
      method: "PUT",
      url: `/meeting/${userIdGlobal}/${dataGlobal._id}`,
      data: jsonData,
      success: function (data) {
        resultDiv = document.getElementById("update-result");
        resultDiv.innerText =
          "Meeting updated Successfully! Please refresh the page!";
        resultDiv.classList = "";
        resultDiv.classList.add("alert", "alert-success");
        // if status code 200 update modal
        populateMeetingsModal(data.userId, data.meetingId);
      },
      error: function (data) {
        resultDiv = document.getElementById("update-result");
        resultDiv.classList = "";
        resultDiv.innerText =
          data?.responseJSON?.error || "Update wasnt Successful";
        resultDiv.classList.add("alert", "alert-danger");
      },
    });
  });
}

//bind all event pills to respective modal generators
function bindEventButtontoModal() {
  let calender_div = document.getElementById("calendar-div");
  event_pills = calender_div.querySelectorAll("button.event-pill");
  event_pills.forEach((eventpill) => {
    eventpill.addEventListener("click", (event) => {
      eventId = event.target.attributes["data-bs-eventId"].value;
      userId = event.target.attributes["data-bs-userId"].value;
      typeOfEventPill = event.target.attributes["data-bs-event-type"].value;
      switch (typeOfEventPill) {
        case "meeting":
          populateMeetingsModal(userId, eventId);
          break;
        case "reminder":
          break;
        default:
          break;
      }
    });
  });
}

function checkMeetingValidations(jsonData) {
  //get all error divs
  meeting_title_error = document.getElementById("meeting_title_error");
  meeting_textBody_error = document.getElementById("meeting_textBody_error");
  meeting_tag_error = document.getElementById("meeting_tag_error");
  meeting_dateAddedTo_error = document.getElementById(
    "meeting_dateAddedTo_error"
  );
  meeting_dateDueOn_error = document.getElementById("meeting_dateDueOn_error");
  repeatingCounterIncrement_error = document.getElementById(
    "repeatingCounterIncrement_error"
  );
  repeatingIncrementBy_error = document.getElementById(
    "repeatingIncrementBy_error"
  );
}

submitMeetingForm();
bindEventButtontoModal();
enableMeetingFormEdit();
onMeetingModalClose();
repeatingCheckBoxTogglerMeeting();
