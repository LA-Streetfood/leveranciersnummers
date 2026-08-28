# LA Streetfood leverancierspagina

Deze map is klaar voor GitHub Pages.

- `index.html` — Nederlandse leveranciers.
- `belgie.html` en `belgie-fr.html` — Belgische leveranciers (Nederlands en Frans).
- De logo's staan als losse afbeeldingen in dezelfde map.
- Houd de mapstructuur exact zo.

## Artikelnummers aanvullen

De nummers vul je aan in het Excel-bestand in SharePoint:

> site **kantoor** → Documenten → Artikellijsten →
> **NP - Leveranciers -Artikelnummers.xlsx**

Een taak in GitHub Actions haalt dat bestand elk uur op en zet de nummers op
de site. Je hoeft dus niets te uploaden of aan te passen; invullen en opslaan
is genoeg.

**Dit werkt pas na een eenmalige instelling** door een Microsoft
365-beheerder. Zie [INSTELLEN-SHAREPOINT.md](INSTELLEN-SHAREPOINT.md). Zolang
dat niet is gedaan, gebruikt de site de Google Sheet hieronder.

### Wat het Excel-bestand nodig heeft

- Een kop met een kolom **Groothandel** (of *Leverancier*) en per product een
  kolom die begint met de LA-code: `LA152`, `LA824`, `LA768`, `LA823`,
  `LA7600`, `LA882`, `LA979`, `LA115`. Extra tekst achter de code mag
  ("LA152 - Authentic Mexican Cheese Sauce").
- Het land per leverancier: of een kolom **Land** met `NL` of `BE`, of
  tabbladen met de naam *Nederland* en *Belgie*.
- De volgorde van de kolommen is vrij, extra kolommen (opmerkingen,
  contactpersoon) mogen blijven staan, en een titelregel boven de kop mag ook.
- Begint een artikelnummer met een 0? Zet die cellen dan op *Opmaak → Tekst*,
  anders haalt Excel de nul weg.
- Een leeg vakje toont op de site een rood kruisje; zijn alle 8 nummers
  ingevuld, dan verschijnt een groen vinkje. Rijen toevoegen of verwijderen
  voegt leveranciers toe of haalt ze weg; de site sorteert zelf alfabetisch.

### Tussenoplossing: de Google Sheet

Zolang de SharePoint-koppeling nog niet is ingesteld, leest de site deze Sheet:

<https://docs.google.com/spreadsheets/d/19I072XfZ_q9NWnK51LourOh0BSEZv-4H58UPvd5STdY/edit>

Die moet daarvoor gedeeld staan op **Iedereen met de link · Lezer** (Delen →
Algemene toegang). Zodra het SharePoint-bestand binnenkomt, wordt de Sheet
vanzelf genegeerd. Wil je de Sheet helemaal niet gebruiken? Zet dan
`LA_SHEET_ID` in `leveranciers-bron.js` op `""`.

### Als geen enkele bron bereikbaar is

Dan tonen de pagina's de lijst die in de code staat (`index.html` voor
Nederland, `leveranciers-belgie.js` voor België). Die lijst is alleen een
terugval, zodat de site nooit leeg is.

## Hoe het technisch in elkaar zit

| Bestand | Wat het doet |
| --- | --- |
| `leveranciers-bron.js` | Bepaalt waar de pagina's hun nummers halen: eerst `leveranciers-data.json`, anders de Google Sheet, anders de lijst in de code. |
| `leveranciers-data.json` | Wordt automatisch gevuld vanuit SharePoint. Niet met de hand bewerken — de volgende uitvoering overschrijft het. |
| `tools/sharepoint_naar_site.py` | Haalt het Excel-bestand op en zet het om. Testen op een gedownload bestand: `python3 tools/sharepoint_naar_site.py --bestand lijst.xlsx --droog` |
| `.github/workflows/leveranciersnummers.yml` | Draait dat script elk uur, en handmatig via het tabblad Actions. |

Het script weigert bij te werken als de indeling van het Excel-bestand niet
klopt, als er opeens veel minder leveranciers in staan, of als meer dan 30%
van de ingevulde nummers zou verdwijnen. In al die gevallen blijft de site
staan zoals hij was en staat de reden in het verslag onder **Actions**.

## GitHub Pages
Upload de bestanden naar de root van je repository. Zet daarna GitHub Pages
aan via Settings > Pages en kies de branch waarop deze bestanden staan.
