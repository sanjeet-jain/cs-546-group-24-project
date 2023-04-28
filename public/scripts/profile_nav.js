const buttons = document.querySelectorAll(".changePass, .editProfile");

buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault(); // prevent default link behavior
    const href = button.getAttribute("href");
    window.location.href = href;
  });
});
