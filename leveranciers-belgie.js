/*
 * TERUGVALLIJST VAN DE BELGISCHE LEVERANCIERS.
 *
 * De nummers beheer je in het Excel-bestand in SharePoint; belgie.html en
 * belgie-fr.html halen de rijen met Land = BE op via leveranciers-bron.js.
 *
 * De lijst hieronder wordt alleen getoond zolang die nog laadt of als hij
 * onbereikbaar is. Aanvullen doe je dus niet hier.
 *
 * Voorbeeld: products: ["123456", "", "ABC789", "", "", "", "", ""]
 * Een leeg veld toont automatisch een rood kruisje; zijn alle 8 nummers
 * ingevuld, dan verschijnt een groen vinkje. De volgorde van de
 * kolommen is: LA152, LA824, LA768, LA823, LA7600, LA882, LA979, LA115.
 * De lijst wordt automatisch alfabetisch gesorteerd.
 */
const suppliers = [
    { name: "Agora Culinair Vleesboerke", products: ["","","","","","","",""] },
    { name: "Agora Culinair Vleminckx", products: ["","","","","","","",""] },
    { name: "Bellimmo Horeca", products: ["","","","","","","",""] },
    { name: "Bidfood de Clercq", products: ["","","","","","","",""] },
    { name: "Bidfood Horeca Service", products: ["","","","","","","",""] },
    { name: "Bidfood makady NV", products: ["","","","","","","",""] },
    { name: "Biervliet Freez Center", products: ["LA152","LA824","LA768","LA823","LA7600","LA882","LA979","LA115"] },
    { name: "Bosteels", products: ["","","","","","","",""] },
    { name: "Buysse Snacks Horeca", products: ["","","","","","","",""] },
    { name: "BV Horeca Foods Brugge", products: ["","","","","","","",""] },
    { name: "BV Horeca Foods Oostende", products: ["","","","","","","",""] },
    { name: "Castelein", products: ["","","","","","","",""] },
    { name: "CONWAY - The Convenience Company België NV/SA", products: ["","","","","","","",""] },
    { name: "Culinair Service BVBA", products: ["","","","","","","",""] },
    { name: "CULIVIER by Pinki", products: ["","","","","","","",""] },
    { name: "De Ruytter", products: ["","","","","","","",""] },
    { name: "Délisalades", products: ["","","","","","","",""] },
    { name: "Delobelle Food Service Horeca", products: ["","","","","","","",""] },
    { name: "Devisch Foodservice BV", products: ["","","","","","","",""] },
    { name: "Devlieger Filip BVBA", products: ["","","","","","","",""] },
    { name: "EM Messiaen Horecaservice", products: ["","","","","","","",""] },
    { name: "Esca Food Service BV", products: ["","","","","","","",""] },
    { name: "Fiers Gent", products: ["","","","","","","",""] },
    { name: "Fincioen BV", products: ["","","","","","","",""] },
    { name: "Free Foods Roeselare", products: ["","","","","","","",""] },
    { name: "Génédis", products: ["","","","","","","",""] },
    { name: "Givana XL", products: ["","","","","","","",""] },
    { name: "Good'nFood - Massafrit", products: ["","","","","","","",""] },
    { name: "Horeca Meeuwissen NV", products: ["","","","","","","",""] },
    { name: "Horeca Totaal Centraal Magazijn", products: ["","","","","","","",""] },
    { name: "Horeca van Zon Beerse", products: ["","","","","","","",""] },
    { name: "Horeca van Zon Beringen", products: ["","","","","","","",""] },
    { name: "Horeca Van Zon Evergem", products: ["","","","","","","",""] },
    { name: "Horeca van Zon Kampenhout", products: ["","","","","","","",""] },
    { name: "Horeca van Zon Lommel", products: ["","","","","","","",""] },
    { name: "Horecaservice Nevejan", products: ["","","","","","","",""] },
    { name: "I.L.I.S. sa", products: ["","","","","","","",""] },
    { name: "Koffiebranderij Degroof BVBA", products: ["","","","","","","",""] },
    { name: "MAISON DESPRIET", products: ["","","","","","","",""] },
    { name: "Noyez", products: ["","","","","","","",""] },
    { name: "Precon NV", products: ["","","","","","","",""] },
    { name: "Ramaut - Ramhoreca SA", products: ["","","","","","","",""] },
    { name: "ROOMCENTRALE DRIESEN NV", products: ["","","","","","","",""] },
    { name: "Ryal Distribution", products: ["","","","","","","",""] },
    { name: "S.A COMPTOIR DES FAGNES", products: ["","","","","","","",""] },
    { name: "Seru Resto Service", products: ["","","","","","","",""] },
    { name: "Snoep & Horecacenter Lingier", products: ["","","","","","","",""] },
    { name: "Solucious NV", products: ["","","","","","","",""] },
    { name: "Solucious NV - LOT", products: ["","","","","","","",""] },
    { name: "Solucious NV - XPO Logistics", products: ["","","","","","","",""] },
    { name: "Spuntini BVBA - Deerlijk", products: ["","","","","","","",""] },
    { name: "Spuntini Food's", products: ["","","","","","","",""] },
    { name: "Spuntini Ghislenghien", products: ["","","","","","","",""] },
    { name: "Spuntini Tienen", products: ["","","","","","","",""] },
    { name: "Spuntini Wattrelos", products: ["","","","","","","",""] },
    { name: "T’SEYEN FOODSERVICE", products: ["","","","","","","",""] },
    { name: "Van Hout Horeca NV", products: ["","","","","","","",""] },
    { name: "Vandael Horeca NV", products: ["","","","","","","",""] },
    { name: "VMS Fine Food", products: ["","","","","","","",""] },
    { name: "Warlop Horeca Service NV", products: ["","","","","","","",""] }
  ];
