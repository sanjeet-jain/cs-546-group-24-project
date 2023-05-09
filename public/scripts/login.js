function validatelogin() {
  let form = document.querySelector("#login-form");

  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (checkValidations(event)) {
        event.target.submit();
      }
    },
    false
  );
}

function checkValidations(event) {
  let emailInput = event.target.email;
  let passwordInput = event.target.password;

  let email_error = document.getElementById("email_error");
  let password_error = document.getElementById("password_error");
  let passForm = event.target;

  if (!validateEmail(emailInput.value)) {
    email_error.innerText = "Please enter a valid email.";
  } else {
    email_error.innerText = "";
  }

  if (!validatePassword(passwordInput.value)) {
    password_error.innerText =
      "Password must be at least 8 characters, contain at least one uppercase letter, digit and one special character (!@#$%^&_=+.).";
  } else {
    password_error.innerText = "";
    passwordInput.validity.patternMismatch = true;
  }
  if (
    passForm.checkValidity() &&
    emailInput.checkValidity() &&
    passwordInput.checkValidity()
  ) {
    return true;
  }
  return true;
}

function validateEmail(email) {
  const emailRegex =
    /^[a-zA-Z]+[\._%+\-]*[a-zA-Z0-9]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_=+.])[a-zA-Z\d!@#$%^&_=+.]{8,}$/;
  return passwordRegex.test(password);
}

validatelogin();
