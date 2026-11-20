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
      `mailto:avv.renzullo3@gmail.com?subject=${encodeURIComponent(oggetto)}&body=${encodeURIComponent(corpo)}`;
    modulo.querySelector(".esito").textContent =
      "Si è aperto il suo programma di posta con il messaggio già compilato. Se non si apre, scriva direttamente a avv.renzullo3@gmail.com.";
  });
}

// Tavole incise: su schermi grandi si "incidono" dal vivo quando si avvicinano.
// Su telefono e con "riduci movimento" restano ferme e non si scarica nulla in più.
const animare = window.matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)").matches;
if (animare && "IntersectionObserver" in window && CSS.supports("mask-composite", "intersect")) {
  const prepara = (fig) => {
    const img = fig.querySelector("img");
    const nome = (img.getAttribute("src") || "").replace(/(-800)?\.(webp|png)$/, "-contorno.webp");
    const box = document.createElement("span");
    box.className = "incisione";
    img.parentNode.insertBefore(box, img);
    const contorno = document.createElement("img");
    contorno.src = nome; contorno.alt = ""; contorno.className = "strato l-contorno";
    const tono = img.cloneNode(); tono.removeAttribute("srcset"); tono.alt = ""; tono.className = "strato l-tono";
    img.loading = "eager";
    img.classList.add("l-inchiostro");
    box.append(contorno, tono, img);
    return { img, contorno };
  };
  const avvia = (fig) => {
    const { img, contorno } = fig._strati;
    const pronti = [img, contorno].map((i) => (i.complete && i.naturalWidth) ? Promise.resolve() : new Promise((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); }));
    Promise.all(pronti).then(() => {
      fig.classList.add("stampata");
      img.addEventListener("animationend", () => fig.classList.add("incisa"), { once: true });
    });
  };
  const figure = document.querySelectorAll(".tavola, .tavola-larga");
  figure.forEach((f) => { f._strati = prepara(f); });
  const oss = new IntersectionObserver((voci) => {
    voci.forEach((v) => { if (v.isIntersecting) { avvia(v.target); oss.unobserve(v.target); } });
  }, { threshold: 0.2 });
  figure.forEach((t) => oss.observe(t));
}

// Uffici giudiziari: chiusi su telefono, aperti su schermi grandi
if (window.matchMedia("(max-width: 900px)").matches) {
  document.querySelectorAll("details.uffici-riga").forEach((d) => d.removeAttribute("open"));
}

// ---------- Telefono (v11): menu dal basso, blocchi apribili, comparsa allo scorrimento ----------
const telefono = window.matchMedia("(max-width: 900px)");
if (telefono.matches) {
  document.documentElement.classList.add("js-mob");

  // Menu a tutto schermo aperto dalla barra in basso
  const bm = document.querySelector(".barra-menu");
  const menu = document.querySelector("#nav");
  const chiudi = () => {
    menu.classList.remove("aperto");
    document.body.classList.remove("menu-aperto");
    bm.setAttribute("aria-expanded", "false");
  };
  if (bm && menu) {
    bm.addEventListener("click", () => {
      const aperto = menu.classList.toggle("aperto");
      document.body.classList.toggle("menu-aperto", aperto);
      bm.setAttribute("aria-expanded", aperto);
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", chiudi));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") chiudi(); });
  }

  // In home l'intestazione compare quando il nome esce dallo schermo
  const nome = document.querySelector(".home .nome");
  if (nome && "IntersectionObserver" in window) {
    new IntersectionObserver(([v]) => document.body.classList.toggle("oltre-hero", !v.isIntersecting && v.boundingClientRect.top < 0)).observe(nome);
  }

  // Blocchi apribili: titolo visibile, dettaglio al tocco
  document.querySelectorAll(".indice > li, .incarichi > div").forEach((el) => {
    const t = el.querySelector("h3");
    if (!t || !el.querySelector("p")) return;
    el.classList.add("apribile");
    t.setAttribute("role", "button");
    t.setAttribute("tabindex", "0");
    t.setAttribute("aria-expanded", "false");
    const giro = () => {
      const a = el.classList.toggle("aperto");
      t.setAttribute("aria-expanded", a);
    };
    el.addEventListener("click", giro);
    t.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); giro(); } });
  });

  // Comparsa dolce degli elementi quando entrano nello schermo
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const gruppi = [".sez-testa > *", ".hero-fatti li", ".indice > li", ".tavola-larga", ".studio-voci > div", ".uffici-riga",
      ".linea-tempo > li", ".incarichi > div", ".materie > div", ".parte-civile", ".voci > div", ".modulo-campi > *", ".intro .lead"];
    const oss = new IntersectionObserver((voci) => {
      voci.forEach((v) => { if (v.isIntersecting) { v.target.classList.add("visto"); oss.unobserve(v.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    gruppi.forEach((sel) => document.querySelectorAll(sel).forEach((el, i) => {
      if (el.getBoundingClientRect().top < innerHeight * 0.9) return; // ciò che è già a schermo resta fermo
      el.classList.add("rivela");
      el.style.setProperty("--r", i % 4);
      oss.observe(el);
    }));
  }
}
/* anni:inizio · blocco temporaneo: aggiorna la frase degli anni se il sito non è ancora stato aggiornato da GitHub. Lo cancella .github/scripts/anni.py dopo l'ultima data. */
(function () {
  var el = document.querySelector(".anni[data-tappe]");
  if (!el) return;
  var d = new Date(), oggi = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  el.getAttribute("data-tappe").split("|").forEach(function (t) {
    var data = t.slice(0, 10);
    if (/^\d{4}-\d\d-\d\d$/.test(data) && data <= oggi) el.textContent = t.slice(11);
  });
})();
/* anni:fine */
