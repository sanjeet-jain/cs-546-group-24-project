function populateMeetingsModal(data) {
  let event_modal = document.getElementById("modal-event-display");

  event_modal.querySelector("#modal-label.modal-title").innerText = data.title;
  event_modal.querySelector("input#title").value = data.title;
  event_modal.querySelector("input#textBody").value = data.textBody;
  event_modal.querySelector("input#tag").value = data.tag;
  event_modal.querySelector("select#priority").value = data.priority;
  // issue with date time coming as a date string
  // it needs an iso string
  event_modal.querySelector("input#dateAddedTo").value = new Date(
    data.dateAddedTo
  )
    .toISOString()
    .slice(0, 16);
  event_modal.querySelector("input#dateDueOn").value = new Date(data.dateDueOn)
    .toISOString()
    .slice(0, 16);
  event_modal.querySelector("input#repeating").value = data.repeating;
  event_modal.querySelector("select#repeatingIncrementBy").value =
    data.repeatingIncrementBy;
  event_modal.querySelector("input#repeatingCounterIncrement").value =
    data.repeatingCounterIncrement;
}

function enableFormEdit() {
  let event_modal = document.getElementById("modal-event-display");
  let fieldset = event_modal.querySelector("#form-enabler");
  fieldset.disabled = fieldset.disabled ? false : true;
}

function onModalClose() {
  let event_modal = document.getElementById("modal-event-display");
  modalCloseButtons = event_modal.querySelectorAll('[data-bs-dismiss="modal"]');
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      let fieldset = event_modal.querySelector("#form-enabler");
      fieldset.disabled = true;
      event_modal.querySelector("#modal-label.modal-title").innerText = "";
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

onModalClose();
