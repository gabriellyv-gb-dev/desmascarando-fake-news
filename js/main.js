// js/main.js
// Pequenos aprimoramentos da página inicial (index.html).

const spanAno = document.getElementById("ano-atual");
if (spanAno) {
  spanAno.textContent = String(new Date().getFullYear());
}
