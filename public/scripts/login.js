function validatelogin(event) {
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
  let usernameVal = document.getElementById("emailId").value;
  let passwordVal = document.getElementById("password").value;
  let passForm = document.getElementById("login-form");
  let password_error = document.getElementById("password_error");
  let email_error = document.getElementById("email_error");

  if (
    !usernameVal ||
    usernameVal == null ||
    usernameVal == undefined ||
    usernameVal.trim().length === ""
  ) {
    email_error.innerText = "Please enter an email.";
  } else if (
    !passwordVal ||
    passwordVal == null ||
    passwordVal == undefined ||
    passwordVal.trim().length == ""
  ) {
    password_error.innerText = "Please enter a password.";
  } else if (passwordVal.length < 9) {
    password_error.innerText = "Password must be more than 9 characters.";
  } else {
    passForm.submit();
  }
  return;
}
validatelogin();
