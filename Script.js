document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("auth-form");
  const loginTab = document.getElementById("login-tab");
  const registerTab = document.getElementById("register-tab");
  const nameField = document.getElementById("name-field");
  const fullNameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordField = document.getElementById("confirm-password-field");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const termsField = document.getElementById("terms-field");
  const termsInput = document.getElementById("terms");
  const forgotButton = document.getElementById("forgot-button");
  const togglePasswordButton = document.getElementById("toggle-password");
  const formEyebrow = document.getElementById("form-eyebrow");
  const formTitle = document.getElementById("form-title");
  const formIntro = document.getElementById("form-intro");
  const submitLabel = document.getElementById("submit-label");
  const switchPrompt = document.getElementById("switch-prompt");
  const formMessage = document.getElementById("form-message");
  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const confirmPasswordError = document.getElementById("confirm-password-error");
  const termsError = document.getElementById("terms-error");

  let currentMode = "login";

  function showMessage(message, type = "") {
    formMessage.textContent = message;
    formMessage.className = "form-message";

    if (type) formMessage.classList.add(type);
  }

  function clearErrors() {
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    termsError.textContent = "";

    [fullNameInput, emailInput, passwordInput, confirmPasswordInput].forEach((input) => {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
    });

    termsInput.removeAttribute("aria-invalid");
  }

  function setError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
  }

  function setMode(mode) {
    currentMode = mode;
    const isRegister = mode === "register";

    loginTab.classList.toggle("is-active", !isRegister);
    registerTab.classList.toggle("is-active", isRegister);
    loginTab.setAttribute("aria-selected", String(!isRegister));
    registerTab.setAttribute("aria-selected", String(isRegister));

    nameField.classList.toggle("is-hidden", !isRegister);
    confirmPasswordField.classList.toggle("is-hidden", !isRegister);
    termsField.classList.toggle("is-hidden", !isRegister);
    forgotButton.classList.toggle("is-hidden", isRegister);

    fullNameInput.required = isRegister;
    confirmPasswordInput.required = isRegister;
    termsInput.required = isRegister;
    passwordInput.autocomplete = isRegister ? "new-password" : "current-password";
    confirmPasswordInput.autocomplete = "new-password";

    if (isRegister) {
      formEyebrow.textContent = "KRIJO LLOGARINË TËNDE";
      formTitle.textContent = "Regjistrohu";
      formIntro.textContent = "Plotëso të dhënat për të krijuar llogarinë tënde.";
      submitLabel.textContent = "Krijo llogari";
      switchPrompt.innerHTML =
        'Ke tashmë një llogari? <button class="text-button" type="button" data-switch="login">Hyr në llogari</button>';
    } else {
      formEyebrow.textContent = "MIRË SE U KTHEVE";
      formTitle.textContent = "Hyr në llogari";
      formIntro.textContent = "Shkruaj të dhënat për të vazhduar.";
      submitLabel.textContent = "Hyr në llogari";
      switchPrompt.innerHTML =
        'Nuk ke llogari? <button class="text-button" type="button" data-switch="register">Regjistrohu</button>';
    }

    clearErrors();
    showMessage("");
  }

  function validateName() {
    if (currentMode !== "register") return true;

    const nameParts = fullNameInput.value.trim().split(/\s+/).filter(Boolean);

    if (nameParts.length < 2) {
      setError(fullNameInput, nameError, "Shkruaj emrin dhe mbiemrin.");
      return false;
    }

    return true;
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError(emailInput, emailError, "Adresa e emailit është e detyrueshme.");
      return false;
    }

    if (!pattern.test(email)) {
      setError(emailInput, emailError, "Shkruaj një adresë emaili të vlefshme.");
      return false;
    }

    emailInput.value = email;
    return true;
  }

  function validatePassword() {
    if (!passwordInput.value) {
      setError(passwordInput, passwordError, "Fjalëkalimi është i detyrueshëm.");
      return false;
    }

    if (passwordInput.value.length < 8) {
      setError(passwordInput, passwordError, "Fjalëkalimi duhet të ketë të paktën 8 karaktere.");
      return false;
    }

    return true;
  }

  function validateConfirmPassword() {
    if (currentMode !== "register") return true;

    if (!confirmPasswordInput.value) {
      setError(confirmPasswordInput, confirmPasswordError, "Konfirmo fjalëkalimin.");
      return false;
    }

    if (confirmPasswordInput.value !== passwordInput.value) {
      setError(confirmPasswordInput, confirmPasswordError, "Fjalëkalimet nuk përputhen.");
      return false;
    }

    return true;
  }

  function validateTerms() {
    if (currentMode !== "register") return true;

    if (!termsInput.checked) {
      termsError.textContent = "Duhet të pranosh kushtet e përdorimit.";
      termsInput.setAttribute("aria-invalid", "true");
      return false;
    }

    return true;
  }

  loginTab.addEventListener("click", () => setMode("login"));
  registerTab.addEventListener("click", () => setMode("register"));

  switchPrompt.addEventListener("click", (event) => {
    const button = event.target.closest("[data-switch]");
    if (button) setMode(button.dataset.switch);
  });

  togglePasswordButton.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";

    const label = isHidden ? "Fshih fjalëkalimin" : "Shfaq fjalëkalimin";
    togglePasswordButton.setAttribute("aria-label", label);
    togglePasswordButton.setAttribute("title", label);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();
    showMessage("");

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const areTermsValid = validateTerms();

    if (
      !isNameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid ||
      !areTermsValid
    ) {
      showMessage("Kontrollo të dhënat e shënuara dhe provo përsëri.", "error");
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    showMessage(
      currentMode === "register"
        ? "Të dhënat janë të vlefshme. Për krijimin e llogarisë duhet lidhur me server."
        : "Të dhënat janë të vlefshme. Për hyrje reale duhet verifikimi në server."
    );
  });

  [
    [fullNameInput, nameError],
    [emailInput, emailError],
    [passwordInput, passwordError],
    [confirmPasswordInput, confirmPasswordError]
  ].forEach(([input, errorElement]) => {
    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      errorElement.textContent = "";

      if (
        input === passwordInput &&
        confirmPasswordInput.value === passwordInput.value
      ) {
        confirmPasswordInput.classList.remove("is-invalid");
        confirmPasswordInput.removeAttribute("aria-invalid");
        confirmPasswordError.textContent = "";
      }

      showMessage("");
    });
  });

  termsInput.addEventListener("change", () => {
    termsError.textContent = "";
    termsInput.removeAttribute("aria-invalid");
    showMessage("");
  });

  forgotButton.addEventListener("click", () => {
    clearErrors();
    const email = emailInput.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError(emailInput, emailError, "Shkruaj emailin për të vazhduar me rikuperimin.");
      emailInput.focus();
      return;
    }

    if (!pattern.test(email)) {
      setError(emailInput, emailError, "Shkruaj një adresë emaili të vlefshme.");
      emailInput.focus();
      return;
    }

    emailInput.value = email;
    showMessage("Emaili është i vlefshëm. Për dërgimin e lidhjes së rikuperimit duhet server.");
  });

  setMode("login");
});
