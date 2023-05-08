function validatepassword() {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  let forms = document.getElementById("password-form");

  // Loop over them and prevent submission

  forms.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (checkValidations(event)) {
        let formData = new FormData(event.target);
        let jsonData = {};
        for (let [key, value] of formData.entries()) {
          jsonData[key] = value.trim();
        }
        $.ajax({
          type: "POST",
          url: `/user/password`,
          data: jsonData,
          success: function (data, status, xhr) {
            alert("Password Change Successful");
            window.location.href = "/calendar/month";
          },
          error: function (data) {
            let oldPassInput = event.target.oldPassword;
            let newPassInput = event.target.newPassword;
            let reEnterInput = event.target.reEnterNewPassword;

            let oldPassword_error =
              document.getElementById("oldPassword_error");
            let newPassword_error =
              document.getElementById("newPassword_error");
            let reEnterNewPassword_error = document.getElementById(
              "reEnterNewPassword_error"
            );
            oldPassword_error.innerText = "";
            newPassword_error.innerText = "";
            reEnterNewPassword_error.innerText = "";

            oldPassInput.setCustomValidity("");
            newPassInput.setCustomValidity("");
            reEnterInput.setCustomValidity("");

            oldPassword_error.innerText =
              data?.responseJSON?.errorMessages?.oldPassword || "";
            newPassword_error.innerText =
              data?.responseJSON?.errorMessages?.newPassword || "";
            reEnterNewPassword_error.innerText =
              data?.responseJSON?.errorMessages?.reEnterNewPassword || "";

            oldPassInput.setCustomValidity(
              data?.responseJSON?.errorMessage?.oldPassword || ""
            );
            newPassInput.setCustomValidity(
              data?.responseJSON?.errorMessage?.newPassword || ""
            );
            reEnterInput.setCustomValidity(
              data?.responseJSON?.errorMessage?.reEnterNewPassword || ""
            );
          },
        });
      }

      forms.classList.add("was-validated");
    },
    false
  );
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
  oldPassword_error.innerText = "";
  newPassword_error.innerText = "";
  reEnterNewPassword_error.innerText = "";

  oldPassInput.setCustomValidity("");
  newPassInput.setCustomValidity("");
  reEnterInput.setCustomValidity("");

  if (!validateNewPassword(oldPassInput.value)) {
    oldPassword_error.innerText =
      "Password must be at least 8 characters, contain at least one uppercase letter, digit and one special character (!@#$%^&_=+.).";
  }
  if (!validateNewPassword(newPassInput.value)) {
    newPassword_error.innerText =
      "Password must be at least 8 characters, contain at least one uppercase letter, digit and one special character (!@#$%^&_=+.).";
  }
  if (!validateNewPassword(reEnterInput.value)) {
    reEnterNewPassword_error.innerText =
      "Password must be at least 8 characters, contain at least one uppercase letter, digit and one special character (!@#$%^&_=+.).";
  }
  if (!confirmNewPassword(newPassInput.value, reEnterInput.value)) {
    reEnterNewPassword_error.innerText =
      "Re-Entered password does not match new password.";
    reEnterInput.setCustomValidity("failed check");
  }
  if (!newCheckOld(newPassInput.value, oldPassInput.value)) {
    newPassword_error.innerText = "New password cannot match old password";
    newPassInput.setCustomValidity("passwords can't match");
  }
  if (passwordForm.checkValidity()) {
    //todo convert to ajax to show backend messages
    return true;
  }
  return false;
}
function validateNewPassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_=+.])[a-zA-Z\d!@#$%^&_=+.]{8,}$/;
  return passwordRegex.test(password);
}
function confirmNewPassword(newPassword, reEnter) {
  if (newPassword !== reEnter) {
    return false;
  } else {
    return true;
  }
}
function newCheckOld(newPassword, oldPassword) {
  if (newPassword === oldPassword) {
    return false;
  } else {
    return true;
  }
}
validatepassword();
