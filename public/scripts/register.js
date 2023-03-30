function validateregister(event) {
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
  //add firstname last name
  let usernameVal = document.getElementById("emailId").value;
  let passwordVal = document.getElementById("password").value;
  let passForm = document.getElementById("register-form");

  //add firstname last name
  let password_error = document.getElementById("password_error");
  let email_error = document.getElementById("email_error");
  let dob = document.getElementById("dob");
  const errorDiv = document.getElementById("date_error");

  //validations here
  //example validation for DOB
  if (dob.validity.valueMissing) {
    errorDiv.textContent = "Please enter a date of birth.";
  } else if (dob.validity.rangeUnderflow) {
    errorDiv.textContent = "You cannot be more than 150 years old to register!";
  } else if (dob.validity.rangeOverflow) {
    errorDiv.textContent = "You must be at least 14 years old to register!";
  } else {
    errorDiv.textContent = "";
  }
  dob.setCustomValidity(errorDiv.textContent);

  return false;
}

validateregister();
