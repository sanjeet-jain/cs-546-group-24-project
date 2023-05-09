function validateEdits(event) {
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  let forms = document.getElementById("edit-form");

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
          url: `/user/edit`,
          data: jsonData,
          success: function (data, status, xhr) {
            alert("Edit Successful");
            window.location.href = "/user/profile";
          },
          error: function (data) {
            let firstNameInput = event.target.first_name;
            let lastNameInput = event.target.last_name;
            let dateInput = event.target.dob;

            let first_name_error = document.getElementById("first_name_error");
            let last_name_error = document.getElementById("last_name_error");
            let date_error = document.getElementById("date_error");

            first_name_error.innerText = "";
            last_name_error.innerText = "";
            date_error.innerText = "";

            firstNameInput.setCustomValidity("");
            lastNameInput.setCustomValidity("");
            dateInput.setCustomValidity("");

            first_name_error.innerText =
              data?.responseJSON?.errorMessage?.first_name || "";
            last_name_error.innerText =
              data?.responseJSON?.errorMessage?.last_name || "";
            date_error.innerText = data?.responseJSON?.errorMessage?.dob || "";

            firstNameInput.setCustomValidity(
              data?.responseJSON?.errorMessage?.first_name || ""
            );
            lastNameInput.setCustomValidity(
              data?.responseJSON?.errorMessage?.last_name || ""
            );
            dateInput.setCustomValidity(
              data?.responseJSON?.errorMessage?.dob || ""
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
  let firstNameInput = event.target.first_name;
  let lastNameInput = event.target.last_name;
  let dateInput = event.target.dob;

  let passForm = event.target;

  let first_name_error = document.getElementById("first_name_error");
  let last_name_error = document.getElementById("last_name_error");
  let date_error = document.getElementById("date_error");

  first_name_error.innerText = "";
  last_name_error.innerText = "";
  date_error.innerText = "";

  firstNameInput.setCustomValidity("");
  lastNameInput.setCustomValidity("");
  dateInput.setCustomValidity("");

  if (!validate_name(firstNameInput.value)) {
    first_name_error.innerText = "Please enter a valid first name.";
    firstNameInput.setCustomValidity("error");
  }
  if (!validate_name(lastNameInput.value)) {
    last_name_error.innerText = "Please enter a valid last name.";
    lastNameInput.setCustomValidity("error");
  }
  if (dateInput.validity.valueMissing) {
    date_error.innerText = "Please enter a date of birth.";
    dateInput.setCustomValidity("error");
  } else if (dateInput.validity.rangeUnderflow) {
    date_error.innerText = "You cannot be more than 150 years old to signup!";
    dateInput.setCustomValidity("error");
  } else if (dateInput.validity.rangeOverflow) {
    date_error.innerText = "You must be at least 13 years old to signup!";
    dateInput.setCustomValidity("error");
  }
  if (passForm.checkValidity()) {
    return true;
  }
  return false;
}

function validate_name(name) {
  if (typeof name === "string" && name.trim().length === 0) {
    return false;
  }
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
      error: function (data) {},
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
        alert(
          data?.responseJSON?.error || "Some Error Occured try again later"
        );
      },
    });
  }
});

validateEdits();
