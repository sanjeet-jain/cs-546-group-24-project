function populateMeetingsModal(data) {
  let event_modal = document.getElementById("modal-event-display");
  let title_logo_class = "";
  let modal_title = "";

  event_modal.querySelector("#modal-label.modal-title").innerText = data.title;
  event_modal.querySelector("input#title").value = data.title;
}
