function validatepassword(event) {
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
  let oldPassVal = document.getElementById("oldPassword").value;
  let newPassVal = document.getElementById("newPassword").value;
  let reEnterNewVal = document.getElementById("reEnterNewPassword").value;
  let passwordForm = document.getElementById("password-form");
  let password_error = document.getElementById("password_error");
  let newPassword_error = document.getElementById("newPassword_error");
  let reenter_error = document.getElementById("reenter_error");

  console.log(oldPassVal);
  if (
    !oldPassVal ||
    oldPassVal == null ||
    oldPassVal == undefined ||
    oldPassVal.trim().length === ""
  ) {
    password_error.innerText = "Please enter current password.";
  } else if (
    !newPassVal ||
    newPassVal == null ||
    newPassVal == undefined ||
    newPassVal.trim().length === ""
  ) {
    newPassword_error.innerText = "Please enter a new password.";
  } else if (
    !reEnterNewVal ||
    reEnterNewVal == null ||
    reEnterNewVal == undefined ||
    reEnterNewVal.trim().length === ""
  ) {
    reenter_error.innerText = "Please re-enter new password.";
  } else {
    passwordForm.submit();
  }
}
validatepassword();
