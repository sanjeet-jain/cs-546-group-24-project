function validatesignup(event) {
  var forms = document.querySelectorAll(".needs-validation");

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
  let emailInput = event.target.email;
  let passwordInput = event.target.password;
  let firstNameInput = event.target.first_name;
  let lastNameInput = event.target.last_name;
  let dob = event.target.dob;
  let consent = event.target.consent;
  let passForm = event.target;

  let email_error = document.getElementById("email_error");
  let password_error = document.getElementById("password_error");
  let firstName_error = document.getElementById("first_name_error");
  let lastName_error = document.getElementById("last_name_error");
  let date_error = document.getElementById("date_error");
  let consent_error = document.getElementById("consent_error");

  if (!validateEmail(emailInput.value)) {
    email_error.innerText = "Please enter a valid email.";
  } else {
    email_error.innerText = "";
  }

  if (!validatePassword(passwordInput.value)) {
    password_error.innerText =
      "Password must be at least 8 characters, contain at least one uppercase letter, and one digit.";
  } else {
    password_error.innerText = "";
  }

  if (!validateName(firstNameInput.value)) {
    firstName_error.innerText = "Please enter a valid first name.";
  } else {
    firstName_error.innerText = "";
  }

  if (!validateName(lastNameInput.value)) {
    lastName_error.innerText = "Please enter a valid last name.";
  } else {
    lastName_error.innerText = "";
  }
  if (!consent.value !== "true") {
    consent_error.innerText = "Please consent to data collection";
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
    passwordInput.checkValidity() &&
    firstNameInput.checkValidity() &&
    lastNameInput.checkValidity() &&
    dob.checkValidity() &&
    consent.checkValidity()
  ) {
    passForm.submit();
  }

  return;
}

function validateEmail(email) {
  const emailRegex =
    /^[a-zA-Z]+[._%+-]*[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
}

function validateName(name) {
  const nameRegex = /^[a-zA-Z]{1,20}$/;
  return nameRegex.test(name);
}

validatesignup();
