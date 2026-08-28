/*
 * ARTIKELNUMMERS UIT GOOGLE SHEETS
 * =================================
 * De nummers op deze pagina's komen uit één Google Sheet:
 *
 *   https://docs.google.com/spreadsheets/d/19I072XfZ_q9NWnK51LourOh0BSEZv-4H58UPvd5STdY/edit
 *
 * Iedereen met wie je die Sheet deelt kan nummers aanvullen; de pagina's
 * halen de lijst bij elke keer laden opnieuw op. Je hoeft dus niets meer
 * in de code te wijzigen.
 *
 * VOORWAARDE: de Sheet moet leesbaar zijn zonder inloggen.
 * Zet in de Sheet: Delen > Algemene toegang > "Iedereen met de link" > Lezer.
 * (Alleen lezen; om aan te vullen deel je de Sheet apart met een e-mailadres
 * als Bewerker.)
 *
 * KOLOMMEN IN DE SHEET (de volgorde maakt niet uit, de koppen wel):
 *   Land          -> NL of BE
 *   Groothandel   -> naam van de leverancier
 *   LA152 ... LA115 -> één kolom per product; de kop moet met de LA-code
 *                      beginnen, extra tekst erachter mag ("LA152 - Authentic
 *                      Mexican Cheese Sauce").
 *
 * TIP: begint een artikelnummer met een 0, zet de kolom dan in de Sheet op
 * Opmaak > Getal > Tekst, anders haalt Google die nul weg.
 *
 * Lukt het ophalen niet (Sheet offline, niet gedeeld, geen internet), dan
 * blijft de lijst staan die in de pagina zelf is opgenomen. De site gaat
 * dus nooit "op zwart".
 */

const LA_SHEET_ID = "19I072XfZ_q9NWnK51LourOh0BSEZv-4H58UPvd5STdY";

/* Volgorde van de productkolommen in de tabel op de pagina. */
const LA_PRODUCT_CODES = ["LA152", "LA824", "LA768", "LA823", "LA7600", "LA882", "LA979", "LA115"];

/* Splitst CSV-tekst in rijen en cellen, inclusief velden met komma's of aanhalingstekens. */
function laParseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { value += '"'; i++; }
        else inQuotes = false;
      } else {
        value += char;
      }
      continue;
    }

    if (char === '"') { inQuotes = true; }
    else if (char === ",") { row.push(value); value = ""; }
    else if (char === "\n") { row.push(value); rows.push(row); row = []; value = ""; }
    else if (char !== "\r") { value += char; }
  }

  row.push(value);
  rows.push(row);

  return rows.filter(cells => cells.some(cell => cell.trim() !== ""));
}

/* Maakt van de CSV-rijen de leverancierslijst voor één land ("NL" of "BE"). */
function laRowsToSuppliers(rows, land) {
  if (!rows.length) return [];

  const headers = rows[0].map(cell => cell.trim());
  const landIndex = headers.findIndex(cell => /^land$/i.test(cell));
  const nameIndex = headers.findIndex(cell => /^(groothandel|leverancier)$/i.test(cell));
  if (nameIndex === -1) throw new Error("Kolom 'Groothandel' ontbreekt in de Sheet.");

  /* Zoek per LA-code de bijbehorende kolom, zodat de volgorde in de Sheet vrij is. */
  const codeIndex = {};
  headers.forEach((cell, index) => {
    const match = cell.match(/^\s*(LA\s*\d+)/i);
    if (match) codeIndex[match[1].replace(/\s+/g, "").toUpperCase()] = index;
  });

  const wanted = String(land).toUpperCase();

  return rows.slice(1)
    .filter(cells => {
      const name = (cells[nameIndex] || "").trim();
      if (!name) return false;
      if (landIndex === -1) return true;
      return (cells[landIndex] || "").trim().slice(0, 2).toUpperCase() === wanted;
    })
    .map(cells => ({
      name: (cells[nameIndex] || "").trim(),
      products: LA_PRODUCT_CODES.map(code => {
        const index = codeIndex[code];
        return index === undefined ? "" : (cells[index] || "").trim();
      })
    }));
}

/* Manier 1: de Sheet als CSV ophalen. */
function laSheetViaCsv(land) {
  if (!window.fetch) return Promise.reject(new Error("deze browser kan geen fetch"));

  const url = "https://docs.google.com/spreadsheets/d/" + LA_SHEET_ID +
    "/gviz/tq?tqx=out:csv&headers=0&t=" + Date.now();

  return fetch(url, { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error("Sheet gaf status " + response.status);
      return response.text();
    })
    .then(text => laRowsToSuppliers(laParseCsv(text), land));
}

/*
 * Manier 2: de Sheet ophalen via een <script>-element. Google stuurt het
 * antwoord dan als een aanroep van onze eigen functie. Dat werkt ook in
 * situaties waarin de browser manier 1 tegenhoudt (bijvoorbeeld strenge
 * privacy-instellingen of een blokkade op verzoeken naar een ander domein).
 */
function laSheetViaScript(land) {
  return new Promise((resolve, reject) => {
    const naam = "laSheetAntwoord" + Date.now();
    const script = document.createElement("script");

    const opruimen = () => {
      delete window[naam];
      if (script.parentNode) script.parentNode.removeChild(script);
      clearTimeout(wachttijd);
    };

    const wachttijd = setTimeout(() => {
      opruimen();
      reject(new Error("geen antwoord van Google binnen 10 seconden"));
    }, 10000);

    window[naam] = antwoord => {
      opruimen();
      try {
        const tabel = (antwoord || {}).table || {};
        const koppen = (tabel.cols || []).map(kolom => String((kolom || {}).label || "").trim());
        const waarde = cel => {
          if (!cel) return "";
          if (cel.f !== undefined && cel.f !== null) return String(cel.f);
          if (cel.v === undefined || cel.v === null) return "";
          return typeof cel.v === "number" && Number.isInteger(cel.v)
            ? String(cel.v)
            : String(cel.v);
        };
        const rijen = (tabel.rows || []).map(rij => (rij.c || []).map(waarde));
        resolve(laRowsToSuppliers([koppen].concat(rijen), land));
      } catch (error) {
        reject(error);
      }
    };

    script.onerror = () => { opruimen(); reject(new Error("Sheet niet bereikbaar")); };
    script.src = "https://docs.google.com/spreadsheets/d/" + LA_SHEET_ID +
      "/gviz/tq?tqx=out:json;responseHandler:" + naam + "&headers=1&t=" + Date.now();
    document.head.appendChild(script);
  });
}

/*
 * Haalt de lijst voor één land op: eerst als CSV, en als dat niet lukt via een
 * <script>-element. Levert null als geen van beide werkt, zodat de pagina de
 * ingebouwde lijst kan blijven tonen.
 */
function laLoadSuppliersFromSheet(land) {
  if (!LA_SHEET_ID) return Promise.resolve(null);

  return laSheetViaCsv(land)
    .catch(error => {
      console.warn("Sheet ophalen als CSV lukte niet; nu via een script-element.", error);
      return laSheetViaScript(land);
    })
    .then(suppliers => (suppliers && suppliers.length) ? suppliers : null)
    .catch(error => {
      console.warn("Artikelnummers uit Google Sheets ophalen lukte niet; " +
        "de lijst in de pagina zelf wordt getoond. Staat de Sheet gedeeld op " +
        "\"Iedereen met de link\"?", error);
      return null;
    });
}
