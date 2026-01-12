const form = document.querySelector(".form");
const firstNameField = document.getElementById("firstName");
const lastNameField = document.getElementById("lastName");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const isValid = validateFields();

  if (isValid) {
    console.log("Formulário valido! Enviando...");
    form.reset();
  } else {
    console.log("Corrija os erros do formulário");
  }
});

// valida todos os campos quando for submitido
const validateFields = () => {
  let isValid = true;

  if (isEmpty(firstNameField)) {
    showError(firstNameField);
    isValid = false;
  } else {
    removeError(firstNameField);
  }

  if (isEmpty(lastNameField)) {
    showError(lastNameField);
    isValid = false;
  } else {
    removeError(lastNameField);
  }

  if (isEmpty(emailField)) {
    showError(emailField);
    isValid = false;
  } else if (!isValidEmail(emailField.value)) {
    showError(emailField);
    isValid = false;
  } else {
    removeError(emailField);
  }

  if (!validatePassword()) {
    isValid = false;
  }

  return isValid;
};

// Validações em tempo real cada campo
firstNameField.addEventListener("blur", () => {
  if (isEmpty(firstNameField)) {
    showError(firstNameField);
  } else {
    removeError(firstNameField);
  }
});

lastNameField.addEventListener("blur", () => {
  if (isEmpty(lastNameField)) {
    showError(lastNameField);
  } else {
    removeError(lastNameField);
  }
});

emailField.addEventListener("blur", () => {
  if (isEmpty(emailField)) {
    showError(emailField);
  } else if (!isValidEmail(emailField.value)) {
    showError(emailField);
  } else {
    removeError(emailField);
  }
});

passwordField.addEventListener("blur", validatePassword);

// Funções utilitarias
function isEmpty(input) {
  return input.value.trim() == "";
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword() {
  if (isEmpty(passwordField)) {
    showError(passwordField);
    return false;
  }

  if (passwordField.value.length < 6) {
    showError(passwordField);
    return false;
  }

  removeError(passwordField);
  return true;
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
