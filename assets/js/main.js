// Menu mobile
const btn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
if (btn && nav) {
  btn.addEventListener("click", () => {
    const aperto = nav.classList.toggle("aperto");
    btn.setAttribute("aria-expanded", aperto);
    btn.textContent = aperto ? "Chiudi" : "Menu";
  });
}

// Modulo contatti: per ora compone un'email nel programma di posta del visitatore.
// Per l'invio diretto sostituire con un servizio (es. Formspree o Netlify Forms).
const modulo = document.querySelector("#modulo-contatti");
if (modulo) {
  modulo.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!modulo.reportValidity()) return;
    const d = new FormData(modulo);
    const oggetto = `Richiesta di contatto: ${d.get("ambito")}`;
    const corpo = [
      `Nome e cognome: ${d.get("nome")}`,
      `Email: ${d.get("email")}`,
      `Telefono: ${d.get("telefono") || "non indicato"}`,
      `Ambito: ${d.get("ambito")}`,
      "",
      d.get("messaggio"),
    ].join("\n");
    window.location.href =
      `mailto:avv.barbararenzullo@gmail.com?subject=${encodeURIComponent(oggetto)}&body=${encodeURIComponent(corpo)}`;
    modulo.querySelector(".esito").textContent =
      "Si è aperto il suo programma di posta con il messaggio già compilato. Se non si apre, scriva direttamente a avv.barbararenzullo@gmail.com.";
  });
}
