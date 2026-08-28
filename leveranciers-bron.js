/*
 * WAAR DE ARTIKELNUMMERS VANDAAN KOMEN
 * =====================================
 * De pagina's proberen achter elkaar drie bronnen, en gebruiken de eerste die
 * lukt. Zo blijft de site het altijd doen.
 *
 * 1. leveranciers-data.json — automatisch gevuld vanuit het Excel-bestand in
 *    SharePoint ("NP - Leveranciers -Artikelnummers.xlsx", site kantoor).
 *    Een GitHub Action haalt dat bestand elk uur op; zie
 *    .github/workflows/leveranciersnummers.yml en INSTELLEN-SHAREPOINT.md.
 *    Zolang die koppeling nog niet is ingesteld, bestaat dit bestand niet en
 *    gaat de pagina vanzelf door naar stap 2.
 *
 * 2. De Google Sheet hieronder — handig als tussenoplossing:
 *    https://docs.google.com/spreadsheets/d/19I072XfZ_q9NWnK51LourOh0BSEZv-4H58UPvd5STdY/edit
 *    Werkt alleen als die Sheet gedeeld staat op "Iedereen met de link · Lezer".
 *    Wil je de Sheet niet gebruiken? Zet LA_SHEET_ID hieronder op "".
 *
 * 3. De lijst die in de pagina zelf staat (index.html voor Nederland,
 *    leveranciers-belgie.js voor België). Die is alleen de terugval.
 *
 * De kolommen worden herkend aan de LA-code in de kop, dus de volgorde in de
 * Sheet of het Excel-bestand mag vrij zijn. Extra tekst achter de code mag
 * ook ("LA152 - Authentic Mexican Cheese Sauce").
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

/* Alleen rijen met een naam en precies acht (tekstuele) artikelnummers. */
function laSchoonLijst(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter(item => item && String(item.name || "").trim() !== "")
    .map(item => ({
      name: String(item.name).trim(),
      products: LA_PRODUCT_CODES.map((code, index) =>
        String((item.products || [])[index] || "").trim())
    }));
}

/* Stap 1: het bestand dat vanuit SharePoint wordt bijgewerkt. */
function laLoadSuppliersFromJson(land) {
  if (!window.fetch) return Promise.resolve(null);

  return fetch("leveranciers-data.json?t=" + Date.now(), { cache: "no-store" })
    .then(response => {
      if (response.status === 404) return null;   /* koppeling nog niet ingesteld */
      if (!response.ok) throw new Error("status " + response.status);
      return response.json();
    })
    .then(data => {
      if (!data) return null;
      const list = laSchoonLijst((data.leveranciers || {})[String(land).toUpperCase()]);
      return list.length ? list : null;
    })
    .catch(error => {
      console.warn("leveranciers-data.json kon niet worden gelezen.", error);
      return null;
    });
}

/* Stap 2: de Google Sheet. */
function laLoadSuppliersFromSheet(land) {
  if (!LA_SHEET_ID || !window.fetch) return Promise.resolve(null);

  const url = "https://docs.google.com/spreadsheets/d/" + LA_SHEET_ID +
    "/gviz/tq?tqx=out:csv&headers=0&t=" + Date.now();

  return fetch(url, { cache: "no-store" })
    .then(response => {
      if (!response.ok) throw new Error("Sheet gaf status " + response.status);
      return response.text();
    })
    .then(text => {
      const suppliers = laRowsToSuppliers(laParseCsv(text), land);
      return suppliers.length ? suppliers : null;
    })
    .catch(error => {
      console.warn("Artikelnummers uit Google Sheets ophalen lukte niet.", error);
      return null;
    });
}

/*
 * Haalt de lijst voor één land op: eerst uit SharePoint-gegevens, anders uit de
 * Google Sheet. Levert null als geen van beide lukt, zodat de pagina de
 * ingebouwde lijst kan blijven tonen.
 */
function laLaadLeveranciers(land) {
  return laLoadSuppliersFromJson(land)
    .then(list => list || laLoadSuppliersFromSheet(land))
    .then(list => {
      if (!list) {
        console.warn("Geen actuele lijst gevonden; de lijst in de pagina zelf wordt getoond.");
      }
      return list;
    });
}
