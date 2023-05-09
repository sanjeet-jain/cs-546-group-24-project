let dataGlobal;
let userIdGlobal;
function populateMeetingsModal(userId, meetingId) {
  $.ajax({
    method: "GET",
    url: `/meeting/${userId}/${meetingId}`,
    success: function (data) {
      dataGlobal = data;
      userIdGlobal = userId;
      hideShowDeleteButton(false);
      toggleUpdateAllCheckbox(!dataGlobal.repeating);
      let event_modal = document.getElementById("modal-meeting-display");

      // event_modal.querySelector("#modal-meeting-label.modal-title").innerText =
      //   data.title;
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
    },
    error: function (data) {
      let resultDiv = document.getElementById("meeting-update-result");
      resultDiv.classList = "";
      resultDiv.innerText =
        data?.responseJSON?.error || "Update wasnt Successful";
      resultDiv.classList.add("alert", "alert-danger");
    },
  });
}

function populateRemindersModal(userId, reminderId) {
  $.ajax({
    method: "GET",
    url: `/reminder/${userId}/reminder/${reminderId}`,
    success: function (data) {
      dataGlobal = data;
      userIdGlobal = userId;
      hideShowDeleteButton(false);
      toggleUpdateAllCheckbox(!dataGlobal.repeating);
      let event_modal = document.getElementById("modal-reminder-display");

      // event_modal.querySelector("#modal-reminder-label.modal-title").innerText =
      //   data.title;
      event_modal.querySelector("input#reminder_title").value = data.title;
      event_modal.querySelector("input#reminder_textBody").value =
        data.textBody;
      event_modal.querySelector("input#reminder_tag").value = data.tag;
      event_modal.querySelector("select#reminder_priority").value =
        data.priority;
      // issue with date time coming as a date string
      // it needs an iso string
      event_modal.querySelector("input#reminder_dateAddedTo").value =
        data.dateAddedTo;

      event_modal.querySelector("input#reminder_repeating").value =
        data.repeating;
      event_modal.querySelector("input#reminder_repeating").checked =
        data.repeating;

      event_modal.querySelector("select#reminder_repeatingIncrementBy").value =
        data.repeatingIncrementBy;

      event_modal.querySelector("input#reminder_endDateTime").value =
        data.endDateTime;
    },
  });
}

function populateTasksModal(userId, taskId) {
  $.ajax({
    method: "GET",
    url: `/task/${userId}/${taskId}`,
    success: function (data) {
      dataGlobal = data;
      userIdGlobal = userId;
      hideShowDeleteButton(false);

      let event_modal = document.getElementById("modal-task-display");

      event_modal.querySelector("input#task_title").value = data.title;
      event_modal.querySelector("input#task_textBody").value = data.textBody;
      event_modal.querySelector("input#task_tag").value = data.tag;
      event_modal.querySelector("select#task_priority").value = data.priority;
      event_modal.querySelector("input#task_dateAddedTo").value =
        data.dateAddedTo;
      event_modal.querySelector("input#task_checked").value = data.checked;
      event_modal.querySelector("input#task_checked").checked = data.checked;
    },
    error: function (data) {
      let resultDiv = document.getElementById("task-update-result");
      resultDiv.classList = "";
      resultDiv.innerText =
        data?.responseJSON?.error || "Update wasnt Successful";
      resultDiv.classList.add("alert", "alert-danger");
    },
  });
}

function populateNotesModal(userId, notesId) {
  $.ajax({
    method: "GET",
    url: `/notes/${userId}/${notesId}`,
    success: function (data) {
      dataGlobal = data;
      userIdGlobal = userId;
      hideShowDeleteButton(false);

      let event_modal = document.getElementById("modal-notes-display");

      event_modal.querySelector("input#notes_title").value = data.title;
      event_modal.querySelector("input#notes_tag").value = data.tag;
      event_modal.querySelector("input#notes_dateAddedTo").value =
        data.dateAddedTo;
      tinymce.get("notes_editor").setContent(data.textBody);
    },
    error: function (data) {
      let resultDiv = document.getElementById("notes-update-result");
      resultDiv.classList = "";
      resultDiv.innerText =
        data?.responseJSON?.error || "Update wasnt Successful";
      resultDiv.classList.add("alert", "alert-danger");
    },
  });
}

function updateAllCheckBoxTogglerMeeting() {
  let event_modal = document.getElementById("modal-meeting-display");
  let updateAll = event_modal.querySelector("input#meeting_updateAll");
  let repeatingIncrementBy = event_modal.querySelector(
    "select#meeting_repeatingIncrementBy"
  );
  let repeatingCounterIncrement = event_modal.querySelector(
    "input#meeting_repeatingCounterIncrement"
  );
  updateAll.addEventListener("change", (event) => {
    if (event.target.checked) {
      event.target.value = true;
      repeatingIncrementBy.disabled = false;
      repeatingCounterIncrement.disabled = false;
      repeatingIncrementBy.setAttribute("required", "");
      repeatingIncrementBy.value = "day";
      repeatingCounterIncrement.setAttribute("required", "");
      repeatingCounterIncrement.value =
        dataGlobal?.repeatingCounterIncrement || 1;
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
      if (dataGlobal.repeating) {
        toggleUpdateAllCheckbox(false, dataGlobal.type);
        repeatingIncrementBy.parentNode.hidden = false;
        repeatingCounterIncrement.parentNode.hidden = false;
      } else {
        event.target.value = true;
        repeatingIncrementBy.disabled = false;
        repeatingCounterIncrement.disabled = false;
        repeatingIncrementBy.setAttribute("required", "");
        repeatingIncrementBy.value = "day";
        repeatingCounterIncrement.setAttribute("required", "");
        repeatingCounterIncrement.value =
          dataGlobal?.repeatingCounterIncrement || 1;
      }
    } else {
      if (dataGlobal.repeating) {
        toggleUpdateAllCheckbox(true, dataGlobal.type);
        repeatingIncrementBy.parentNode.hidden = true;
        repeatingCounterIncrement.parentNode.hidden = true;
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
    }
  });
}

function updateAllCheckBoxTogglerReminder() {
  let event_modal = document.getElementById("modal-reminder-display");
  let updateAll = event_modal.querySelector("input#reminder_updateAll");
  let repeatingIncrementBy = event_modal.querySelector(
    "select#reminder_repeatingIncrementBy"
  );
  let repeatingCounterIncrement = event_modal.querySelector(
    "input#reminder_repeatingCounterIncrement"
  );
  updateAll.addEventListener("change", (event) => {
    if (event.target.checked) {
      event.target.value = true;
      repeatingIncrementBy.disabled = false;
      repeatingCounterIncrement.disabled = false;
      repeatingIncrementBy.setAttribute("required", "");
      repeatingIncrementBy.value = "day";
      repeatingCounterIncrement.setAttribute("required", "");
      repeatingCounterIncrement.value =
        dataGlobal?.repeatingCounterIncrement || 1;
    } else {
      repeatingIncrementBy.disabled = true;
      repeatingCounterIncrement.disabled = true;
      repeatingIncrementBy.removeAttribute("required");
      repeatingCounterIncrement.removeAttribute("required");
      event_modal.querySelector("select#reminder_repeatingIncrementBy").value =
        "";
      event_modal.querySelector(
        "input#reminder_repeatingCounterIncrement"
      ).value = "";
    }
  });
}
function repeatingCheckBoxTogglerReminder() {
  let event_modal = document.getElementById("modal-reminder-display");
  let repeating = event_modal.querySelector("input#reminder_repeating");
  let repeatingIncrementBy = event_modal.querySelector(
    "select#reminder_repeatingIncrementBy"
  );
  let endDateTime = event_modal.querySelector("input#reminder_endDateTime");

  repeating.addEventListener("change", (event) => {
    if (event.target.checked) {
      event.target.value = true;
      repeatingIncrementBy.disabled = false;
      endDateTime.disabled = false;
      repeatingIncrementBy.setAttribute("required", "");
      repeatingIncrementBy.value = "day";
      endDateTime.setAttribute("required", "");
      endDateTime.value = "";
      if (dataGlobal.repeating) {
        toggleUpdateAllCheckbox(false);
      }
    } else {
      if (dataGlobal.repeating) {
        toggleUpdateAllCheckbox(true);
      }
      repeatingIncrementBy.disabled = true;
      endDateTime.disabled = true;
      repeatingIncrementBy.removeAttribute("required");
      endDateTime.removeAttribute("required");
      repeatingIncrementBy.value = "";
      endDateTime.value = "";
    }
  });
}

function enableMeetingFormEdit() {
  let event_modal = document.getElementById("modal-meeting-display");
  let editButtons = event_modal.querySelectorAll("button.btn-edit");
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
      if (dataGlobal.repeating) {
        repeatingIncrementBy.disabled = true;
        repeatingCounterIncrement.disabled = true;
      }
      if (!repeating.checked) {
        repeating.value = false;
        repeatingIncrementBy.disabled = true;
        repeatingCounterIncrement.disabled = true;
      }
    });
  });
}

function enableReminderFormEdit() {
  let eventModal = document.getElementById("modal-reminder-display");
  let editButtons = eventModal.querySelectorAll("button.btn-edit");
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      let fieldset = eventModal.querySelector("#reminder-form-enabler");
      fieldset.disabled = fieldset.disabled ? false : true;
      let repeating = eventModal.querySelector("input#reminder_repeating");
      let repeatingIncrementBy = eventModal.querySelector(
        "select#reminder_repeatingIncrementBy"
      );
      let endDateTime = eventModal.querySelector("input#reminder_endDateTime");
      if (!repeating.checked) {
        repeating.value = false;
        repeatingIncrementBy.disabled = true;
        endDateTime.disabled = true;
      }
    });
  });
}
function enableTaskFormEdit() {
  let event_modal = document.getElementById("modal-task-display");
  let editButtons = event_modal.querySelectorAll("button.btn-edit");
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      let event_modal = document.getElementById("modal-task-display");
      let fieldset = event_modal.querySelector("#task-form-enabler");
      fieldset.disabled = fieldset.disabled ? false : true;
    });
  });
}

function enableNotesFormEdit() {
  let event_modal = document.getElementById("modal-notes-display");
  let editButtons = event_modal.querySelectorAll("button.btn-edit");
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      let event_modal = document.getElementById("modal-notes-display");
      let fieldset = event_modal.querySelector("#notes-form-enabler");
      fieldset.disabled = fieldset.disabled ? false : true;
      if (fieldset.disabled) {
        tinymce.get("notes_editor").mode.set("readonly");
      } else {
        tinymce.get("notes_editor").mode.set("design");
      }
    });
  });
}

function onMeetingModalClose() {
  let event_modal = document.getElementById("modal-meeting-display");
  event_modal.addEventListener("hidden.bs.modal", function () {
    let submitbutton = document.getElementById("meeting-bottom-submit-button");
    submitbutton.disabled = false;
    submitbutton.innerText = "Submit";
    let meetingsForm = document.getElementById("meeting-form");
    let fieldset = event_modal.querySelector("#meeting-form-enabler");
    fieldset.disabled = true;
    meetingsForm.reset();
    let resultDiv = document.getElementById("meeting-update-result");
    resultDiv.classList = "";
    resultDiv.innerText = "";
    let meeting_title_error = document.getElementById("meeting_title_error");
    let meeting_textBody_error = document.getElementById(
      "meeting_textBody_error"
    );
    let meeting_tag_error = document.getElementById("meeting_tag_error");
    let meeting_dateAddedTo_error = document.getElementById(
      "meeting_dateAddedTo_error"
    );
    let meeting_dateDueOn_error = document.getElementById(
      "meeting_dateDueOn_error"
    );
    let meeting_repeatingCounterIncrement_error = document.getElementById(
      "meeting_repeatingCounterIncrement_error"
    );
    let meeting_repeatingIncrementBy_error = document.getElementById(
      "meeting_repeatingIncrementBy_error"
    );
    let meeting_priority_error = document.getElementById(
      "reminder_priority_error"
    );

    meeting_title_error.innerText = "";
    meeting_textBody_error.innerText = "";
    meeting_tag_error.innerText = "";
    meeting_dateAddedTo_error.innerText = "";
    meeting_dateDueOn_error.innerText = "";
    meeting_repeatingCounterIncrement_error.innerText = "";
    meeting_repeatingIncrementBy_error.innerText = "";
    meeting_priority_error.innerText = "";
    meetingsForm.classList.remove("was-validated");
    dataGlobal = undefined;
  });
}

function onReminderModalClose() {
  let event_modal = document.getElementById("modal-reminder-display");

  event_modal.addEventListener("hidden.bs.modal", function () {
    let submitbutton = document.getElementById("reminder-bottom-submit-button");
    submitbutton.disabled = false;
    submitbutton.innerText = "Submit";
    let reminderForm = document.getElementById("reminder-form");
    reminderForm.reset();
    let fieldset = event_modal.querySelector("#reminder-form-enabler");
    fieldset.disabled = true;

    let resultDiv = document.getElementById("reminder-update-result");
    resultDiv.classList = "";
    resultDiv.innerText = "";
    reminderForm.classList.remove("was-validated");
    reminderForm.title.setCustomValidity("");
    reminderForm.textBody.setCustomValidity("");
    reminderForm.tag.setCustomValidity("");
    reminderForm.priority.setCustomValidity("");
    reminderForm.dateAddedTo.setCustomValidity("");
    reminderForm.endDateTime.setCustomValidity("");
    reminderForm.repeatingIncrementBy.setCustomValidity("");
    dataGlobal = undefined;
  });
}

function onTaskModalClose() {
  let event_modal = document.getElementById("modal-task-display");

  event_modal.addEventListener("hidden.bs.modal", function () {
    let submitbutton = document.getElementById("task-bottom-submit-button");
    submitbutton.disabled = false;
    submitbutton.innerText = "Submit";
    let fieldset = event_modal.querySelector("#task-form-enabler");
    fieldset.disabled = true;
    let taskForm = document.getElementById("task-form");
    taskForm.reset();
    taskForm.classList.remove("was-validated");

    event_modal.querySelector("input#task_title").value = "";
    event_modal.querySelector("input#task_textBody").value = "";
    event_modal.querySelector("input#task_tag").value = "";
    event_modal.querySelector("select#task_priority").value = "";
    event_modal.querySelector("input#task_dateAddedTo").value = "";
    event_modal.querySelector("input#task_checked").value = "";
    event_modal.querySelector("input#task_checked").checked = "";
    let resultDiv = document.getElementById("task-update-result");
    resultDiv.classList = "";
    resultDiv.innerText = "";
    dataGlobal = undefined;
    let task_title_error = document.getElementById("task_title_error");
    let task_priority_error = document.getElementById("task_priority_error");
    let task_textBody_error = document.getElementById("task_textBody_error");
    let task_tag_error = document.getElementById("task_tag_error");
    let task_dateAddedTo_error = document.getElementById(
      "task_dateAddedTo_error"
    );
    let task_checked_error = document.getElementById("task_checked_error");
    task_title_error.innerText = "";
    task_textBody_error.innerText = "";
    task_tag_error.innerText = "";
    task_dateAddedTo_error.innerText = "";
    task_checked_error.innerText = "";
    task_priority_error.innerText = "";
  });
}

function onNotesModalClose() {
  let event_modal = document.getElementById("modal-notes-display");

  event_modal.addEventListener("hidden.bs.modal", function () {
    let submitbutton = document.getElementById("notes-bottom-submit-button");
    submitbutton.disabled = false;
    submitbutton.innerText = "Submit";
    let notesForm = document.getElementById("notes-form");
    notesForm.reset();
    notesForm.classList.remove("was-validated");

    let fieldset = event_modal.querySelector("#notes-form-enabler");
    fieldset.disabled = true;
    // event_modal.querySelector("#modal-notes-label.modal-title").innerText =
    //   "";
    event_modal.querySelector("input#notes_title").value = "";
    event_modal.querySelector("input#notes_tag").value = "";
    event_modal.querySelector("input#notes_dateAddedTo").value = "";
    tinymce.get("notes_editor").resetContent();
    tinymce.get("notes_editor").setContent("");
    tinymce.get("notes_editor").mode.set("readonly");
    let resultDiv = document.getElementById("notes-update-result");
    resultDiv.classList = "";
    resultDiv.innerText = "";
    resultDiv.innerHtml = "";
    dataGlobal = undefined;

    let notes_title_error = document.getElementById("notes_title_error");
    let notes_editor_error = document.getElementById("notes_editor_error");
    let notes_tag_error = document.getElementById("notes_tag_error");
    let notes_dateAddedTo_error = document.getElementById(
      "notes_dateAddedTo_error"
    );

    notes_title_error.innerText = "";
    notes_editor_error.innerText = "";
    notes_editor_error.classList = "";
    notes_tag_error.innerText = "";
    notes_dateAddedTo_error.innerText = "";
  });
}

function submitMeetingForm() {
  let meetingform = document.getElementById("meeting-form");
  meetingform.addEventListener(
    "submit",
    (event) => {
      let submitbutton = document.getElementById(
        "meeting-bottom-submit-button"
      );
      submitbutton.disabled = true;
      const oldHtml = submitbutton.innerHTML;
      submitbutton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
      event.preventDefault();
      event.stopPropagation();
      let formData = new FormData(event.target);
      let jsonData = {};
      for (let [key, value] of formData.entries()) {
        jsonData[key] = value.trim();
      }

      jsonData["repeating"] = event.target.repeating.checked;
      jsonData["updateAll"] = event.target.updateAll.checked;

      let reqType = "PUT";
      let ajaxURL = `/meeting/${userIdGlobal}/${dataGlobal?._id}`;
      if (dataGlobal === undefined) {
        reqType = "POST";
        ajaxURL = `/meeting/user/${userIdGlobal}`;
      }
      //todo validations
      if (checkMeetingValidations(event.target)) {
        $.ajax({
          method: reqType,
          url: ajaxURL,
          data: jsonData,
          success: function (data) {
            submitbutton.disabled = false;
            submitbutton.innerHTML = oldHtml;
            let resultDiv = document.getElementById("meeting-update-result");
            resultDiv.innerText =
              "Meeting updated Successfully! Page will refresh automatically";
            resultDiv.classList = "";
            resultDiv.classList.add("alert", "alert-success");
            // if status code 200 update modal
            //populateMeetingsModal(data.userId, data.meetingId);
            setTimeout(location.reload.bind(location), 1500);
          },
          error: function (data) {
            submitbutton.disabled = false;
            submitbutton.innerHTML = oldHtml;
            let resultDiv = document.getElementById("meeting-update-result");
            resultDiv.classList = "";
            resultDiv.innerText =
              data?.responseJSON?.error || "Update wasnt Successful";
            resultDiv.classList.add("alert", "alert-danger");
            let meeting_title_error = document.getElementById(
              "meeting_title_error"
            );
            let meeting_textBody_error = document.getElementById(
              "meeting_textBody_error"
            );
            let meeting_tag_error =
              document.getElementById("meeting_tag_error");
            let meeting_dateAddedTo_error = document.getElementById(
              "meeting_dateAddedTo_error"
            );
            let meeting_dateDueOn_error = document.getElementById(
              "meeting_dateDueOn_error"
            );
            let meeting_repeatingCounterIncrement_error =
              document.getElementById(
                "meeting_repeatingCounterIncrement_error"
              );
            let meeting_repeatingIncrementBy_error = document.getElementById(
              "meeting_repeatingIncrementBy_error"
            );
            // if some error message is coming form the back end
            // set the inner text and customValidity()

            meeting_title_error.innerText =
              data.responseJSON?.errorMessages?.title || "";
            meeting_textBody_error.innerText =
              data.responseJSON?.errorMessages?.textBody || "";
            meeting_tag_error.innerText =
              data.responseJSON?.errorMessages?.tag || "";
            meeting_dateAddedTo_error.innerText =
              data.responseJSON?.errorMessages?.dateAddedTo || "";
            meeting_dateDueOn_error.innerText =
              data.responseJSON?.errorMessages?.dateDueOn || "";
            meeting_repeatingCounterIncrement_error.innerText =
              data.responseJSON?.errorMessages?.repeatingCounterIncrement || "";
            meeting_repeatingIncrementBy_error.innerText =
              data.responseJSON?.errorMessages?.repeatingIncrementBy ||
              "" ||
              "";
            let event_modal = document.getElementById("modal-meeting-display");

            event_modal
              .querySelector("input#meeting_title")
              .setCustomValidity(data.responseJSON?.errorMessages?.title || "");
            event_modal
              .querySelector("input#meeting_textBody")
              .setCustomValidity(
                data.responseJSON?.errorMessages?.textBody || ""
              );
            event_modal
              .querySelector("input#meeting_tag")
              .setCustomValidity(data.responseJSON?.errorMessages?.tag || "");
            event_modal
              .querySelector("select#meeting_priority")
              .setCustomValidity(
                data.responseJSON?.errorMessages?.priority || ""
              );
            event_modal
              .querySelector("input#meeting_dateAddedTo")
              .setCustomValidity(
                data.responseJSON?.errorMessages?.dateAddedTo || ""
              );
            event_modal
              .querySelector("input#meeting_dateDueOn")
              .setCustomValidity(
                data.responseJSON?.errorMessages?.dateDueOn || ""
              );
            event_modal
              .querySelector("input#meeting_repeating")
              .setCustomValidity(
                data.responseJSON?.errorMessages?.repeating || ""
              );
            event_modal
              .querySelector("select#meeting_repeatingIncrementBy")
              .setCustomValidity(
                data.responseJSON?.errorMessages?.repeatingIncrementBy || ""
              );
            event_modal
              .querySelector("input#meeting_repeatingCounterIncrement")
              .setCustomValidity(
                data.responseJSON?.errorMessages?.repeatingCounterIncrement ||
                  ""
              );
          },
        });
      }
      submitbutton.disabled = false;
      submitbutton.innerHTML = oldHtml;
      event.target.classList.add("was-validated");
    },
    false
  );
}

function submitReminderForm() {
  let reminderForm = document.getElementById("reminder-form");
  let resultDiv = document.getElementById("reminder-update-result");
  reminderForm.addEventListener(
    "submit",
    (event) => {
      let submitbutton = document.getElementById(
        "reminder-bottom-submit-button"
      );
      submitbutton.disabled = true;
      const oldHtml = submitbutton.innerHTML;
      submitbutton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
      event.preventDefault();
      event.stopPropagation();
      let formData = new FormData(event.target);
      let jsonData = {};
      for (let [key, value] of formData.entries()) {
        jsonData[key] = value.trim();
      }
      jsonData["repeating"] = event.target.repeating.checked;
      jsonData["updateAll"] = event.target.updateAll.checked;
      let reqType = "PUT";
      let ajaxURL = `/reminder/${userIdGlobal}/reminder/${dataGlobal?._id}`;
      if (dataGlobal === undefined) {
        reqType = "POST";
        ajaxURL = `/reminder/${userIdGlobal}`;
      }
      if (checkReminderValidations(event.target)) {
        $.ajax({
          method: reqType,
          url: ajaxURL,
          data: jsonData,
          success: function (data) {
            submitbutton.disabled = false;
            submitbutton.innerHTML = oldHtml;
            resultDiv.innerText =
              "Reminder Updated Successfully! Page will refresh automatically";
            resultDiv.classList.add("alert", "alert-success");

            setTimeout(location.reload.bind(location), 1500);
          },
          error: function (data) {
            submitbutton.disabled = false;
            submitbutton.innerHTML = oldHtml;
            resultDiv.classList = "";
            resultDiv.innerText = data?.responseJSON?.error;
            resultDiv.classList.add("alert", "alert-danger");
          },
        });
      }
      submitbutton.disabled = false;
      submitbutton.innerHTML = oldHtml;
      event.target.classList.add("was-validated");
    },
    false
  );
}

function submitTaskForm() {
  let taskform = document.getElementById("task-form");
  taskform.addEventListener(
    "submit",
    (event) => {
      let submitbutton = document.getElementById("task-bottom-submit-button");
      submitbutton.disabled = true;
      const oldHtml = submitbutton.innerHTML;
      submitbutton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
      event.preventDefault();
      event.stopPropagation();
      let formData = new FormData(event.target);
      let jsonData = {};
      for (let [key, value] of formData.entries()) {
        jsonData[key] = value.trim();
      }
      jsonData["checked"] = event.target.checked.checked;
      let reqType = "PUT";
      let ajaxURL = `/task/${userIdGlobal}/${dataGlobal?._id}`;
      if (dataGlobal === undefined) {
        reqType = "POST";
        ajaxURL = `/task/tasks/${userIdGlobal}`;
      }
      if (checkTaskValidations(event.target)) {
        $.ajax({
          method: reqType,
          url: ajaxURL,
          data: jsonData,
          success: function (data) {
            submitbutton.disabled = false;
            submitbutton.innerHTML = oldHtml;
            let resultDiv = document.getElementById("task-update-result");
            resultDiv.innerText =
              "Task updated  Successfully! Page will refresh automatically";
            resultDiv.classList = "";
            resultDiv.classList.add("alert", "alert-success");
            // if status code 200 update modal
            //populateTasksModal(data.userId, data.taskId);
            setTimeout(location.reload.bind(location), 1500);
          },
          error: function (data) {
            submitbutton.disabled = false;
            submitbutton.innerHTML = oldHtml;
            let resultDiv = document.getElementById("task-update-result");
            resultDiv.classList = "";
            resultDiv.innerText =
              data?.responseJSON?.error || "Update wasnt Successful";
            resultDiv.classList.add("alert", "alert-danger");
            let task_title_error = document.getElementById("task_title_error");
            let task_textBody_error = document.getElementById(
              "task_textBody_error"
            );
            let task_tag_error = document.getElementById("task_tag_error");
            let task_dateAddedTo_error = document.getElementById(
              "task_dateAddedTo_error"
            );
            let task_priority_error = document.getElementById(
              "task_priority_error"
            );

            task_title_error.innerText =
              data.responseJSON?.errorMessages?.title || "";
            task_textBody_error.innerText =
              data.responseJSON?.errorMessages?.textBody || "";
            task_tag_error.innerText =
              data.responseJSON?.errorMessages?.tag || "";
            task_dateAddedTo_error.innerText =
              data.responseJSON?.errorMessages?.dateAddedTo || "";
            task_priority_error.innerText =
              data.responseJSON?.errorMessages?.priority || "";
          },
        });
      }
      submitbutton.disabled = false;
      submitbutton.innerHTML = oldHtml;
      event.target.classList.add("was-validated");
    },
    false
  );
}

function submitNotesForm() {
  let notesform = document.getElementById("notes-form");
  notesform.addEventListener(
    "submit",
    (event) => {
      let submitbutton = document.getElementById("notes-bottom-submit-button");
      submitbutton.disabled = true;
      const oldHtml = submitbutton.innerHTML;
      submitbutton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
      event.preventDefault();
      event.stopPropagation();
      let formData = new FormData(event.target);
      let jsonData = {};
      for (let [key, value] of formData.entries()) {
        jsonData[key] = value.trim();
      }
      jsonData["textBody"] = tinymce.get("notes_editor").getContent();

      let reqType = "PUT";
      let ajaxURL = `/notes/${userIdGlobal}/${dataGlobal?._id}`;
      if (dataGlobal === undefined) {
        reqType = "POST";
        ajaxURL = `/notes/user/${userIdGlobal}`;
      }
      //todo validations
      if (checkNotesValidations(event.target)) {
        $.ajax({
          method: reqType,
          url: ajaxURL,
          data: jsonData,
          success: function (data) {
            submitbutton.disabled = false;
            submitbutton.innerHTML = oldHtml;
            let resultDiv = document.getElementById("notes-update-result");
            resultDiv.innerText =
              "notes updated Successfully! Page will refresh automatically";
            resultDiv.classList = "";
            resultDiv.classList.add("alert", "alert-success");
            // if status code 200 update modal
            // populateNotesModal(data.userId, data.notesId);

            setTimeout(location.reload.bind(location), 1500);
          },
          error: function (data) {
            submitbutton.disabled = false;
            submitbutton.innerHTML = oldHtml;
            let resultDiv = document.getElementById("notes-update-result");
            resultDiv.classList = "";
            resultDiv.innerText =
              data?.responseJSON?.error || "Update wasnt Successful";
            resultDiv.classList.add("alert", "alert-danger");
            let notes_title_error =
              document.getElementById("notes_title_error");
            let notes_editor_error =
              document.getElementById("notes_editor_error");
            let notes_tag_error = document.getElementById("notes_tag_error");
            let notes_dateAddedTo_error = document.getElementById(
              "notes_dateAddedTo_error"
            );

            notes_title_error.innerText =
              data.responseJSON?.errorMessages?.title || "";
            notes_editor_error.innerText =
              data.responseJSON?.errorMessages?.textBody || "";
            notes_tag_error.innerText =
              data.responseJSON?.errorMessages?.tag || "";
            notes_dateAddedTo_error.innerText =
              data.responseJSON?.errorMessages?.dateAddedTo || "";
          },
        });
      }
      submitbutton.disabled = false;
      submitbutton.innerHTML = oldHtml;
      event.target.classList.add("was-validated");
    },
    false
  );
}

//bind all event pills to respective modal generators
function bindEventButtontoModal() {
  // let calender_div = document.getElementById("calendar-div");
  let notes_editor = tinymce.init({
    selector: "textarea#notes_editor",
    skin: "bootstrap",
    plugins: "lists, link image,  wordcount, fullscreen",
    toolbar:
      " fullscreen h1 h2 bold italic strikethrough blockquote bullist numlist backcolor  link image   removeformat",
    // menubar: true,
    readonly: true,

    setup: function (editor) {
      editor.on("change", function (e) {
        let maxChars = 200;
        let currentContentLength = editor.getContent({ format: "text" }).length;

        if (
          currentContentLength >= maxChars &&
          e.inputType !== "deleteContentBackward"
        ) {
          e.preventDefault();
          e.stopPropagation();
          editor.notificationManager.open({
            text: "Text needs to be under 200 characters",
            type: "error",
          });
        }
      });
    },
    image_title: true,
    /* enable automatic uploads of images represented by blob or data URIs*/
    automatic_uploads: true,
    /*
      URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
      images_upload_url: 'postAcceptor.php',
      here we add custom filepicker only to Image dialog
    */
    file_picker_types: "file image ",
    /* and here's our custom image picker*/

    file_picker_callback: function (cb, value, meta) {
      let input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*,application/pdf"); // accept both images and PDFs

      input.onchange = function () {
        let file = this.files[0];

        let formData = new FormData();
        formData.append("image", file);

        $.ajax({
          url: `/notes/api/upload-image/${userIdGlobal}/${file.name}`,
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,
          success: function (data) {
            /* call the callback and populate the Title field with the file name */
            cb(data.location, { title: file.name });
          },
          error: function (xhr, status, error) {
            tinymce.activeEditor.notificationManager.open({
              text: error,
              type: "error",
            });
          },
        });
      };

      input.click();
    },
    // images_upload_handler: async function (blobInfo, success, failure) {
    //   const userId = userIdGlobal; // replace with the actual user ID
    //   const filename = `${Date.now()}-${blobInfo.filename()}`;
    //   const formData = new FormData();
    //   formData.append("image", blobInfo.blob(), blobInfo.filename());
    //   const url = `/notes/api/upload-image/${userId}/${filename}`;

    //   await $.ajax({
    //     url: url,
    //     type: "POST",
    //     data: formData,
    //     processData: false,
    //     contentType: false,
    //     success: function (data) {
    //       const imgElm = document.querySelector(
    //         `img[src="data:${
    //           blobInfo.blob().type
    //         };base64,${blobInfo.base64()}"]`
    //       );
    //       if (imgElm) {
    //         imgElm.src = data.location;
    //       }
    //       success(data.location);
    //     },
    //     error: function (xhr, status, error) {
    //       console.error(error);
    //       editor.notificationManager.open({
    //         text: "Text needs to be under 200 characters",
    //         type: "error",
    //       });
    //       failure(error);
    //     },
    //   });
    // },
  });
  let event_pills = document.querySelectorAll("button.event-pill");

  event_pills.forEach((eventpill) => {
    eventpill.addEventListener(
      "click",
      (event) => {
        populateBasedOnEventType(event.target);
      },
      false
    );
  });
}
function populateBasedOnEventType(target) {
  let eventId = target.attributes["data-bs-eventid"]?.value;
  let userId = target.attributes["data-bs-userid"].value;
  let typeOfEventPill = target.attributes["data-bs-event-type"].value;
  switch (typeOfEventPill) {
    case "meeting":
      populateMeetingsModal(userId, eventId);

      break;
    case "reminder":
      populateRemindersModal(userId, eventId);

      break;
    case "task":
      populateTasksModal(userId, eventId);
      break;
    case "notes":
      populateNotesModal(userId, eventId);
      break;
    case "add-event":
      hideShowDeleteButton(true);
      toggleUpdateAllCheckbox(true);
      dataGlobal = undefined;
      userIdGlobal = userId;
      break;
    default:
      break;
  }
}
function toggleUpdateAllCheckbox(hide, eventType = dataGlobal?.type) {
  let updateAllDivs;
  if (eventType !== undefined) {
    updateAllDivs = document.querySelectorAll(
      `#${eventType}-form div.updateAll`
    );
  }
  if (eventType === undefined) {
    updateAllDivs = document.querySelectorAll(`div.updateAll`);
  }
  updateAllDivs.forEach((div) => {
    div.hidden = hide;
    let checkbox = div.querySelector("input");
    checkbox.checked = false;
    checkbox.hidden = hide;
    div.hidden = hide;
    checkbox.disabled = hide;
  });
}

function hideShowDeleteButton(hide) {
  let deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((button) => {
    button.hidden = hide;
  });
}
function checkMeetingValidations(form) {
  //get all error divs
  let meeting_title_error = document.getElementById("meeting_title_error");
  let meeting_textBody_error = document.getElementById(
    "meeting_textBody_error"
  );
  let meeting_tag_error = document.getElementById("meeting_tag_error");
  let meeting_dateAddedTo_error = document.getElementById(
    "meeting_dateAddedTo_error"
  );
  let meeting_dateDueOn_error = document.getElementById(
    "meeting_dateDueOn_error"
  );
  let meeting_repeatingCounterIncrement_error = document.getElementById(
    "meeting_repeatingCounterIncrement_error"
  );
  let meeting_repeatingIncrementBy_error = document.getElementById(
    "meeting_repeatingIncrementBy_error"
  );
  let meeting_priority_error = document.getElementById(
    "meeting_priority_error"
  );

  meeting_title_error.innerText = "";
  meeting_textBody_error.innerText = "";
  meeting_tag_error.innerText = "";
  meeting_dateAddedTo_error.innerText = "";
  meeting_dateDueOn_error.innerText = "";
  meeting_repeatingCounterIncrement_error.innerText = "";
  meeting_repeatingIncrementBy_error.innerText = "";
  meeting_priority_error.innerText = "";
  form.tag.setCustomValidity("");
  form.title.setCustomValidity("");
  form.dateAddedTo.setCustomValidity("");
  form.dateDueOn.setCustomValidity("");
  form.repeating.setCustomValidity("");
  form.priority.setCustomValidity("");
  form.repeatingIncrementBy.setCustomValidity("");
  form.repeatingCounterIncrement.setCustomValidity("");
  form.priority.setCustomValidity("");

  if (form.tag.value.length > 20) {
    meeting_tag_error.innerText = "tag cant be longer than 20 characters";
    form.tag.setCustomValidity("error");
  }
  if (
    form.tag.value.trim().length > 0 &&
    !form.tag.value.match(/^[a-zA-Z]+$/)
  ) {
    meeting_tag_error.innerText = "tag has only letters with no spaces";
    form.tag.setCustomValidity("error");
  }

  if (form.title.value.length < 1) {
    meeting_title_error.innerText = "Title cannot be left empty";
    form.title.setCustomValidity("error");
  }

  if (form.title.checkValidity() && form.title.value.length > 100) {
    meeting_title_error.innerText = "Title cant be longer than 100 characters";
    form.title.setCustomValidity("error");
  }

  if (form.textBody.value.length > 200) {
    meeting_textBody_error.innerText =
      "TextBody cant be longer than 200 characters";
    form.textBody.setCustomValidity("error");
  }

  if (!/^(1|2|3)$/.test(form.priority.value)) {
    meeting_priority_error.innerText =
      "Priority can only be selected as low medium or high";
    form.priority.setCustomValidity("error");
  }

  if (
    form.dateAddedTo.value.trim().length > 0 &&
    !validateDateTime(form.dateAddedTo.value)
  ) {
    meeting_dateAddedTo_error.innerText =
      "The date time value passed is invalid";
    form.dateAddedTo.setCustomValidity("invalid date");
  }

  if (
    form.dateDueOn.value.trim().length > 0 &&
    !validateDateTime(form.dateDueOn.value)
  ) {
    meeting_dateDueOn_error.innerText = "The date time value passed is invalid";
    form.dateDueOn.setCustomValidity("invalid date");
  }

  //dateAdded to passed dateDue on not passed
  if (form.dateAddedTo.value !== "" && form.dateDueOn.value === "") {
    meeting_dateDueOn_error.innerText =
      "Due data must be entered as date added to is populated";
    form.dateDueOn.setCustomValidity("error");
  }
  //dateDue to passed dateAdded on not passed

  if (form.dateAddedTo.value === "" && form.dateDueOn.value !== "") {
    meeting_dateAddedTo_error.innerText = "Date Added to must be populated";
    form.dateAddedTo.setCustomValidity("error");
  }

  //both passed validate range
  if (
    form.dateAddedTo.value !== "" &&
    form.dateDueOn.value !== "" &&
    form.dateAddedTo.checkValidity() &&
    form.dateAddedTo.checkValidity()
  ) {
    if (dayjs(form.dateDueOn.value).diff(dayjs(form.dateAddedTo.value)) < 0) {
      form.dateAddedTo.setCustomValidity("invalid_range");
      form.dateDueOn.setCustomValidity("invalid_range");
      meeting_dateDueOn_error.innerText =
        "Date Due to must be after date Due On";
      meeting_dateAddedTo_error.innerText =
        "Date Added to must be before date Due On";
    }
  }
  if (form.repeating.checked) {
    if (
      form.dateAddedTo.checkValidity() &&
      form.dateAddedTo.value.trim().length === 0
    ) {
      form.dateAddedTo.setCustomValidity("mandatory");
      meeting_dateDueOn_error.innerText =
        "This field is mandatory in order to access the recurrence feature";
    }
    if (
      form.dateDueOn.checkValidity() &&
      form.dateDueOn.value.trim().length === 0
    ) {
      form.dateDueOn.setCustomValidity("mandatory");
      meeting_dateAddedTo_error.innerText =
        "This field is mandatory in order to access the recurrence feature";
    }
    if (form.repeatingCounterIncrement.value <= 0) {
      meeting_repeatingCounterIncrement_error.innerText =
        "the counter needs to be greater than 0";
      form.repeatingCounterIncrement.setCustomValidity("error");
    }
    if (!/^(day|week|month|year)$/.test(form.repeatingIncrementBy.value)) {
      meeting_repeatingIncrementBy_error.innerText =
        "the counter needs to be greater a value from the drop down!";
      form.repeatingIncrementBy.setCustomValidity("error");
    }
  }
  let resultDiv = document.getElementById(`meeting-update-result`);
  resultDiv.classList = "";
  resultDiv.innerText = "";
  if (!form.checkValidity()) {
    resultDiv.innerText = "There Are Some Errors on the form";
    resultDiv.classList.add("alert", "alert-danger");
  }
  if (form.checkValidity()) {
    return true;
  } else return false;
}

function checkNotesValidations(form) {
  //get all error divs
  let notes_title_error = document.getElementById("notes_title_error");
  let notes_editor_error = document.getElementById("notes_editor_error");
  let notes_tag_error = document.getElementById("notes_tag_error");
  let notes_dateAddedTo_error = document.getElementById(
    "notes_dateAddedTo_error"
  );

  notes_title_error.innerText = "";
  notes_tag_error.innerText = "";
  notes_dateAddedTo_error.innerText = "";
  notes_editor_error.innerText = "";
  notes_editor_error.classList = "";
  form.textBody.setCustomValidity("");
  form.tag.setCustomValidity("");
  form.title.setCustomValidity("");
  form.dateAddedTo.setCustomValidity("");

  if (form.tag.value.length > 20) {
    notes_tag_error.innerText = "tag cant be longer than 20 characters";
    form.tag.setCustomValidity("error");
  }
  if (
    typeof form.tag.value === "string" &&
    form.tag.value.trim().length > 0 &&
    !form.tag.value.match(/^[a-zA-Z0-9_]+$/)
  ) {
    notes_tag_error.innerText = "tag has only letters with no spaces";
    form.tag.setCustomValidity("error");
  }

  if (form.title.value.length < 1) {
    notes_title_error.innerText =
      "Title should have atleast 1 character which is not space";
    form.title.setCustomValidity("error");
  }

  if (form.title.value.length > 100) {
    notes_title_error.innerText = "Title cant be longer than 100 characters";
    form.title.setCustomValidity("error");
  }

  if (form.dateAddedTo.value.length > 200) {
    notes_editor_error.innerText =
      "TextBody cant be longer than 200 characters";
    form.textBody.setCustomValidity("error");
  }

  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(
    tinymce.get("notes_editor").getContent(),
    "text/html"
  );

  if (parsedHtml.body.textContent.trim().length === 0) {
    notes_editor_error.classList.add("alert", "alert-danger");

    notes_editor_error.innerText = "TextBody cant be empty";
    form.textBody.setCustomValidity("underflow");
  }

  if (parsedHtml.body.textContent.trim() > 200) {
    notes_editor_error.classList.add("alert", "alert-danger");

    notes_editor_error.innerText =
      "TextBody cant be longer than 200 characters";
    form.textBody.setCustomValidity("overflow");
  }
  let resultDiv = document.getElementById(`notes-update-result`);
  resultDiv.classList = "";
  resultDiv.innerText = "";
  if (!form.checkValidity()) {
    resultDiv.innerText = "There Are Some Errors on the form";
    resultDiv.classList.add("alert", "alert-danger");
  }
  if (form.checkValidity()) {
    return true;
  } else return false;
}

function checkReminderValidations(form) {
  let reminder_title_error = document.getElementById("reminder_title_error");
  let reminder_textBody_error = document.getElementById(
    "reminder_textBody_error"
  );
  let reminder_tag_error = document.getElementById("reminder_tag_error");
  let reminder_dateAddedTo_error = document.getElementById(
    "reminder_dateAddedTo_error"
  );
  let reminder_repeatingIncrementBy_error = document.getElementById(
    "reminder_repeatingIncrementBy_error"
  );

  let reminder_priority_error = document.getElementById(
    "reminder_priority_error"
  );
  let reminder_endDateTime_error = document.getElementById(
    "reminder_endDateTime_error"
  );

  form.dateAddedTo.setCustomValidity("");

  reminder_endDateTime_error.innerText = "";
  form.endDateTime.setCustomValidity("");
  form.title.setCustomValidity("");
  reminder_title_error.innerText = "";

  form.textBody.setCustomValidity("");
  reminder_textBody_error.innerText = "";

  form.tag.setCustomValidity("");
  reminder_tag_error.innerText = "";

  form.priority.setCustomValidity("");
  reminder_priority_error.innerText = "";

  form.dateAddedTo.setCustomValidity("");
  reminder_dateAddedTo_error.innerText = "";

  reminder_dateAddedTo_error.innerText = "";

  reminder_repeatingIncrementBy_error.innerText = "";
  form.repeatingIncrementBy.setCustomValidity("");

  if (form.title.value.length < 1) {
    reminder_title_error.innerText = "Title cannot be left empty";
    form.title.setCustomValidity("error");
  }

  if (form.title.value.length > 100) {
    if (form.title.checkValidity()) {
      reminder_title_error.innerText =
        "Title cant be longer than 100 characters";
      form.title.setCustomValidity("error");
    }
  }

  if (form.textBody.value.length > 200) {
    reminder_textBody_error.innerText =
      "TextBody cant be longer than 200 characters";
    form.textBody.setCustomValidity("error");
  }

  if (form.tag.value.length > 20) {
    reminder_tag_error.innerText = "tag cant be longer than 20 characters";
    form.tag.setCustomValidity("error");
  }
  if (
    typeof form.tag.value === "String" &&
    form.tag.value.trim().length > 0 &&
    !form.tag.value.match(/^[a-zA-Z]+$/)
  ) {
    if (form.tag.checkValidity()) {
      reminder_tag_error.innerText = "tag has only letters with no spaces";
      form.tag.setCustomValidity("error");
    }
  }

  if (!/^(1|2|3)$/.test(form.priority.value)) {
    reminder_priority_error.innerText =
      "Priority can only be selected as low medium or high";
    form.priority.setCustomValidity("error");
  }

  if (!validateDateTime(form.dateAddedTo.value)) {
    reminder_dateAddedTo_error.innerText =
      "The date time value passed is invalid";
    form.dateAddedTo.setCustomValidity("invalid date");
  }

  if (form.repeating.value === "true") {
    if (!validateDateTime(form.endDateTime.value)) {
      reminder_endDateTime_error.innerText =
        "The end recurrence date should be valid";
      form.endDateTime.setCustomValidity("Error");
    }
    if (
      validateDateTime(form.dateAddedTo.value) &&
      validateDateTime(form.endDateTime.value) &&
      dayjs(form.dateAddedTo.value).diff(dayjs(form.endDateTime.value)) >= 0
    ) {
      if (
        form.dateAddedTo.checkValidity() &&
        form.endDateTime.checkValidity()
      ) {
        reminder_endDateTime_error.innerText =
          "End Date must be after date added to";
        reminder_dateAddedTo_error.innerText =
          "Date Added to must be before date Due On";
        form.dateAddedTo.setCustomValidity("Error");
        form.endDateTime.setCustomValidity("Error");
      }
    }

    if (!/^(day|week|month|year)$/.test(form.repeatingIncrementBy.value)) {
      reminder_repeatingIncrementBy_error.innerText =
        "The type of recurrence an only be a day, week, month and year";
      form.repeatingIncrementBy.setCustomValidity("error");
    }
  }
  let resultDiv = document.getElementById(`reminder-update-result`);
  resultDiv.classList = "";
  resultDiv.innerText = "";
  if (!form.checkValidity()) {
    resultDiv.innerText = "There Are Some Errors on the form";
    resultDiv.classList.add("alert", "alert-danger");
  }
  return form.checkValidity();
}

function checkTaskValidations(form) {
  //get all error divs
  let task_title_error = document.getElementById("task_title_error");
  let task_textBody_error = document.getElementById("task_textBody_error");
  let task_tag_error = document.getElementById("task_tag_error");
  let task_dateAddedTo_error = document.getElementById(
    "task_dateAddedTo_error"
  );
  let task_checked_error = document.getElementById("task_checked_error");
  let task_priority_error = document.getElementById("task_priority_error");

  form.dateAddedTo.setCustomValidity("");
  task_dateAddedTo_error.innerText = "";

  form.title.setCustomValidity("");
  task_title_error.innerText = "";

  form.textBody.setCustomValidity("");
  task_textBody_error.innerText = "";

  form.tag.setCustomValidity("");
  task_tag_error.innerText = "";

  form.priority.setCustomValidity("");
  task_priority_error.innerText = "";

  form.checked.setCustomValidity("");
  task_checked_error.innerText = "";

  if (form.title.value.length < 1) {
    task_title_error.innerText = "Title can't be empty";
  }

  if (form.title.value.length > 100 && form.title.checkValidity()) {
    task_title_error.innerText = "Title can't be longer than 100 characters";
  }

  if (form.textBody.value.length > 200) {
    task_textBody_error.innerText = "Text can't be longer than 100 characters";
  }

  if (form.tag.value.length > 20) {
    task_tag_error.innerText = "Tag can't be longer than 20 characters";
  }

  if (!/^(1|2|3)$/.test(form.priority.value) && form.tag.checkValidity()) {
    task_priority_error.innerText =
      "Priority can only be selected as low medium or high";
    form.priority.setCustomValidity("error");
  }

  if (
    typeof form.dateAddedTo.value === "string" &&
    form.dateAddedTo.value.trim().length > 0 &&
    !validateDateTime(form.dateAddedTo.value)
  ) {
    task_dateAddedTo_error.innerText = "The date added should be valid";
    form.dateAddedTo.setCustomValidity("date added to can't be invalid");
  }

  if (
    typeof form.dateAddedTo.value === "string" &&
    form.dateAddedTo.value.trim().length === 0 &&
    form.checked.checked === true
  ) {
    task_dateAddedTo_error.innerText = "Add date to mark this task completed";
    form.dateAddedTo.setCustomValidity("date added to can't be invalid");
  }
  let resultDiv = document.getElementById(`task-update-result`);
  resultDiv.classList = "";
  resultDiv.innerText = "";
  if (!form.checkValidity()) {
    resultDiv.innerText = "There Are Some Errors on the form";
    resultDiv.classList.add("alert", "alert-danger");
  }
  if (form.checkValidity()) {
    return true;
  } else return false;
}
let selectedDateCell = new URLSearchParams(window.location.search).get(
  "selectedDateCell"
);
function clickableDateCells() {
  let dateCells = document.querySelectorAll("td.date-cell");
  dateCells.forEach((date) => {
    date.addEventListener("click", (event) => {
      dateCells.forEach((date) => {
        date.classList.remove("date-cell-active");
      });
      date.classList.add("date-cell-active");

      let eventTarget = event.target.closest("td");
      let selectedDate = eventTarget.attributes["data-bs-day"]?.value;
      selectedDateCell = selectedDate;
      setPageUrlForSelectedDateCell(selectedDate, false);
      setDatepickerValue(selectedDate);
    });
  });
}
function loadLeftPaneCells(data) {
  let events = data.selectedDayItems.sort((a, b) => {
    if (a.priority > b.priority) {
      return -1;
    }
    if (a.priority < b.priority) {
      return 1;
    }
    return 0;
  });

  let display_current_items_div = document.getElementById(
    "display_current_items"
  );
  display_current_items_div.innerHtml = "";
  display_current_items_div.innerText = "";

  //what if no events ?
  if (events.length === 0) {
    display_current_items_div.innerText = "There are no events for the day";
    return;
  }
  let eventDiv = document.createElement("div");
  eventDiv.classList.add("d-grid", "gap-1");
  events.forEach((event) => {
    let eventButton = document.createElement("button");
    let logoClass = "";
    let buttonClass = "";
    if (event.type === "meeting") {
      logoClass = "bi-calendar-event";
      buttonClass = "swatch-cyan";
    } else if (event.type === "reminder") {
      logoClass = "bi-alarm";
      buttonClass = "swatch-indigo";
    } else if (event.type === "task") {
      logoClass = "bi-check2-square";
      buttonClass = "bg-danger";
    } else if (event.type === "notes") {
      logoClass = "bi-file-text";
      buttonClass = "bg-success";
    }
    if (event.expired) {
      buttonClass = buttonClass + "-subtle";
    }

    eventButton.classList.add(
      "badge",
      "event-pill",
      "border-0",
      buttonClass,
      "text-wrap",
      "text-center",
      "event-button"
      // "draggable-event-button"
    );
    eventButton.setAttribute("data-bs-toggle", "modal");
    eventButton.setAttribute("data-bs-target", `#modal-${event.type}-display`);
    eventButton.setAttribute("data-bs-eventId", `${event._id}`);
    eventButton.setAttribute("data-bs-userId", `${data.userId}`);
    eventButton.setAttribute("data-bs-event-type", `${event.type}`);
    // eventButton.setAttribute("draggable", "true");
    // logic for adding checkbox to task

    let logo = document.createElement("i");
    // add for other events
    logo.classList.add(logoClass);
    let textNode = document.createTextNode(`${event.title}`);

    eventButton.appendChild(logo);
    eventButton.appendChild(textNode);
    // add an eventlistener
    eventButton.addEventListener(
      "click",
      (clickEvent) => {
        populateBasedOnEventType(clickEvent.target);
      },
      false
    );
    if (event.type === "task") {
      let taskDiv = document.createElement("div");
      taskDiv.classList.add(
        "badge",
        "border-0",
        buttonClass,
        "text-wrap",
        "text-center",
        "draggable-event-button"
      );
      taskDiv.setAttribute("data-bs-eventId", `${event._id}`);
      taskDiv.setAttribute("data-bs-userId", `${data.userId}`);
      taskDiv.setAttribute("data-bs-event-type", `${event.type}`);
      let checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.classList.add("task-checkbox");
      checkbox.setAttribute("name", "taskCheckBox");
      checkbox.setAttribute("input", "checkbox");
      checkbox.setAttribute("data-bs-eventId", `${event._id}`);
      checkbox.setAttribute("data-bs-userId", `${data.userId}`);
      checkbox.setAttribute("value", "true");
      checkbox.setAttribute("aria-label", "Task Checkbox");

      if (event.checked === true) {
        checkbox.checked = true;
        eventButton.classList.add("task-completed");
      } else {
        checkbox.checked = false;
        eventButton.classList.remove("task-completed");
      }
      taskDiv.appendChild(checkbox);
      taskDiv.appendChild(eventButton);
      taskDiv.setAttribute("draggable", "true");

      eventDiv.appendChild(taskDiv);
    } else {
      eventButton.setAttribute("draggable", "true");
      eventButton.classList.add("draggable-event-button");
      eventDiv.appendChild(eventButton);
    }
    display_current_items_div.appendChild(eventDiv);
  });
  CheckboxEventListener();
  draggable_event_cells();
}

function miniCalendarLoader() {
  $("#datepickerContainer")
    .datepicker({
      format: "yyyy-mm-dd",
      autoclose: false,
      todayHighlight: true,
      startDate: dayjs()
        .subtract(2, "year")
        .startOf("year")
        .format("YYYY-MM-DD"),
      endDate: dayjs().add(2, "year").endOf("year").format("YYYY-MM-DD"),
    })
    .datepicker("setDate", selectedDateCell)
    .on("changeDate", function (e) {
      if (dayjs(selectedDateCell).month() !== dayjs(e.date).month()) {
        selectedDateCell = dayjs(e.date).format("YYYY-M-D");
        setPageUrlForSelectedDateCell(selectedDateCell);
      }
      selectedDateCell = dayjs(e.date).format("YYYY-M-D");
      setPageUrlForSelectedDateCell(selectedDateCell, false);
      let selected_date_div = document.getElementById("selected_date");
      selected_date_div.innerText = `Items for
      ${dayjs(e.date).format("MMMM DD YYYY")}`;
      $.ajax({
        method: "GET",
        url: `/calendar/getSelectedDayItems/${dayjs(e.date).format(
          "YYYY-MM-DD"
        )}`,
        success: function (data) {
          userIdGlobal = data.userId;
          loadLeftPaneCells(data);
        },
      });
    });
}

function setDatepickerValue(date) {
  $("#datepickerContainer").datepicker("setDate", date);
}

function filterForm() {
  let filterFormElement = document.getElementById("filterForm");

  filterFormElement.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    let formData = new FormData(event.target);
    const filter = {
      eventTypeSelected: [],
      tagsSelected: [],
    };
    for (let [key, value] of formData.entries()) {
      if (key.startsWith("event-filter")) {
        filter.eventTypeSelected.push(value);
      } else if (key.startsWith("tag-filter")) {
        filter.tagsSelected.push(value);
      }
    }
    console.log(filter);
    $.ajax({
      method: "POST",
      url: `${event.target.action}`,
      data: { filter },
      success: function (data) {
        location.reload();
      },
    });
  });
}

function deleteButton() {
  let editButtons = document.querySelectorAll("button.btn-delete");
  editButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const oldHtml = event.target.innerHTML;

      let event_modal = document.getElementById(
        `modal-${dataGlobal.type}-display`
      );
      const isRepeating = event_modal.querySelector(
        `input#${dataGlobal.type}_repeating`
      )?.checked;

      const modalFooter = document.querySelector("#deleteModal .modal-footer");
      modalFooter.innerHTML = "";
      modalFooter.innerText = "";
      const deleteModal = new bootstrap.Modal(
        document.getElementById("deleteModal")
      );

      if (isRepeating) {
        const deleteAllButton = document.createElement("button");
        deleteAllButton.classList.add("btn", "btn-danger");
        deleteAllButton.textContent = "Delete all events";
        modalFooter.appendChild(deleteAllButton);

        deleteAllButton.addEventListener("click", async function () {
          // Delete all events
          let deleteUrl = "";
          if (dataGlobal.type === "meeting") {
            deleteUrl = `/meeting/user/${userIdGlobal}/meetings/repeating/${dataGlobal.repeatingGroup}`;
          }
          // TODO add delete URL for reminders
          if (dataGlobal.type === "reminder") {
            deleteUrl = `/reminder/${userIdGlobal}/reminders/${dataGlobal._id}`;
          }
          event.target.disabled = true;
          // Add the spinner to the button
          event.target.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
          await $.ajax({
            method: "DELETE",
            url: deleteUrl,
            success: function (data) {
              let resultDiv = document.getElementById(
                `${dataGlobal.type}-update-result`
              );
              resultDiv.classList = "";
              resultDiv.innerText =
                "All Event recurrences Successfully deleted, Page will reload now";
              resultDiv.classList.add("alert", "alert-success");
              event.target.disabled = false;
              event.target.innerHTML = oldHtml;
              setTimeout(location.reload.bind(location), 1500);
            },
            error: function (data) {
              let resultDiv = document.getElementById(
                `${dataGlobal.type}-update-result`
              );
              resultDiv.classList = "";
              resultDiv.innerText =
                "Some Error in deleting the Event, Please try again later";
              resultDiv.classList.add("alert", "alert-danger");
              event.target.disabled = false;
              event.target.innerHTML = oldHtml;
            },
          });
          deleteModal.hide();
        });
      }

      const deleteOneButton = document.createElement("button");
      deleteOneButton.classList.add("btn", "btn-danger");
      deleteOneButton.textContent = "Delete one event";

      modalFooter.appendChild(deleteOneButton);

      deleteOneButton.addEventListener("click", async function () {
        let deleteUrl = "";
        if (dataGlobal.type === "meeting") {
          deleteUrl = `/meeting/${userIdGlobal}/${dataGlobal._id}`;
        } else if (dataGlobal.type === "reminder") {
          deleteUrl = `/reminder/${userIdGlobal}/reminder/${dataGlobal._id}`;
        } else if (dataGlobal.type === "task") {
          deleteUrl = `/task/${userIdGlobal}/${dataGlobal._id}`;
        } else if (dataGlobal.type === "notes") {
          deleteUrl = `/notes/${userIdGlobal}/${dataGlobal._id}`;
        }

        event.target.disabled = true;
        // Add the spinner to the button
        event.target.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
        // Delete one event
        await $.ajax({
          method: "DELETE",
          url: deleteUrl,
          success: function (data) {
            let resultDiv = document.getElementById(
              `${dataGlobal.type}-update-result`
            );
            resultDiv.classList = "";
            resultDiv.innerText =
              "Single Event Successfully delete, Page will reload now";
            resultDiv.classList.add("alert", "alert-success");
            event.target.disabled = false;
            event.target.innerHTML = oldHtml;
            setTimeout(location.reload.bind(location), 1500);
          },
          error: function (data) {
            let resultDiv = document.getElementById(
              `${dataGlobal.type}-update-result`
            );
            resultDiv.classList = "";
            resultDiv.innerText =
              "Some Error in deleting the Event, Please try again later";
            resultDiv.classList.add("alert", "alert-danger");
            event.target.disabled = false;
            event.target.innerHTML = oldHtml;
          },
        });
        deleteModal.hide();
      });
      deleteModal.show();
    });
  });
}

function validateStringInput(input, inputName) {
  if (input && typeof input !== "string") {
    throw new Error(`${inputName} must be a string`);
  } else if (input.trim().length === 0) {
    throw new Error(`${inputName} cannot be an empty string`);
  }
}

function validateDateTime(date) {
  try {
    validateStringInput(date);
  } catch (e) {
    return false;
  }
  if (!dayjs(date, "YYYY-MM-DDTHH:mm", true).isValid()) {
    return false;
  }
  return true;
}
function CheckboxEventListener() {
  document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
    checkbox.removeEventListener("click", () => {});
    checkbox.addEventListener("click", handleCheckboxClick);
  });
}

function draggable_event_cells() {
  let buttonList = document.querySelectorAll(".draggable-event-button");

  buttonList.forEach((button) => {
    button.removeEventListener("dragstart", () => {});
    button.addEventListener("dragstart", function (event) {
      let dataset = JSON.stringify(event.target.dataset);
      event.dataTransfer.setData("application/json", dataset);
    });
  });
}

function handleCheckboxClick(event) {
  let checkbox = event.target;
  let taskId = checkbox.getAttribute("data-bs-eventId");
  let userId = checkbox.getAttribute("data-bs-userId");
  let isChecked = checkbox.checked;
  $.ajax({
    method: "PUT",
    url: `/task/${userId}/${taskId}/${isChecked}`,
    success: function (data) {
      if (isChecked) {
        alert("Task is marked Complete");
      }
      if (!isChecked) {
        alert("Task is marked Incomplete");
      }
      setPageUrlForSelectedDateCell();
    },
    error: function (data) {
      checkbox.checked = false;
      alert(
        data?.responseJSON?.error || "Some error occured while marking task"
      );
    },
  });
}
function simulateTdCellClick() {
  const params = new URLSearchParams(window.location.search);
  const tdClass = params.get("selectedDateCell");

  // Get the td element by its ID
  const td = document.querySelector(`[data-bs-day="${tdClass}"]`);
  console.log(td);
  // Simulate a click event on the td element
  if (td) {
    td.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
}
function setPageUrlForSelectedDateCell(
  selectedDate = selectedDateCell,
  redirect = true
) {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("selectedDateCell")) {
    urlParams.set("selectedDateCell", selectedDate);
  } else {
    urlParams.append("selectedDateCell", selectedDate);
  }

  // Append the new query parameter to the existing URL
  const newUrl =
    window.location.origin +
    window.location.pathname +
    "?" +
    urlParams.toString();

  // Navigate to the new URL
  if (redirect) {
    window.location.href = newUrl;
  } else {
    history.pushState(null, "", newUrl);
  }
}

submitMeetingForm();
submitReminderForm();
submitTaskForm();
submitNotesForm();

bindEventButtontoModal();

enableMeetingFormEdit();
enableTaskFormEdit();
enableReminderFormEdit();
enableNotesFormEdit();

onMeetingModalClose();
onTaskModalClose();
onReminderModalClose();
onNotesModalClose();

miniCalendarLoader();

clickableDateCells();

updateAllCheckBoxTogglerMeeting();
repeatingCheckBoxTogglerReminder();
repeatingCheckBoxTogglerMeeting();

draggable_event_cells();
CheckboxEventListener();
deleteButton();

filterForm();
simulateTdCellClick();
