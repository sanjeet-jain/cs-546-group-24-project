function validatesignup(event) {
  var forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
          form.submit();
        } else {
          checkValidations();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
}

function checkValidations() {
  let emailInput = document.getElementById("email");
  let passwordInput = document.getElementById("password");
  let firstNameInput = document.getElementById("first_name");
  let lastNameInput = document.getElementById("last_name");
  let dob = document.getElementById("dob");
  let passForm = document.getElementById("signup-form");

  let emailVal = emailInput.value;
  let passwordVal = passwordInput.value;

  let email_error = document.getElementById("email_error");
  let password_error = document.getElementById("password_error");
  let firstName_error = document.getElementById("first_name_error");
  let lastName_error = document.getElementById("last_name_error");
  let date_error = document.getElementById("date_error");

  if (!validateEmail(emailVal)) {
    email_error.innerText = "Please enter a valid email.";
    emailInput.setCustomValidity("Invalid");
  } else {
    email_error.innerText = "";
    emailInput.setCustomValidity("");
  }

  if (!validatePassword(passwordVal)) {
    password_error.innerText =
      "Password must be at least 8 characters, contain at least one uppercase letter, and one digit.";
    passwordInput.setCustomValidity("Invalid");
  } else {
    password_error.innerText = "";
    passwordInput.setCustomValidity("");
  }

  if (!validateName(firstNameInput.value)) {
    firstName_error.innerText = "Please enter a valid first name.";
    firstNameInput.setCustomValidity("Invalid");
  } else {
    firstName_error.innerText = "";
    firstNameInput.setCustomValidity("");
  }

  if (!validateName(lastNameInput.value)) {
    lastName_error.innerText = "Please enter a valid last name.";
    lastNameInput.setCustomValidity("Invalid");
  } else {
    lastName_error.innerText = "";
    lastNameInput.setCustomValidity("");
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
  dob.setCustomValidity(date_error.textContent);
  if (
    emailInput.checkValidity() &&
    passwordInput.checkValidity() &&
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
    /^[a-zA-Z]+[._%+-]*[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const passwordRegex = /^(?=.\d)(?=.[A-Z]).{8,}$/;
  return passwordRegex.test(password);
}

function validateName(name) {
  const nameRegex = /^[a-zA-Z]+$/;
  return nameRegex.test(name);
}

validatesignup();
