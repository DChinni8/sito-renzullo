"""Aggiorna la frase degli anni di attività in profilo.html alle date indicate.

Le tappe stanno nell'attributo data-tappe dello <span class="anni">, nella forma
"AAAA-MM-GG Testo|AAAA-MM-GG Testo". Una tappa con la data ancora da definire
(es. 2027-??-??) viene ignorata finché non si scrive la data vera.

Quando una data è passata, il testo viene sostituito e la tappa tolta.
Quando non resta nessuna tappa, lo script ripulisce tutto: toglie lo <span>,
il blocco temporaneo in assets/js/main.js e cancella se stesso.
Il workflow che lo lancia viene poi disattivato dal workflow stesso.
"""
import datetime, pathlib, re, sys
from zoneinfo import ZoneInfo

RADICE = pathlib.Path(__file__).resolve().parents[2]
PAGINA = RADICE / "profilo.html"
JS = RADICE / "assets/js/main.js"
oggi = datetime.datetime.now(ZoneInfo("Europe/Rome")).date().isoformat()

html = PAGINA.read_text(encoding="utf-8")
m = re.search(r'<span class="anni" data-tappe="([^"]*)">([^<]*)</span>', html)
if not m:
    print("Nessuna frase da aggiornare.")
    sys.exit(0)

testo, restano = m.group(2), []
for tappa in filter(None, m.group(1).split("|")):
    data, nuovo = tappa[:10], tappa[11:]
    if re.fullmatch(r"\d{4}-\d\d-\d\d", data) and data <= oggi:
        testo = nuovo
    else:
        restano.append(tappa)

if restano:
    span = f'<span class="anni" data-tappe="{"|".join(restano)}">{testo}</span>'
    if span == m.group(0):
        print("Niente da fare oggi.")
        sys.exit(0)
    PAGINA.write_text(html.replace(m.group(0), span), encoding="utf-8")
    print(f"Frase aggiornata: {testo}")
else:
    PAGINA.write_text(html.replace(m.group(0), testo), encoding="utf-8")
    js = JS.read_text(encoding="utf-8")
    js = re.sub(r"\n?/\* anni:inizio.*?/\* anni:fine \*/\n?", "\n", js, flags=re.S)
    JS.write_text(js, encoding="utf-8")
    pathlib.Path(__file__).unlink()
    print(f"Ultima tappa: {testo}. Codice temporaneo rimosso.")
    pathlib.Path(RADICE / ".github/anni-finito").touch()
