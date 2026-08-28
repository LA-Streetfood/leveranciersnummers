# LA Streetfood leverancierspagina

Deze map is klaar voor GitHub Pages.

- `index.html` — Nederlandse leveranciers.
- `belgie.html` en `belgie-fr.html` — Belgische leveranciers (Nederlands en Frans).
- De logo's staan als losse afbeeldingen in dezelfde map.
- Houd de mapstructuur exact zo.

## Artikelnummers aanvullen

De nummers beheer je **in Google Sheets**, niet meer in de code:

<https://docs.google.com/spreadsheets/d/19I072XfZ_q9NWnK51LourOh0BSEZv-4H58UPvd5STdY/edit>

Vul je een nummer in de Sheet in, dan staat het bij de eerstvolgende keer
laden op de pagina. Er hoeft niets gepubliceerd of aangepast te worden.

### Eenmalig instellen (nodig om het te laten werken)

In de Sheet, rechtsboven op **Delen**:

1. Onder *Algemene toegang*: zet **Beperkt** om naar **Iedereen met de link**,
   rol **Lezer**. Dit is nodig zodat de website de nummers mag ophalen; de
   Sheet is dan leesbaar voor wie de link heeft, maar niemand kan iets wijzigen.
2. Wil je dat een collega of leverancier zelf aanvult? Voeg diegene daarboven
   toe op e-mailadres met de rol **Bewerker**.

### Hoe de Sheet eruitziet

| Kolom | Wat erin hoort |
| --- | --- |
| `Land` | `NL` voor `index.html`, `BE` voor `belgie.html` en `belgie-fr.html` |
| `Groothandel` | de naam van de leverancier |
| `LA152` … `LA115` | het artikelnummer van dat product bij die leverancier |

- Een leeg vakje toont op de pagina een rood kruisje; zijn alle 8 nummers
  ingevuld, dan verschijnt een groen vinkje.
- Een leverancier toevoegen of verwijderen doe je door een rij toe te voegen
  of te verwijderen. De pagina sorteert zelf alfabetisch.
- De volgorde van de kolommen mag je vrij wijzigen; alleen de LA-code voor in
  de kolomkop telt. Extra tekst erachter mag ("LA152 - Authentic Mexican
  Cheese Sauce").
- Begint een artikelnummer met een 0? Zet de kolom dan op
  *Opmaak > Getal > Tekst*, anders haalt Google die nul weg.

### Als de Sheet er even niet is

Dan tonen de pagina's de lijst die in de code staat (`index.html` voor NL,
`leveranciers-belgie.js` voor BE). Die lijst is alleen een terugval, zodat de
site nooit leeg is. De verbinding met de Sheet zit in `leveranciers-sheet.js`.

## GitHub Pages
Upload de bestanden naar de root van je repository. Zet daarna GitHub Pages
aan via Settings > Pages en kies de branch waarop deze bestanden staan.
