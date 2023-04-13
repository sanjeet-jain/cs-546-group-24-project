function validatepassword() {
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
  let oldPassInput = event.target.oldPassword;
  let newPassInput = event.target.newPassword;
  let reEnterInput = event.target.reEnterNewPassword;

  let passwordForm = event.target;
  let oldPassword_error = document.getElementById("oldPassword_error");
  let newPassword_error = document.getElementById("newPassword_error");
  let reEnterNewPassword_error = document.getElementById(
    "reEnterNewPassword_error"
  );

  if (!validateNewPassword(newPassInput.value)) {
    console.log(newPassInput.value);
    newPassword_error.innerText =
      "Password must be at least 8 characters, contain at least one uppercase letter, and one digit.";
  } else {
    newPassword_error.innerText = "";
    newPassInput.validity.patternMismatch = true;
  }
  if (!confirmNewPassword(newPassInput.value, reEnterInput.value)) {
    reEnterNewPassword_error.innerText =
      "Re-Entered password does not match new password.";
  } else {
    reEnterNewPassword_error.innerText = "";
    reEnterInput.validity.patternMismatch = true;
  }
  if (newPassInput.checkValidity() && reEnterInput.checkValidity()) {
    passwordForm.submit();
  }
}
function validateNewPassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
}
function confirmNewPassword(newPassword, reEnter) {
  if (newPassword !== reEnter) {
    return false;
  } else {
    return true;
  }
}
validatepassword();
