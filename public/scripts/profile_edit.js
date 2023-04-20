function validateEdits(event) {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();
        event.stopPropagation();
        checkValidations(event);

        form.classList.add("was-validated");
      },
      false
    );
  });
}
function checkValidations(event) {
  let firstNameInput = event.target.first_name;
  let lastNameInput = event.target.last_name;
  let emailInput = event.target.email;
  let dob = event.target.dob;

  let passForm = event.target;
  let disabilityInput = event.target.disability;

  let first_name_error = document.getElementById("first_name_error");
  let last_name_error = document.getElementById("last_name_error");
  let email_error = document.getElementById("email_error");
  let date_error = document.getElementById("date_error");
  let disability_error = document.getElementById("disability_error");

  let profileForm = document.getElementById("edit-form");
  if (!validateEmail(emailInput.value)) {
    email_error.innerText = "Please enter a valid email.";
  } else {
    email_error.innerText = "";
  }
  if (!validate_name(firstNameInput.value)) {
    first_name_error.innerText = "Please enter a valid first name.";
  } else {
    first_name_error.innerText = "";
  }
  if (!validate_name(lastNameInput.value)) {
    last_name_error.innerText = "Please enter a valid last name.";
  } else {
    last_name_error.innerText = "";
  }
  if (dob.validity.valueMissing) {
    date_error.textContent = "Please enter a date of birth.";
  } else if (dob.validity.rangeUnderflow) {
    date_error.textContent = "You cannot be more than 150 years old to signup!";
  } else if (dob.validity.rangeOverflow) {
    date_error.textContent = "You must be at least 13 years old to signup!";
  } else {
    date_error.textContent = "";
  }
  if (
    emailInput.checkValidity() &&
    firstNameInput.checkValidity() &&
    lastNameInput.checkValidity() &&
    dob.checkValidity()
  ) {
    passForm.submit();
  }
  return;
}
function validateEmail(email) {
  const emailRegex =
    /^[a-zA-Z]+[\._%+\-]*[a-zA-Z0-9]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
function validate_name(name) {
  const nameRegex = /^[a-zA-Z]+$/;
  return nameRegex.test(name);
}
validateEdits();
