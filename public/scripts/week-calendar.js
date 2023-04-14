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
      event_modal.querySelector("input#title").value = data.title;
      event_modal.querySelector("input#textBody").value = data.textBody;
      event_modal.querySelector("input#tag").value = data.tag;
      event_modal.querySelector("select#priority").value = data.priority;
      // issue with date time coming as a date string
      // it needs an iso string
      event_modal.querySelector("input#dateAddedTo").value = data.dateAddedTo;

      event_modal.querySelector("input#dateDueOn").value = data.dateDueOn;
      event_modal.querySelector("input#repeating").value = data.repeating;
      event_modal.querySelector("select#repeatingIncrementBy").value =
        data.repeatingIncrementBy;
      event_modal.querySelector("input#repeatingCounterIncrement").value =
        data.repeatingCounterIncrement;
    }
  );
}

function enableFormEdit() {
  let calender_div = document.getElementById("calendar-div");
  editButtons = calender_div.querySelectorAll("button.btn-edit");
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      let event_modal = document.getElementById("modal-meeting-display");
      let fieldset = event_modal.querySelector("#form-enabler");
      fieldset.disabled = fieldset.disabled ? false : true;
    });
  });
}

function onModalClose() {
  dataGlobal = undefined;
  userIdGlobal = undefined;
  let event_modal = document.getElementById("modal-meeting-display");
  modalCloseButtons = event_modal.querySelectorAll('[data-bs-dismiss="modal"]');
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      let fieldset = event_modal.querySelector("#form-enabler");
      fieldset.disabled = true;
      event_modal.querySelector("#modal-meeting-label.modal-title").innerText =
        "";
      event_modal.querySelector("input#title").value = "";
      event_modal.querySelector("input#textBody").value = "";
      event_modal.querySelector("input#tag").value = "";
      event_modal.querySelector("select#priority").value = "";
      event_modal.querySelector("input#dateAddedTo").value = "";
      event_modal.querySelector("input#dateDueOn").value = "";
      event_modal.querySelector("input#repeating").value = "";
      event_modal.querySelector("select#repeatingIncrementBy").value = "";
      event_modal.querySelector("input#repeatingCounterIncrement").value = "";
    });
  });
}

function submitForm(event) {
  event.preventDefault();
  event.stopPropagation();
  //make it a put request
  // Create a new hidden input element
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "_method";
  input.value = "PUT";

  // Append the new input element to the form
  event.target.appendChild(input);

  let formData = new FormData(event.target);
  let jsonData = {};
  for (var [key, value] of formData.entries()) {
    jsonData[key] = value;
  }
  //todo validations
  checkValidations(jsonData);
  // $.ajax({ method: "PUT", url: `/meeting/${userIdGlobal}/${dataGlobal._id}` }).then(
  //   function (data) {
  //     //check status code
  //     // if status code 200 update modal
  //     // if status code something else show the errors
  //   })

  event.target.action = `/meeting/${userIdGlobal}/${dataGlobal._id}`;
  event.target.method = "post";
  event.target.submit();
}

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

function checkValidations(jsonData) {}

bindEventButtontoModal();
enableFormEdit();
onModalClose();
