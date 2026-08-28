const consent = document.querySelector("#consent");
const startButton = document.querySelector("#start-button");

consent?.addEventListener("change", () => {
  startButton.disabled = !consent.checked;
});

startButton?.addEventListener("click", () => {
  if (!consent.checked) return;
  window.location.href = "questionnaire.html";
});
