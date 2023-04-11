function viewRadioButtons() {
  const form = document.getElementById("viewRadioForm");
  const radioButtons = form.elements["viewBtnRadio"];
  form.method = "get";

  // Change the form action and method
  for (let i = 0; i < radioButtons.length; i++) {
    radioButtons[i].addEventListener("change", () => {
      const selectedValue = radioButtons[i].value;
      if (selectedValue === "month") {
        form.action = "/calendar/month";
      } else if (selectedValue === "week") {
        form.action = "/calendar/week";
      } else if (selectedValue === "day") {
        form.action = "/calendar/day";
      }
      form.submit();
    });
  }
}

viewRadioButtons();
