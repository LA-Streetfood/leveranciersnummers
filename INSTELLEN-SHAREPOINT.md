# Koppeling SharePoint → website instellen

De website haalt de artikelnummers uit dit bestand in SharePoint:

> site **kantoor** → Documenten → Artikellijsten →
> **NP - Leveranciers -Artikelnummers.xlsx**

Een automatische taak leest dat bestand elk uur en zet de nummers op de site.
Daarvoor is eenmalig hulp nodig van iemand met beheerdersrechten op Microsoft
365. Hieronder staat wat die persoon moet doen — je kunt dit stuk zo
doorsturen.

Zolang dit niet is ingesteld verandert er niets: de site blijft werken en
toont de lijst die er nu op staat.

---

## Deel 1 — voor de Microsoft 365-beheerder

We willen dat één website-taak dat ene Excel-bestand mag **lezen**. Meer niet:
geen schrijfrechten, geen toegang tot andere sites, geen postvakken.

### 1. Registreer een toepassing

1. Ga naar <https://entra.microsoft.com> → **App-registraties** → **Nieuwe
   registratie**.
2. Naam: `LA Streetfood leverancierslijst (alleen lezen)`.
3. Accounttypen: **alleen accounts in deze organisatie**.
4. Omleidings-URI: leeg laten. → **Registreren**.
5. Noteer van de overzichtspagina:
   - **Toepassings-id (client)**
   - **Map-id (tenant)**

### 2. Maak een geheim

1. In dezelfde app: **Certificaten en geheimen** → **Nieuw clientgeheim**.
2. Omschrijving: `website leverancierslijst`. Geldigheid: kies de langste
   termijn die het beleid toestaat (maximaal 24 maanden).
3. Kopieer de **Waarde** (niet de Geheim-id). Die is hierna niet meer te zien.
4. Zet een herinnering in de agenda voor de vervaldatum: als het geheim
   verloopt, stopt de lijst met bijwerken (de site blijft wel werken).

### 3. Geef leesrecht op alleen deze site

1. **API-machtigingen** → **Machtiging toevoegen** → **Microsoft Graph** →
   **Toepassingsmachtigingen** → zoek **`Sites.Selected`** → toevoegen.
2. Klik **Beheerderstoestemming verlenen**.
3. `Sites.Selected` geeft op zichzelf nog nergens toegang; koppel de app aan
   alleen de site *kantoor*, bijvoorbeeld met PnP PowerShell:

   ```powershell
   Connect-PnPOnline -Url https://latinamericanfoodbv.sharepoint.com/sites/kantoor -Interactive
   Grant-PnPAzureADAppSitePermission `
     -AppId "<toepassings-id uit stap 1>" `
     -DisplayName "LA Streetfood leverancierslijst" `
     -Site https://latinamericanfoodbv.sharepoint.com/sites/kantoor `
     -Permissions Read
   ```

   *Liever geen PnP?* Dan kan in plaats van stap 1–3 ook de machtiging
   **`Sites.Read.All`** met beheerderstoestemming. Dat werkt meteen, maar geeft
   leestoegang tot álle SharePoint-sites — vandaar de voorkeur voor
   `Sites.Selected`.

### 4. Geef drie waarden door

- Map-id (tenant)
- Toepassings-id (client)
- De geheime waarde uit stap 2

Stuur die niet per gewone mail; gebruik bijvoorbeeld een wachtwoordkluis of
geef ze mondeling door. Ze horen thuis in de GitHub-instellingen hieronder en
verder nergens.

---

## Deel 2 — in GitHub (eenmalig)

1. Ga naar de repository **LA-Streetfood/leveranciersnummers** →
   **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret**, drie keer:

   | Naam | Waarde |
   | --- | --- |
   | `SP_TENANT_ID` | Map-id (tenant) |
   | `SP_CLIENT_ID` | Toepassings-id (client) |
   | `SP_CLIENT_SECRET` | de geheime waarde |

3. Ga naar het tabblad **Actions** → **Artikelnummers uit SharePoint
   bijwerken** → **Run workflow**. Zo zie je meteen of het werkt.
4. Lukt het, dan verschijnt het bestand `leveranciers-data.json` in de
   repository en staan de nummers uit SharePoint op de site. Vanaf dan gebeurt
   dat elk uur vanzelf.

## Als er iets misgaat

Op het tabblad **Actions** staat per uitvoering een verslag met een leesbare
melding, bijvoorbeeld:

- *"Inloggen bij Microsoft mislukte"* → een van de drie waarden klopt niet, of
  het geheim is verlopen.
- *"De SharePoint-site ... is niet gevonden of de app mag er niet bij"* → stap
  3 van de beheerder is nog niet gedaan.
- *"Het bestand ... staat niet (meer) op die plek"* → het bestand is hernoemd
  of verplaatst. Pas `SP_FILE_PATH` aan in
  `.github/workflows/leveranciersnummers.yml`.
- *"In het Excel-bestand is geen bruikbare tabel gevonden"* → de indeling wijkt
  af; zie de eisen in `README.md`.
- *"Er zouden ... artikelnummers verdwijnen"* → een veiligheidsrem. Er wordt
  niets bijgewerkt totdat iemand kijkt wat er in het bestand is veranderd.

Bij elke fout blijft de site staan zoals hij was. Er gaat dus nooit iets stuk
doordat het ophalen mislukt.
