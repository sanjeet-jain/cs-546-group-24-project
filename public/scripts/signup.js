function validatesignup(event) {
  let forms = document.getElementById("signup-form");

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
        document.getElementById("submit-btn").disabled = true;
        $.ajax({
          type: "POST",
          url: `/user/signup`,
          data: jsonData,
          success: function (data, status, xhr) {
            window.location.href = "/calendar/month";
          },
          error: function (data) {
            document.getElementById("submit-btn").disabled = false;
            let emailInput = event.target.email;
            let passwordInput = event.target.password;
            let passwordReEnterInput = event.target.reEnterPassword;
            let firstNameInput = event.target.first_name;
            let lastNameInput = event.target.last_name;
            let dob = event.target.dob;
            let consent = event.target.consent;
            let passForm = event.target;

            let email_error = document.getElementById("email_error");
            let password_error = document.getElementById("password_error");
            let reEnter_error = document.getElementById("reEnter_error");
            let firstName_error = document.getElementById("first_name_error");
            let lastName_error = document.getElementById("last_name_error");
            let date_error = document.getElementById("date_error");
            let consent_error = document.getElementById("consent_error");

            email_error.innerText = "";
            password_error.innerText = "";
            reEnter_error.innerText = "";
            firstName_error.innerText = "";
            lastName_error.innerText = "";
            date_error.innerText = "";
            consent_error.innerText = "";

            emailInput.setCustomValidity("");
            passwordInput.setCustomValidity("");
            passwordReEnterInput.setCustomValidity("");
            firstNameInput.setCustomValidity("");
            lastNameInput.setCustomValidity("");
            dob.setCustomValidity("");
            consent.setCustomValidity("");

            email_error.innerText =
              data?.responseJSON?.errorMessages?.email || "";
            password_error.innerText =
              data?.responseJSON?.errorMessages?.password || "";
            reEnter_error.innerText =
              data?.responseJSON?.errorMessages?.reEnterPassword || "";
            first_name.innerText =
              data?.responseJSON?.errorMessages?.first_name || "";
            last_name.innerText =
              data?.responseJSON?.errorMessages?.last_name || "";
            date_error.innerText = data?.responseJSON?.errorMessages?.dob || "";
            consent_error.innerText =
              data?.responseJSON?.errorMessages?.consent || "";

            emailInput.setCustomValidity(
              data?.responseJSON?.errorMessages?.email || ""
            );
            passwordInput.setCustomValidity(
              data?.responseJSON?.errorMessages?.password || ""
            );
            passwordReEnterInput.setCustomValidity(
              data?.responseJSON?.errorMessages?.reEnterPassword || ""
            );
            firstNameInput.setCustomValidity(
              data?.responseJSON?.errorMessages?.first_name || ""
            );
            lastNameInput.setCustomValidity(
              data?.responseJSON?.errorMessages?.last_name || ""
            );
            dob.setCustomValidity(data?.responseJSON?.errorMessages?.dob || "");
            consent.setCustomValidity(
              data?.responseJSON?.errorMessages?.consent || ""
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
  let emailInput = event.target.email;
  let passwordInput = event.target.password;
  let passwordReEnterInput = event.target.reEnterPassword;
  let firstNameInput = event.target.first_name;
  let lastNameInput = event.target.last_name;
  let dob = event.target.dob;
  let consent = event.target.consent;
  let passForm = event.target;

  let email_error = document.getElementById("email_error");
  let password_error = document.getElementById("password_error");
  let reEnter_error = document.getElementById("reEnter_error");
  let firstName_error = document.getElementById("first_name_error");
  let lastName_error = document.getElementById("last_name_error");
  let date_error = document.getElementById("date_error");
  let consent_error = document.getElementById("consent_error");

  email_error.innerText = "";
  password_error.innerText = "";
  reEnter_error.innerText = "";
  firstName_error.innerText = "";
  lastName_error.innerText = "";
  date_error.innerText = "";
  consent_error.innerText = "";

  emailInput.setCustomValidity("");
  passwordInput.setCustomValidity("");
  passwordReEnterInput.setCustomValidity("");
  firstNameInput.setCustomValidity("");
  lastNameInput.setCustomValidity("");
  dob.setCustomValidity("");
  consent.setCustomValidity("");

  if (!validateEmail(emailInput.value)) {
    email_error.innerText = "Please enter a valid email.";
    emailInput.setCustomValidity("error");
  }

  if (!validatePassword(passwordInput.value)) {
    password_error.innerText =
      "Password must be at least 8 characters, contain at least one uppercase letter, digit and one special character (!@#$%^&_=+.).";
    passwordInput.setCustomValidity("error");
  }
  if (!confirmPassword(passwordInput.value, passwordReEnterInput.value)) {
    reEnter_error = "Passwords do not match.";
    passwordReEnterInput.setCustomValidity("error");
  }
  if (!validateName(firstNameInput.value)) {
    firstName_error.innerText = "Please enter a valid first name.";
    firstNameInput.setCustomValidity("error");
  }

  if (!validateName(lastNameInput.value)) {
    lastName_error.innerText = "Please enter a valid last name.";
    lastNameInput.setCustomValidity("error");
  }
  if (!consent.check !== true) {
    consent_error.innerText = "Please consent to data collection";
    consent.setCustomValidity("error");
  }
  if (passwordInput.value !== reEnterPassword.value) {
    reEnter_error.innerText = "Passwords do not match.";
    passwordReEnterInput.setCustomValidity("error");
  }
  if (
    dob.validity.valueMissing ||
    dob.value === "" ||
    dob.value === undefined ||
    dob.value === null
  ) {
    date_error.textContent = "Please enter a date of birth.";
    dob.setCustomValidity("error");
  } else if (dob.validity.rangeUnderflow) {
    date_error.textContent = "You cannot be more than 150 years old to signup!";
    dob.setCustomValidity("error");
  } else if (dob.validity.rangeOverflow) {
    date_error.textContent = "You must be at least 13 years old to signup!";
    dob.setCustomValidity("error");
  }
  if (passForm.checkValidity()) {
    return true; //passForm.submit();
  }

  return false;
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

function validateName(name) {
  const nameRegex = /^(?=.{1,20}$)(?![\d])[\w\s]+$/;
  return nameRegex.test(name);
}

function confirmPassword(password, reEnter) {
  if (password !== reEnter) {
    return false;
  } else {
    return true;
  }
}

validatesignup();
