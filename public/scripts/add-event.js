const addButton = document.getElementById("add-event-trigger");
const reminderButton = document.getElementById("reminder-button");
const taskButton = document.getElementById("task-button");
const eventModalForm = document.getElementById("display-event-form-rightP");
const eventModalOptions = document.getElementById("hide-event-buttons-rightP");
const eventModalTitleElement = document.getElementById("modal-title-event");
const addEventModal = document.getElementById("add-event-modal");

const modalCloseButton1 = document.getElementById(
  "add-event-modal-close-button-1"
);
const modalCloseButton2 = document.getElementById(
  "add-event-modal-close-button-2"
);
let eventSelected = null;

function clickOfAddEvent() {
  eventModalForm.style.display = "none";
}

function clickOfReminderButton() {
  eventSelected = "reminder";
  eventModalTitleElement.textContent = eventSelected;
  eventModalOptions.style.display = "none";
  eventModalForm.style.display = "block";
}

function clickOfTaskButton() {
  eventSelected = "task";
  eventModalTitleElement.textContent = eventSelected;
  eventModalOptions.style.display = "none";
  eventModalForm.style.display = "block";
  eventModalForm.querySelector("#remind-time").style.display = "none";
  eventModalForm.querySelector("#is-repeating").style.display = "none";
  eventModalForm.querySelector("#remind-end-time").style.display = "none";
}

function clickOfModalCloseAction() {
  eventModalOptions.style.display = "block";
  eventModalForm.style.display = "none";
  eventModalTitleElement.textContent = "";
  eventModalForm.querySelector("#remind-time").style.display = "block";
  eventModalForm.querySelector("#is-repeating").style.display = "block";
  eventModalForm.querySelector("#remind-end-time").style.display = "block";
  eventSelected = null;
}

function initButtons() {
  if (addButton) {
    addButton.addEventListener("click", clickOfAddEvent);
  }

  if (reminderButton) {
    reminderButton.addEventListener("click", clickOfReminderButton);
  }

  if (taskButton) {
    taskButton.addEventListener("click", clickOfTaskButton);
  }

  if (modalCloseButton1) {
    modalCloseButton1.addEventListener("click", clickOfModalCloseAction);
  }
  if (modalCloseButton2) {
    modalCloseButton2.addEventListener("click", clickOfModalCloseAction);
  }
  window.addEventListener("click", function (event) {
    if (
      !(event.target === addEventModal || addEventModal.contains(event.target))
    ) {
      clickOfModalCloseAction();
    }
  });
}
initButtons();
