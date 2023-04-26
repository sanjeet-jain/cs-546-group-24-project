let dataGlobal;
let userIdGlobal;
function populateMeetingsModal(userId, meetingId) {
  $.ajax({
    method: "GET",
    url: `/meeting/${userId}/${meetingId}`,
    success: function (data) {
      dataGlobal = data;
      userIdGlobal = userId;

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
      resultDiv = document.getElementById("meeting-update-result");
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
    url: `/task/${taskId}`,
    success: function (data) {
      dataGlobal = data;
      userIdGlobal = userId;

      let event_modal = document.getElementById("modal-task-display");

      // event_modal.querySelector("#modal-task-label.modal-title").innerText =
      //   data.title;
      event_modal.querySelector("input#task_title").value = data.title;
      event_modal.querySelector("input#task_textBody").value = data.textBody;
      event_modal.querySelector("input#task_tag").value = data.tag;
      event_modal.querySelector("select#task_priority").value = data.priority;
      // issue with date time coming as a date string
      // it needs an iso string
      event_modal.querySelector("input#task_dateAddedTo").value =
        data.dateAddedTo;
    },
    error: function (data) {
      resultDiv = document.getElementById("task-update-result");
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

      let event_modal = document.getElementById("modal-notes-display");

      event_modal.querySelector("input#notes_title").value = data.title;
      event_modal.querySelector("input#notes_tag").value = data.tag;
      event_modal.querySelector("input#notes_dateAddedTo").value =
        data.dateAddedTo;
      tinymce.get("notes_editor").setContent(data.textBody);
    },
    error: function (data) {
      resultDiv = document.getElementById("notes-update-result");
      resultDiv.classList = "";
      resultDiv.innerText =
        data?.responseJSON?.error || "Update wasnt Successful";
      resultDiv.classList.add("alert", "alert-danger");
    },
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
    } else {
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
  editButtons = event_modal.querySelectorAll("button.btn-edit");
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
  editButtons = event_modal.querySelectorAll("button.btn-edit");
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
  editButtons = event_modal.querySelectorAll("button.btn-edit");
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
  modalCloseButtons = event_modal.querySelectorAll('[data-bs-dismiss="modal"]');
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      let fieldset = event_modal.querySelector("#meeting-form-enabler");
      fieldset.disabled = true;
      // event_modal.querySelector("#modal-meeting-label.modal-title").innerText =
      //   "";
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
      resultDiv = document.getElementById("meeting-update-result");
      resultDiv.classList = "";
      resultDiv.innerText = "";
      dataGlobal = undefined;
    });
  });
}

function onReminderModalClose() {
  let event_modal = document.getElementById("modal-reminder-display");
  modalCloseButtons = event_modal.querySelectorAll('[data-bs-dismiss="modal"]');
  let reminderForm = document.getElementById("reminder-form");
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      let fieldset = event_modal.querySelector("#reminder-form-enabler");
      fieldset.disabled = true;
      // event_modal.querySelector("#modal-reminder-label.modal-title").innerText =
      //   "";
      event_modal.querySelector("input#reminder_title").value = "";
      event_modal.querySelector("input#reminder_textBody").value = "";
      event_modal.querySelector("input#reminder_tag").value = "";
      event_modal.querySelector("select#reminder_priority").value = "";
      event_modal.querySelector("input#reminder_dateAddedTo").value = "";
      event_modal.querySelector("input#reminder_repeating").value = "";
      event_modal.querySelector("input#reminder_repeating").checked = false;
      event_modal.querySelector("select#reminder_repeatingIncrementBy").value =
        "";
      event_modal.querySelector("input#reminder_endDateTime").value = "";
      resultDiv = document.getElementById("reminder-update-result");
      resultDiv.classList = "";
      resultDiv.innerText = "";
      reminderForm.classList.remove("was-validated");
      reminderForm.dateAddedTo.setCustomValidity("");
      reminderForm.endDateTime.setCustomValidity("");
      reminderForm.title.setCustomValidity("");
      reminderForm.textBody.setCustomValidity("");
      dataGlobal = undefined;
    });
  });
}

function onTaskModalClose() {
  let event_modal = document.getElementById("modal-task-display");
  modalCloseButtons = event_modal.querySelectorAll('[data-bs-dismiss="modal"]');
  //let taskForm = document.getElementById("task-form");
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      let fieldset = event_modal.querySelector("#task-form-enabler");
      fieldset.disabled = true;
      event_modal.querySelector("input#task_title").value = "";
      event_modal.querySelector("input#task_textBody").value = "";
      event_modal.querySelector("input#task_tag").value = "";
      event_modal.querySelector("select#task_priority").value = "";
      event_modal.querySelector("input#task_dateAddedTo").value = "";
      resultDiv = document.getElementById("task-update-result");
      resultDiv.classList = "";
      resultDiv.innerText = "";
      dataGlobal = undefined;
    });
  });
}

function onNotesModalClose() {
  let event_modal = document.getElementById("modal-notes-display");
  modalCloseButtons = event_modal.querySelectorAll('[data-bs-dismiss="modal"]');
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", function () {
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
      resultDiv = document.getElementById("notes-update-result");
      resultDiv.classList = "";
      resultDiv.innerText = "";
      resultDiv.innerHtml = "";
      dataGlobal = undefined;
    });
  });
}

function submitMeetingForm() {
  meetingform = document.getElementById("meeting-form");
  meetingform.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      let formData = new FormData(event.target);
      let jsonData = {};
      for (var [key, value] of formData.entries()) {
        jsonData[key] = value.trim();
      }
      if (jsonData["repeating"] === undefined) {
        jsonData["repeating"] = false;
      }
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
            resultDiv = document.getElementById("meeting-update-result");
            resultDiv.innerText =
              "Meeting updated Successfully! Please refresh the page!";
            resultDiv.classList = "";
            resultDiv.classList.add("alert", "alert-success");
            // if status code 200 update modal
            populateMeetingsModal(data.userId, data.meetingId);
            setTimeout(location.reload.bind(location), 5000);
          },
          error: function (data) {
            resultDiv = document.getElementById("meeting-update-result");
            resultDiv.classList = "";
            resultDiv.innerText =
              data?.responseJSON?.error || "Update wasnt Successful";
            resultDiv.classList.add("alert", "alert-danger");
            meeting_title_error = document.getElementById(
              "meeting_title_error"
            );
            meeting_textBody_error = document.getElementById(
              "meeting_textBody_error"
            );
            meeting_tag_error = document.getElementById("meeting_tag_error");
            meeting_dateAddedTo_error = document.getElementById(
              "meeting_dateAddedTo_error"
            );
            meeting_dateDueOn_error = document.getElementById(
              "meeting_dateDueOn_error"
            );
            meeting_repeatingCounterIncrement_error = document.getElementById(
              "meeting_repeatingCounterIncrement_error"
            );
            meeting_repeatingIncrementBy_error = document.getElementById(
              "meeting_repeatingIncrementBy_error"
            );
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
          },
        });
      }

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
      event.preventDefault();
      event.stopPropagation();
      let formData = new FormData(event.target);
      let jsonData = {};
      for (let [key, value] of formData.entries()) {
        jsonData[key] = value.trim();
      }
      if (jsonData["repeating"] === undefined) {
        jsonData["repeating"] = false;
      }
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
            resultDiv.innerText =
              "Reminder Updated Successfully! Please refresh the page!";
            resultDiv.classList.add("alert", "alert-success");

            setTimeout(location.reload.bind(location), 5000);
          },
          error: function (data) {
            resultDiv.classList = "";
            resultDiv.innerText = data?.responseJSON?.error;
            resultDiv.classList.add("alert", "alert-danger");
          },
        });
      }
      event.target.classList.add("was-validated");
    },
    false
  );
}

function submitTaskForm() {
  taskform = document.getElementById("task-form");
  taskform.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      let formData = new FormData(event.target);
      let jsonData = {};
      for (var [key, value] of formData.entries()) {
        jsonData[key] = value.trim();
      }
      let reqType = "PUT";
      let ajaxURL = `/task/${dataGlobal?._id}`;
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
            let resultDiv = document.getElementById("task-update-result");
            resultDiv.innerText =
              "Task updated Successfully! Please refresh the page!";
            resultDiv.classList = "";
            resultDiv.classList.add("alert", "alert-success");
            // if status code 200 update modal
            populateTasksModal(userIdGlobal, data._id);
            setTimeout(location.reload.bind(location), 5000);
          },
          error: function (data) {
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
            task_title_error.innerText =
              data.responseJSON?.errorMessages?.title || "";
            task_textBody_error.innerText =
              data.responseJSON?.errorMessages?.textBody || "";
            task_tag_error.innerText =
              data.responseJSON?.errorMessages?.tag || "";
            task_dateAddedTo_error.innerText =
              data.responseJSON?.errorMessages?.dateAddedTo || "";
          },
        });
      }

      event.target.classList.add("was-validated");
    },
    false
  );
}

function submitNotesForm() {
  notesform = document.getElementById("notes-form");
  notesform.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      let formData = new FormData(event.target);
      let jsonData = {};
      for (var [key, value] of formData.entries()) {
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
            resultDiv = document.getElementById("notes-update-result");
            resultDiv.innerText =
              "notes updated Successfully! Page will refresh automatically";
            resultDiv.classList = "";
            resultDiv.classList.add("alert", "alert-success");
            // if status code 200 update modal
            // populateNotesModal(data.userId, data.notesId);

            setTimeout(location.reload.bind(location), 2000);
          },
          error: function (data) {
            resultDiv = document.getElementById("notes-update-result");
            resultDiv.classList = "";
            resultDiv.innerText =
              data?.responseJSON?.error || "Update wasnt Successful";
            resultDiv.classList.add("alert", "alert-danger");
            notes_title_error = document.getElementById("notes_title_error");
            notes_editor_error = document.getElementById("notes_editor_error");
            notes_tag_error = document.getElementById("notes_tag_error");
            notes_dateAddedTo_error = document.getElementById(
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
    plugins: "lists, link, image, media wordcount fullscreen",
    toolbar:
      " fullscreen h1 h2 bold italic strikethrough blockquote bullist numlist backcolor  link image media  removeformat",
    // menubar: true,
    readonly: true,

    setup: function (editor) {
      editor.on("change", function (e) {
        var maxChars = 200;
        var currentContentLength = editor.getContent({ format: "text" }).length;

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
    file_picker_types: "file image media",
    /* and here's our custom image picker*/

    file_picker_callback: function (cb, value, meta) {
      var input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*,application/pdf"); // accept both images and PDFs

      input.onchange = function () {
        var file = this.files[0];

        var formData = new FormData();
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
      dataGlobal = undefined;
      userIdGlobal = userId;
      break;
    default:
      break;
  }
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
  meeting_title_error.innerText = "";
  meeting_textBody_error.innerText = "";
  meeting_tag_error.innerText = "";
  meeting_dateAddedTo_error.innerText = "";
  meeting_dateDueOn_error.innerText = "";
  meeting_repeatingCounterIncrement_error.innerText = "";
  meeting_repeatingIncrementBy_error.innerText = "";
  form.tag.setCustomValidity("");
  form.title.setCustomValidity("");
  form.dateAddedTo.setCustomValidity("");
  form.dateDueOn.setCustomValidity("");
  form.repeating.setCustomValidity("");
  form.repeatingIncrementBy.setCustomValidity("");
  form.repeatingCounterIncrement.setCustomValidity("");

  if (form.tag.value.length > 20) {
    meeting_tag_error.innerText = "tag cant be longer than 20 characters";
    form.tag.setCustomValidity("error");
  }
  if (!form.tag.value.match(/^[a-z]+$/)) {
    meeting_tag_error.innerText = "tag has only letters with no spaces";
    form.tag.setCustomValidity("error");
  }

  if (form.title.value.length > 100) {
    meeting_title_error.innerText = "Title cant be longer than 100 characters";
    form.title.setCustomValidity("error");
  }

  if (form.textBody.value.length > 200) {
    meeting_textBody_error.innerText =
      "TextBody cant be longer than 200 characters";
    form.textBody.setCustomValidity("error");
  }

  if (form.dateAddedTo.value !== "" && form.dateDueOn.value !== "") {
    if (dayjs(form.dateDueOn.value).diff(dayjs(form.dateAddedTo.value)) < 0) {
      form.dateAddedTo.setCustomValidity("invalid_range");
      form.dateDueOn.setCustomValidity("invalid_range");
      meeting_dateDueOn_error.innerText =
        "Date Due to must be after date Due On";
      meeting_dateAddedTo_error.innerText =
        "Date Added to must be before date Due On";
    } else {
      form.dateAddedTo.setCustomValidity("");
      form.dateDueOn.setCustomValidity("");
    }
  }
  if (form.repeating.checked) {
    if (form.repeatingCounterIncrement.value < 0) {
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
  if (!form.tag.value.match(/^[a-z]+$/)) {
    notes_tag_error.innerText = "tag has only letters with no spaces";
    form.tag.setCustomValidity("error");
  }

  if (form.title.value.length > 100) {
    notes_title_error.innerText = "Title cant be longer than 100 characters";
    form.title.setCustomValidity("error");
  }

  if (form.dateAddedTo.value.length > 200) {
    notes_textBody_error.innerText =
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
  let repeatingIncrementBy_error = document.getElementById(
    "reminder_repeatingIncrementBy_error"
  );

  let reminder_endDateTime_error = document.getElementById(
    "reminder_endDateTime_error"
  );
  form.textBody.setCustomValidity("");
  form.tag.setCustomValidity("");
  form.title.setCustomValidity("");
  form.dateAddedTo.setCustomValidity("");
  if (form.tag.value.length > 20) {
    reminder_tag_error.innerText = "tag cant be longer than 20 characters";
    form.tag.setCustomValidity("error");
  }
  if (!form.tag.value.match(/^[a-z]+$/)) {
    reminder_tag_error.innerText = "tag has only letters with no spaces";
    form.tag.setCustomValidity("error");
  }

  if (form.title.value.length > 100) {
    reminder_title_error.innerText = "Title cant be longer than 100 characters";
    form.title.setCustomValidity("error");
  }

  if (form.textBody.value.length > 200) {
    reminder_textBody_error.innerText =
      "TextBody cant be longer than 200 characters";
    form.textBody.setCustomValidity("error");
  }
  if (!dayjs(form.dateAddedTo.value).isValid()) {
    reminder_dateAddedTo_error.innerText = "The date added should be valid";
    form.dateAddedTo.setCustomValidity("date added to can't be invalid");
  } else {
    form.dateAddedTo.setCustomValidity("");
  }

  if (form.repeating.value === "true") {
    if (!dayjs(form.endDateTime.value).isValid()) {
      reminder_endDateTime_error.innerText =
        "The end recurrence date should be valid";
      form.endDateTime.setCustomValidity("Error");
    }
    if (
      dayjs(form.dateAddedTo.value).isValid() &&
      dayjs(form.endDateTime.value).isValid() &&
      dayjs(form.dateAddedTo.value) > dayjs(form.endDateTime.value)
    ) {
      reminder_endDateTime_error.innerText =
        "End Date must be after date added to";
      reminder_dateAddedTo_error.innerText =
        "Date Added to must be before date Due On";
      form.dateAddedTo.setCustomValidity("Error");
      form.endDateTime.setCustomValidity("Error");
    } else {
      form.dateAddedTo.setCustomValidity("");
      form.endDateTime.setCustomValidity("");
    }
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

  if (form.title.value.length > 100) {
    task_title_error.innerText = "Title can't be longer than 100 characters";
  }

  if (form.textBody.value.length > 200) {
    task_textBody_error.innerText = "Text can't be longer than 100 characters";
  }
  if (form.tag.value.length > 20) {
    task_tag_error.innerText = "Tag can't be longer than 20 characters";
  }

  if (!dayjs(form.dateAddedTo.value).isValid()) {
    task_dateAddedTo_error.innerText = "The date added should be valid";
    form.dateAddedTo.setCustomValidity("date added to can't be invalid");
  } else {
    form.dateAddedTo.setCustomValidity("");
  }

  if (form.checkValidity()) {
    return true;
  } else return false;
}
function clickableDateCells() {
  let dateCells = document.querySelectorAll("td.date-cell");
  dateCells.forEach((date) => {
    date.addEventListener("click", (event) => {
      eventTarget = event.target.closest("td");
      let selectedDate = eventTarget.attributes["data-bs-day"]?.value;
      setDatepickerValue(selectedDate);
      // let selected_date_div = document.getElementById("selected_date");
      // selected_date_div.innerText = `Items for
      // ${dayjs(selectedDate).format("MMMM DD YYYY")}`;
      // $.ajax({
      //   method: "GET",
      //   url: `/calendar/getSelectedDayItems/${selectedDate}`,
      //   success: function (data) {
      //     userIdGlobal = data.userId;
      //     loadRightPaneCells(data);
      //   },
      // });
    });
  });
}
function loadRightPaneCells(data) {
  let events = data.selectedDayItems.sort((a, b) => {
    if (a.priority > b.priority) {
      return -1;
    }
    if (a.priority < b.priority) {
      return 1;
    }
    return 0;
  });

  display_current_items_div = document.getElementById("display_current_items");
  display_current_items_div.innerHtml = "";
  display_current_items_div.innerText = "";

  //what if no events ?
  if (events.length === 0) {
    display_current_items_div.innerText = "There are no events for the day";
    return;
  }
  events.forEach((event) => {
    let eventDiv = document.createElement("div");
    eventDiv.classList.add("d-grid", "gap-1");
    let eventButton = document.createElement("button");
    let logoClass = "";
    let buttonClass = "";
    if (event.type === "meeting") {
      logoClass = "bi-calendar-event";
      buttonClass = "text-bg-primary";
    } else if (event.type === "reminder") {
      logoClass = "bi-alarm";
      buttonClass = "text-bg-warning";
    } else if (event.type === "task") {
      logoClass = "bi-check2-square";
      buttonClass = "text-bg-danger";
    } else if (event.type === "notes") {
      logoClass = "bi-file-text";
      buttonClass = "text-bg-success";
    }

    eventButton.classList.add(
      "badge",
      "event-pill",
      buttonClass,
      "text-wrap",
      "text-center",
      "event-button"
    );
    eventButton.setAttribute("data-bs-toggle", "modal");
    eventButton.setAttribute("data-bs-target", `#modal-${event.type}-display`);
    eventButton.setAttribute("data-bs-eventId", `${event._id}`);
    eventButton.setAttribute("data-bs-userId", `${data.userId}`);
    eventButton.setAttribute("data-bs-event-type", `${event.type}`);
    let logo = document.createElement("i");

    // add for other events
    logo.classList.add(logoClass);
    logo.innerText = `${event.title}`;
    eventButton.appendChild(logo);
    // add an eventlistener
    eventButton.addEventListener(
      "click",
      (clickEvent) => {
        populateBasedOnEventType(clickEvent.target);
      },
      false
    );
    eventDiv.appendChild(eventButton);
    display_current_items_div.appendChild(eventDiv);
  });
}

function miniCalendarLoader() {
  $("#datepickerContainer")
    .datepicker({
      format: "yyyy-mm-dd",
      autoclose: true,
      todayHighlight: true,
    })
    .on("changeDate", function (e) {
      let selected_date_div = document.getElementById("selected_date");
      selected_date_div.innerText = `Items for
      ${dayjs(e.date).format("MMMM DD YYYY")}`;
      $.ajax({
        method: "GET",
        url: `/calendar/getSelectedDayItems/${e.date}`,
        success: function (data) {
          userIdGlobal = data.userId;
          loadRightPaneCells(data);
        },
      });
    });
}

function setDatepickerValue(date) {
  $("#datepickerContainer").datepicker("setDate", date);
}

function filterForm() {
  filterFormElement = document.getElementById("filterForm");
  const checkboxes = filterFormElement.querySelectorAll(
    '.dropdown-menu input[type="checkbox"]'
  );

  filterFormElement.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    let formData = new FormData(event.target);
    const filter = {
      eventTypeSelected: [],
      tagsSelected: [],
    };
    for (var [key, value] of formData.entries()) {
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

filterForm();

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

repeatingCheckBoxTogglerReminder();
repeatingCheckBoxTogglerMeeting();
