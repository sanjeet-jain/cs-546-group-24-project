function validateEdits(event) {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  let forms = document.querySelectorAll(".needs-validation");

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
  let firstNameInput = event.target.first_name;
  let lastNameInput = event.target.last_name;
  let dob = event.target.dob;

  let passForm = event.target;

  let first_name_error = document.getElementById("first_name_error");
  let last_name_error = document.getElementById("last_name_error");
  let date_error = document.getElementById("date_error");

  let profileForm = document.getElementById("edit-form");
  let deleteButton = document.getElementById("delete-profile-button");

  if (!validate_name(firstNameInput.value)) {
    first_name_error.innerText = "Please enter a valid first name.";
  } else {
    first_name_error.innerText = "";
  }
  if (!validate_name(lastNameInput.value)) {
    last_name_error.innerText = "Please enter a valid last name.";
  } else {
    last_name_error.innerText = "";
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
  if (
    firstNameInput.checkValidity() &&
    lastNameInput.checkValidity() &&
    dob.checkValidity()
  ) {
    passForm.submit();
  }
  return;
}

function validate_name(name) {
  const nameRegex = /^(?=.{1,20}$)(?![\d])[\w\s]+$/;
  return nameRegex.test(name);
}

// Add event listener for delete profile button
const deleteButton = document.getElementById("delete-profile-button");
deleteButton.addEventListener("click", function (event) {
  event.preventDefault();
  const confirmDelete = confirm(
    "Are you sure you want to delete your profile? This action cannot be undone."
  );
  if (confirmDelete) {
    $.ajax({
      type: "GET",
      url: `/user/deleteUser/${confirmDelete}`,
      success: function (data, status, xhr) {
        alert("You will now be logged out");
        window.location.href = "/user/logout";
      },
      error: function (data) {
        console.log(data);
      },
    });
  }
});
const deleteEvents = document.getElementById("delete-events-button");
deleteEvents.addEventListener("click", function (event) {
  event.preventDefault();
  const confirmDelete = confirm(
    "Are you sure you want to delete all events? This action cannot be undone."
  );
  if (confirmDelete) {
    $.ajax({
      type: "DELETE",
      url: `/user/deleteEvents/${confirmDelete}`,
      success: function (data) {
        alert(data.message);
      },
      error: function (data) {
        console.log(data);
        alert(
          data?.responseJSON?.error || "Some Error Occured try again later"
        );
      },
    });
  }
});

validateEdits();
