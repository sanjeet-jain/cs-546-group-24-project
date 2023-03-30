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
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
  let usernameVal = document.getElementById("emailId").value;
  let passwordVal = document.getElementById("password").value;
  let passForm = document.getElementById("register-form");
  let password_error = document.getElementById("password_error");
  let email_error = document.getElementById("email_error");

  //validations here
  return;
}
