function validateedits(event) {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          checkValidations();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
}
function checkValidations() {
  let first_name = document.getElementById("first_name").value;
  let last_name = document.getElementById("last_name").value;
  let email = document.getElementById("email").value;
  let dob = document.getElementById("dob").value;
  let disability = document.getElementById("disability").value;

  let first_name_error = document.getElementById("first_name_error");
  let last_name_error = document.getElementById("last_name_error");
  let email_error = document.getElementById("email_error");
  let dob_error = document.getElementById("dob_error");
  let disability_error = document.getElementById("disability_error");

  let profileForm = document.getElementById("edit-form");
  console.log(document);
  if (
    !first_name ||
    first_name == null ||
    first_name == undefined ||
    first_name.trim().length === ""
  ) {
    first_name_error.innerText = "Please enter a first name.";
  } else if (
    !last_name ||
    last_name == null ||
    last_name == undefined ||
    last_name.trim().length === ""
  ) {
    last_name_error.innerText = "Please enter a last name.";
  } else if (
    !email ||
    email == null ||
    email == undefined ||
    email.trim().length === ""
  ) {
    email_error.innerText = "Please enter an email.";
  } else if (
    !dob ||
    dob == null ||
    dob == undefined ||
    dob.trim().length === ""
  ) {
    dob_error.innerText = "Please enter a date of birth.";
  } else if (
    !disability ||
    disability == null ||
    disability == undefined ||
    disability.trim().length === ""
  ) {
    disability_error.innerText = "Invalid Disability Value";
  } else {
    profileForm.submit();
  }
}
const spans = document.querySelectorAll(".editable");
spans.forEach((span) => {
  span.addEventListener("click", function () {
    const value = this.textContent.trim();
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("value", value);
    this.textContent = "";
    this.appendChild(input);
    input.focus();

    input.addEventListener("blur", function () {
      const newValue = this.value.trim();
      const field = this.parentElement.dataset.field;
      if (newValue === "" || !newValue) {
        this.parentElement.textContent = value;
      } else {
        this.parentElement.textContent = newValue;
        document.querySelector(`[name="${field}"]`).value = newValue;
      }
    });
  });
});
validateedits();
