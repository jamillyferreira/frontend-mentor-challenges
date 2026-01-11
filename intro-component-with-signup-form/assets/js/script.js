const form = document.querySelector(".form");
const firstNameField = document.getElementById("firstName");
const lastNameField = document.getElementById("lastName");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  validateFields();
});

function validateFields() {
  if (firstNameField.value.trim() == "") {
    showError(firstNameField);
  } else {
    removeError(firstNameField);
  }

  if (lastNameField.value.trim() == "") {
    showError(lastNameField);
  }

  if (emailField.value.trim() == "") {
    showError(emailField);
  }
  if (passwordField.value.trim() == "") {
    showError(passwordField);
  }
}

// Funções utilitarias

function isValidName(value) {
  return value.trim().length >= 3;
}

function showError(input) {
  const formField = input.closest(".form-field");
  const errorSpan = formField.querySelector(".form-field__error");

  formField.classList.add("form-field--error");
  errorSpan.hidden = false;
  input.setAttribute("aria-invalid", "true");
}

function removeError(input) {
  const formField = input.closest(".form-field");
  const errorSpan = formField.querySelector(".form-field__error");

  formField.classList.remove("form-field--error");
  errorSpan.hidden = true;
  input.setAttribute("aria-invalid", "false");
}
