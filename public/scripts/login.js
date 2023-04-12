function validatelogin(event) {
  var forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();
        event.stopPropagation();
        checkValidations();

        if (form.checkValidity()) {
          form.submit();
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
  let emailVal = emailInput.value;
  let passwordVal = passwordInput.value;
  let email_error = document.getElementById("email_error");
  let password_error = document.getElementById("password_error");
  let passForm = document.getElementById("login-form");

  if (
    !emailVal ||
    emailVal.trim().length === "" ||
    emailVal == null ||
    emailVal == undefined
  ) {
    email_error.innerText = "Please enter an email.";
    emailInput.setCustomValidity("Invalid");
  } else if (!validateEmail(emailVal)) {
    email_error.innerText = "Please enter a valid email.";
    emailInput.setCustomValidity("Invalid");
  } else {
    email_error.innerText = "";
    emailInput.setCustomValidity("");
  }

  if (
    !passwordVal ||
    passwordVal.trim().length === "" ||
    passwordVal == null ||
    passwordVal == undefined
  ) {
    password_error.innerText = "Please enter a password.";
    passwordInput.setCustomValidity("Invalid");
  } else if (passwordVal.length < 8) {
    password_error.innerText = "Password must be at least 9 characters.";
    passwordInput.setCustomValidity("Invalid");
  } else {
    password_error.innerText = "";
    passwordInput.setCustomValidity("");
  }
  if (emailInput.checkValidity() && passwordInput.checkValidity()) {
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

validatelogin();
