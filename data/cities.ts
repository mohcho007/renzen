import { pricingConfig } from "./pricing";

export interface City {
  name: string;
  slug: string;
  municipality: string;
  region: string;
  nearbyAreas: string[];
  localIntro: string;
  housingType: string;
  typicalHomeSize: number;
  serviceFocus: string;
  population?: number;
  avgHomeSize?: number;
  householdType?: string;
  parkingNote?: string;
  localSearchTerms: string[];
  indexableServices?: string[];
  faq?: { question: string; answer: string }[];
  metaTitleOverrides?: { [serviceSlug: string]: string };
  metaDescriptionOverrides?: { [serviceSlug: string]: string };
  h1Overrides?: { [serviceSlug: string]: string };
}

// Raw city data list
const rawCities = [
  { name: 'Albertslund', municipality: 'Albertslund Kommune', region: 'Region Hovedstaden', typicalHomeSize: 110, housingType: 'rækkehuse og parcelhuse', nearbyAreas: ['Glostrup', 'Taastrup', 'Brøndby', 'Vallensbæk'] },
  { name: 'Allerød', municipality: 'Allerød Kommune', region: 'Region Hovedstaden', typicalHomeSize: 140, housingType: 'villaer og rækkehuse', nearbyAreas: ['Birkerød', 'Hillerød', 'Lynge', 'Farum'] },
  { name: 'Bagsværd', municipality: 'Gladsaxe Kommune', region: 'Region Hovedstaden', typicalHomeSize: 105, housingType: 'villaer og lejligheder', nearbyAreas: ['Søborg', 'Lyngby', 'Værløse', 'Herlev'] },
  { name: 'Ballerup', municipality: 'Ballerup Kommune', region: 'Region Hovedstaden', typicalHomeSize: 115, housingType: 'rækkehuse og parcelhuse', nearbyAreas: ['Skovlunde', 'Måløv', 'Herlev', 'Smørum'] },
  { name: 'Birkerød', municipality: 'Rudersdal Kommune', region: 'Region Hovedstaden', typicalHomeSize: 135, housingType: 'villaer og parcelhuse', nearbyAreas: ['Allerød', 'Holte', 'Farum', 'Nærum'] },
  { name: 'Brøndby', municipality: 'Brøndby Kommune', region: 'Region Hovedstaden', typicalHomeSize: 110, housingType: 'parcelhuse og lejligheder', nearbyAreas: ['Glostrup', 'Hvidovre', 'Vallensbæk', 'Albertslund'] },
  { name: 'Brøndby Strand', municipality: 'Brøndby Kommune', region: 'Region Hovedstaden', typicalHomeSize: 95, housingType: 'lejligheder og rækkehuse', nearbyAreas: ['Vallensbæk Strand', 'Hvidovre', 'Ishøj', 'Brøndby'] },
  { name: 'Brønshøj', municipality: 'Københavns Kommune', region: 'Region Hovedstaden', typicalHomeSize: 100, housingType: 'murmestervillaer og lejligheder', nearbyAreas: ['Søborg', 'Vanløse', 'Herlev', 'København NV'], parkingNote: 'Bemærk eventuelle parkeringszoner.' },
  { name: 'Charlottenlund', municipality: 'Gentofte Kommune', region: 'Region Hovedstaden', typicalHomeSize: 160, housingType: 'patricievillaer og store lejligheder', nearbyAreas: ['Hellerup', 'Klampenborg', 'Gentofte', 'Lyngby'] },
  { name: 'Dragør', municipality: 'Dragør Kommune', region: 'Region Hovedstaden', typicalHomeSize: 130, housingType: 'historiske huse og villaer', nearbyAreas: ['Kastrup', 'København S'] },
  { name: 'Dronningmølle', municipality: 'Gribskov Kommune', region: 'Region Hovedstaden', typicalHomeSize: 90, housingType: 'sommerhuse og helårsboliger', nearbyAreas: ['Hornbæk', 'Gilleleje', 'Helsinge'] },
  { name: 'Dyssegård', municipality: 'Gentofte Kommune', region: 'Region Hovedstaden', typicalHomeSize: 125, housingType: 'villaer og rækkehuse', nearbyAreas: ['Søborg', 'Gentofte', 'Hellerup', 'København NV'] },
  { name: 'Espergærde', municipality: 'Helsingør Kommune', region: 'Region Hovedstaden', typicalHomeSize: 130, housingType: 'villaer og rækkehuse', nearbyAreas: ['Humlebæk', 'Snekkersten', 'Helsingør'] },
  { name: 'Farum', municipality: 'Furesø Kommune', region: 'Region Hovedstaden', typicalHomeSize: 130, housingType: 'villaer og rækkehuse', nearbyAreas: ['Værløse', 'Birkerød', 'Lynge', 'Allerød'] },
  { name: 'Fredensborg', municipality: 'Fredensborg Kommune', region: 'Region Hovedstaden', typicalHomeSize: 140, housingType: 'villaer og landejendomme', nearbyAreas: ['Hillerød', 'Humlebæk', 'Helsinge', 'Kokkedal'] },
  { name: 'Frederiksberg', municipality: 'Frederiksberg Kommune', region: 'Region Hovedstaden', typicalHomeSize: 95, housingType: 'klassiske herskabslejligheder', nearbyAreas: ['København', 'Valby', 'Vanløse', 'Rødovre'], parkingNote: 'Der opkræves P-gebyr i Frederiksberg betalingszone.' },
  { name: 'Frederikssund', municipality: 'Frederikssund Kommune', region: 'Region Hovedstaden', typicalHomeSize: 120, housingType: 'parcelhuse og rækkehuse', nearbyAreas: ['Jægerspris', 'Slangerup', 'Stenløse', 'Ølstykke'] },
  { name: 'Frederiksværk', municipality: 'Halsnæs Kommune', region: 'Region Hovedstaden', typicalHomeSize: 115, housingType: 'parcelhuse og sommerhuse', nearbyAreas: ['Hundested', 'Liseleje', 'Melby'] },
  { name: 'Gentofte', municipality: 'Gentofte Kommune', region: 'Region Hovedstaden', typicalHomeSize: 145, housingType: 'villaer og lejligheder', nearbyAreas: ['Hellerup', 'Charlottenlund', 'Lyngby', 'Søborg'] },
  { name: 'Gilleleje', municipality: 'Gribskov Kommune', region: 'Region Hovedstaden', typicalHomeSize: 95, housingType: 'sommerhuse og helårsboliger', nearbyAreas: ['Græsted', 'Tisvildeleje', 'Helsinge'] },
  { name: 'Glostrup', municipality: 'Glostrup Kommune', region: 'Region Hovedstaden', typicalHomeSize: 110, housingType: 'parcelhuse og lejligheder', nearbyAreas: ['Brøndby', 'Albertslund', 'Rødovre', 'Herlev'] },
  { name: 'Greve', municipality: 'Greve Kommune', region: 'Region Hovedstaden', typicalHomeSize: 130, housingType: 'parcelhuse og rækkehuse', nearbyAreas: ['Karlslunde', 'Solrød Strand', 'Ishøj'] },
  { name: 'Græsted', municipality: 'Gribskov Kommune', region: 'Region Hovedstaden', typicalHomeSize: 115, housingType: 'parcelhuse og landejendomme', nearbyAreas: ['Gilleleje', 'Helsinge', 'Helsingør'] },
  { name: 'Gørløse', municipality: 'Hillerød Kommune', region: 'Region Hovedstaden', typicalHomeSize: 125, housingType: 'parcelhuse', nearbyAreas: ['Hillerød', 'Slangerup', 'Skævinge'] },
  { name: 'Hedehusene', municipality: 'Høje-Taastrup Kommune', region: 'Region Hovedstaden', typicalHomeSize: 120, housingType: 'rækkehuse og parcelhuse', nearbyAreas: ['Taastrup', 'Roskilde', 'Fløng'] },
  { name: 'Hellebæk', municipality: 'Helsingør Kommune', region: 'Region Hovedstaden', typicalHomeSize: 135, housingType: 'villaer og kystejendomme', nearbyAreas: ['Ålsgårde', 'Helsingør', 'Hornbæk'] },
  { name: 'Hellerup', municipality: 'Gentofte Kommune', region: 'Region Hovedstaden', typicalHomeSize: 150, housingType: 'villaer og herskabslejligheder', nearbyAreas: ['Charlottenlund', 'København Ø', 'Gentofte', 'Lyngby'] },
  { name: 'Helsinge', municipality: 'Gribskov Kommune', region: 'Region Hovedstaden', typicalHomeSize: 120, housingType: 'parcelhuse og landejendomme', nearbyAreas: ['Gilleleje', 'Græsted', 'Hillerød', 'Fredensborg'] },
  { name: 'Helsingør', municipality: 'Helsingør Kommune', region: 'Region Hovedstaden', typicalHomeSize: 115, housingType: 'lejligheder og villaer', nearbyAreas: ['Snekkersten', 'Espergærde', 'Ålsgårde', 'Hornbæk'] },
  { name: 'Herlev', municipality: 'Herlev Kommune', region: 'Region Hovedstaden', typicalHomeSize: 110, housingType: 'villaer, rækkehuse og lejligheder', nearbyAreas: ['Søborg', 'Ballerup', 'Skovlunde', 'Glostrup'] },
  { name: 'Hillerød', municipality: 'Hillerød Kommune', region: 'Region Hovedstaden', typicalHomeSize: 130, housingType: 'villaer og lejligheder', nearbyAreas: ['Allerød', 'Fredensborg', 'Helsinge', 'Skævinge'] },
  { name: 'Holte', municipality: 'Rudersdal Kommune', region: 'Region Hovedstaden', typicalHomeSize: 150, housingType: 'villaer og arkitekttegnede huse', nearbyAreas: ['Virum', 'Birkerød', 'Nærum', 'Kongens Lyngby'] },
  { name: 'Hornbæk', municipality: 'Helsingør Kommune', region: 'Region Hovedstaden', typicalHomeSize: 110, housingType: 'sommerhuse og villaer', nearbyAreas: ['Dronningmølle', 'Hellebæk', 'Ålsgårde'] },
  { name: 'Humlebæk', municipality: 'Fredensborg Kommune', region: 'Region Hovedstaden', typicalHomeSize: 130, housingType: 'villaer og rækkehuse', nearbyAreas: ['Espergærde', 'Nivå', 'Fredensborg', 'Kokkedal'] },
  { name: 'Hundested', municipality: 'Halsnæs Kommune', region: 'Region Hovedstaden', typicalHomeSize: 110, housingType: 'parcelhuse og fritidshuse', nearbyAreas: ['Frederiksværk', 'Liseleje'] },
  { name: 'Hvidovre', municipality: 'Hvidovre Kommune', region: 'Region Hovedstaden', typicalHomeSize: 110, housingType: 'villaer og lejligheder', nearbyAreas: ['Rødovre', 'Brøndby', 'København SV', 'Valby'] },
  { name: 'Hørsholm', municipality: 'Hørsholm Kommune', region: 'Region Hovedstaden', typicalHomeSize: 145, housingType: 'villaer og rækkehuse', nearbyAreas: ['Rungsted', 'Kokkedal', 'Vedbæk', 'Birkerød'] },
  { name: 'Ishøj', municipality: 'Ishøj Kommune', region: 'Region Hovedstaden', typicalHomeSize: 115, housingType: 'lejligheder og parcelhuse', nearbyAreas: ['Vallensbæk', 'Greve', 'Taastrup'] },
  { name: 'Jægerspris', municipality: 'Frederikssund Kommune', region: 'Region Hovedstaden', typicalHomeSize: 110, housingType: 'sommerhuse og parcelhuse', nearbyAreas: ['Frederikssund', 'Skibby'] },
  { name: 'Karlslunde', municipality: 'Greve Kommune', region: 'Region Hovedstaden', typicalHomeSize: 135, housingType: 'villaer og parcelhuse', nearbyAreas: ['Greve', 'Solrød Strand', 'Karlstrup'] },
  { name: 'Kastrup', municipality: 'Tårnby Kommune', region: 'Region Hovedstaden', typicalHomeSize: 105, housingType: 'villaer og lejligheder', nearbyAreas: ['Dragør', 'København S'] },
  { name: 'Klampenborg', municipality: 'Gentofte Kommune', region: 'Region Hovedstaden', typicalHomeSize: 165, housingType: 'herskabelige villaer og rækkehuse', nearbyAreas: ['Charlottenlund', 'Skodsborg', 'Lyngby'] },
  { name: 'Kokkedal', municipality: 'Fredensborg Kommune', region: 'Region Hovedstaden', typicalHomeSize: 120, housingType: 'rækkehuse og villaer', nearbyAreas: ['Hørsholm', 'Nivå', 'Rungsted'] },
  { name: 'Kongens Lyngby', municipality: 'Lyngby-Taarbæk Kommune', region: 'Region Hovedstaden', typicalHomeSize: 130, housingType: 'villaer, rækkehuse og lejligheder', nearbyAreas: ['Søborg', 'Gentofte', 'Holte', 'Virum'] },
  { name: 'Kvistgård', municipality: 'Helsingør Kommune', region: 'Region Hovedstaden', typicalHomeSize: 125, housingType: 'parcelhuse', nearbyAreas: ['Helsingør', 'Espergærde', 'Humlebæk'] },
  { name: 'København', municipality: 'Københavns Kommune', region: 'Region Hovedstaden', typicalHomeSize: 85, housingType: 'lejligheder og byhuse', nearbyAreas: ['Frederiksberg', 'Hellerup', 'Valby', 'København S'], parkingNote: 'Der opkræves parkeringsafgift i Københavns betalingszoner.' },
  { name: 'København N', municipality: 'Københavns Kommune', region: 'Region Hovedstaden', typicalHomeSize: 75, housingType: 'lejligheder', nearbyAreas: ['København NV', 'København Ø', 'Frederiksberg'], parkingNote: 'Parkeringszoner gælder.' },
  { name: 'København NV', municipality: 'Københavns Kommune', region: 'Region Hovedstaden', typicalHomeSize: 80, housingType: 'lejligheder og rækkehuse', nearbyAreas: ['Brønshøj', 'Søborg', 'København N'], parkingNote: 'Parkeringszoner gælder.' },
  { name: 'København S', municipality: 'Københavns Kommune', region: 'Region Hovedstaden', typicalHomeSize: 85, housingType: 'lejligheder og rækkehuse', nearbyAreas: ['Kastrup', 'Dragør', 'København SV'], parkingNote: 'Parkeringszoner gælder.' },
  { name: 'København SV', municipality: 'Københavns Kommune', region: 'Region Hovedstaden', typicalHomeSize: 80, housingType: 'lejligheder', nearbyAreas: ['Hvidovre', 'Valby', 'København S'], parkingNote: 'Parkeringszoner gælder.' },
  { name: 'København Ø', municipality: 'Københavns Kommune', region: 'Region Hovedstaden', typicalHomeSize: 90, housingType: 'lejligheder og byhuse', nearbyAreas: ['Hellerup', 'København N', 'København'], parkingNote: 'Parkeringszoner gælder.' },
  { name: 'Liseleje', municipality: 'Halsnæs Kommune', region: 'Region Hovedstaden', typicalHomeSize: 100, housingType: 'sommerhuse og villaer', nearbyAreas: ['Melby', 'Frederiksværk', 'Tisvildeleje'] },
  { name: 'Lynge', municipality: 'Allerød Kommune', region: 'Region Hovedstaden', typicalHomeSize: 130, housingType: 'parcelhuse og rækkehuse', nearbyAreas: ['Allerød', 'Farum', 'Slangerup', 'Stenløse'] },
  { name: 'Melby', municipality: 'Halsnæs Kommune', region: 'Region Hovedstaden', typicalHomeSize: 105, housingType: 'sommerhuse og landhuse', nearbyAreas: ['Liseleje', 'Frederiksværk', 'Hundested'] },
  { name: 'Måløv', municipality: 'Ballerup Kommune', region: 'Region Hovedstaden', typicalHomeSize: 125, housingType: 'rækkehuse og parcelhuse', nearbyAreas: ['Ballerup', 'Smørum', 'Stenløse', 'Veksø'] },
  { name: 'Nordhavn', municipality: 'Københavns Kommune', region: 'Region Hovedstaden', typicalHomeSize: 90, housingType: 'nye lejligheder og byhuse', nearbyAreas: ['København Ø', 'Hellerup', 'København N'], parkingNote: 'Parkeringszoner gælder i Nordhavn.' },
  { name: 'Nivå', municipality: 'Fredensborg Kommune', region: 'Region Hovedstaden', typicalHomeSize: 120, housingType: 'rækkehuse og parcelhuse', nearbyAreas: ['Kokkedal', 'Humlebæk', 'Fredensborg'] },
  { name: 'Nærum', municipality: 'Rudersdal Kommune', region: 'Region Hovedstaden', typicalHomeSize: 125, housingType: 'villaer og rækkehuse', nearbyAreas: ['Holte', 'Virum', 'Lyngby', 'Skodsborg'] },
  { name: 'Rungsted', municipality: 'Hørsholm Kommune', region: 'Region Hovedstaden', typicalHomeSize: 155, housingType: 'villaer og kystejendomme', nearbyAreas: ['Hørsholm', 'Kokkedal', 'Vedbæk'] },
  { name: 'Rødovre', municipality: 'Rødovre Kommune', region: 'Region Hovedstaden', typicalHomeSize: 105, housingType: 'villaer og lejligheder', nearbyAreas: ['Hvidovre', 'Valby', 'Vanløse', 'Glostrup'] },
  { name: 'Skodsborg', municipality: 'Rudersdal Kommune', region: 'Region Hovedstaden', typicalHomeSize: 140, housingType: 'lejligheder og kystvillaer', nearbyAreas: ['Klampenborg', 'Nærum', 'Vedbæk'] },
  { name: 'Skovlunde', municipality: 'Ballerup Kommune', region: 'Region Hovedstaden', typicalHomeSize: 110, housingType: 'parcelhuse og rækkehuse', nearbyAreas: ['Ballerup', 'Herlev', 'Glostrup'] },
  { name: 'Skævinge', municipality: 'Hillerød Kommune', region: 'Region Hovedstaden', typicalHomeSize: 125, housingType: 'parcelhuse og landhuse', nearbyAreas: ['Hillerød', 'Gørløse', 'Frederikssund'] },
  { name: 'Slangerup', municipality: 'Frederikssund Kommune', region: 'Region Hovedstaden', typicalHomeSize: 120, housingType: 'parcelhuse', nearbyAreas: ['Frederikssund', 'Hillerød', 'Lynge'] },
  { name: 'Smørum', municipality: 'Egedal Kommune', region: 'Region Hovedstaden', typicalHomeSize: 130, housingType: 'villaer og rækkehuse', nearbyAreas: ['Måløv', 'Ballerup', 'Stenløse'] },
  { name: 'Snekkersten', municipality: 'Helsingør Kommune', region: 'Region Hovedstaden', typicalHomeSize: 125, housingType: 'kystvillaer og parcelhuse', nearbyAreas: ['Helsingør', 'Espergærde', 'Humlebæk'] },
  { name: 'Solrød Strand', municipality: 'Solrød Kommune', region: 'Region Sjælland', typicalHomeSize: 135, housingType: 'strandvillaer og parcelhuse', nearbyAreas: ['Karlslunde', 'Køge', 'Greve'] },
  { name: 'Stenløse', municipality: 'Egedal Kommune', region: 'Region Hovedstaden', typicalHomeSize: 125, housingType: 'parcelhuse', nearbyAreas: ['Ølstykke', 'Smørum', 'Måløv', 'Lynge'] },
  { name: 'Søborg', municipality: 'Gladsaxe Kommune', region: 'Region Hovedstaden', typicalHomeSize: 110, housingType: 'murmestervillaer og lejligheder', nearbyAreas: ['Bagsværd', 'Gentofte', 'København NV', 'Herlev'] },
  { name: 'Tikøb', municipality: 'Helsingør Kommune', region: 'Region Hovedstaden', typicalHomeSize: 130, housingType: 'landejendomme og parcelhuse', nearbyAreas: ['Helsingør', 'Fredensborg', 'Helsinge'] },
  { name: 'Tisvildeleje', municipality: 'Gribskov Kommune', region: 'Region Hovedstaden', typicalHomeSize: 110, housingType: 'sommerhuse og villaer', nearbyAreas: ['Gilleleje', 'Vejby', 'Helsinge'] },
  { name: 'Taastrup', municipality: 'Høje-Taastrup Kommune', region: 'Region Hovedstaden', typicalHomeSize: 120, housingType: 'rækkehuse, lejligheder og villaer', nearbyAreas: ['Hedehusene', 'Albertslund', 'Ishøj', 'Vallensbæk'] },
  { name: 'Valby', municipality: 'Københavns Kommune', region: 'Region Hovedstaden', typicalHomeSize: 95, housingType: 'lejligheder og villaer', nearbyAreas: ['København SV', 'Frederiksberg', 'Hvidovre', 'Rødovre'], parkingNote: 'Parkeringsafgifter kan forekomme.' },
  { name: 'Vallensbæk', municipality: 'Vallensbæk Kommune', region: 'Region Hovedstaden', typicalHomeSize: 125, housingType: 'rækkehuse og villaer', nearbyAreas: ['Albertslund', 'Brøndby', 'Ishøj', 'Taastrup'] },
  { name: 'Vallensbæk Strand', municipality: 'Vallensbæk Kommune', region: 'Region Hovedstaden', typicalHomeSize: 115, housingType: 'villaer tæt på strand', nearbyAreas: ['Brøndby Strand', 'Ishøj', 'Vallensbæk'] },
  { name: 'Vanløse', municipality: 'Københavns Kommune', region: 'Region Hovedstaden', typicalHomeSize: 90, housingType: 'lejligheder og villaer', nearbyAreas: ['Brønshøj', 'Frederiksberg', 'Rødovre'], parkingNote: 'P-zoner kan være gældende.' },
  { name: 'Vedbæk', municipality: 'Rudersdal Kommune', region: 'Region Hovedstaden', typicalHomeSize: 155, housingType: 'kystvillaer', nearbyAreas: ['Rungsted', 'Skodsborg', 'Holte'] },
  { name: 'Vejby', municipality: 'Gribskov Kommune', region: 'Region Hovedstaden', typicalHomeSize: 105, housingType: 'fritidshuse og parcelhuse', nearbyAreas: ['Tisvildeleje', 'Gilleleje', 'Helsinge'] },
  { name: 'Veksø', municipality: 'Egedal Kommune', region: 'Region Hovedstaden', typicalHomeSize: 120, housingType: 'parcelhuse og rækkehuse', nearbyAreas: ['Stenløse', 'Måløv', 'Ballerup'] },
  { name: 'Virum', municipality: 'Lyngby-Taarbæk Kommune', region: 'Region Hovedstaden', typicalHomeSize: 135, housingType: 'villaer og rækkehuse', nearbyAreas: ['Holte', 'Kongens Lyngby', 'Nærum'] },
  { name: 'Værløse', municipality: 'Furesø Kommune', region: 'Region Hovedstaden', typicalHomeSize: 130, housingType: 'villaer', nearbyAreas: ['Farum', 'Bagsværd', 'Hareskov'] },
  { name: 'Ølsted', municipality: 'Halsnæs Kommune', region: 'Region Hovedstaden', typicalHomeSize: 115, housingType: 'parcelhuse', nearbyAreas: ['Frederiksværk', 'Ølstykke', 'Frederikssund'] },
  { name: 'Ølstykke', municipality: 'Egedal Kommune', region: 'Region Hovedstaden', typicalHomeSize: 125, housingType: 'parcelhuse', nearbyAreas: ['Stenløse', 'Frederikssund', 'Ølsted'] },
  { name: 'Ålsgårde', municipality: 'Helsingør Kommune', region: 'Region Hovedstaden', typicalHomeSize: 130, housingType: 'villaer med havudsigt', nearbyAreas: ['Hellebæk', 'Hornbæk', 'Helsingør'] },
  
  // Regional Cities
  { name: 'Holbæk', municipality: 'Holbæk Kommune', region: 'Region Sjælland', typicalHomeSize: 125, housingType: 'villaer og rækkehuse', nearbyAreas: ['Vipperød', 'Jyllinge', 'Roskilde'] },
  { name: 'Jyllinge', municipality: 'Roskilde Kommune', region: 'Region Sjælland', typicalHomeSize: 130, housingType: 'fjordvillaer', nearbyAreas: ['Roskilde', 'Stenløse', 'Holbæk'] },
  { name: 'Køge', municipality: 'Køge Kommune', region: 'Region Sjælland', typicalHomeSize: 125, housingType: 'parcelhuse og byhuse', nearbyAreas: ['Solrød Strand', 'Herfølge', 'Ringsted'] },
  { name: 'Ringsted', municipality: 'Ringsted Kommune', region: 'Region Sjælland', typicalHomeSize: 130, housingType: 'parcelhuse', nearbyAreas: ['Sorø', 'Køge', 'Roskilde'] },
  { name: 'Roskilde', municipality: 'Roskilde Kommune', region: 'Region Sjælland', typicalHomeSize: 125, housingType: 'villaer og lejligheder', nearbyAreas: ['Jyllinge', 'Hedehusene', 'Ringsted'] },
  { name: 'Slagelse', municipality: 'Slagelse Kommune', region: 'Region Sjælland', typicalHomeSize: 120, housingType: 'villaer og lejligheder', nearbyAreas: ['Sorø', 'Korsør', 'Næstved'] },
  { name: 'Sorø', municipality: 'Sorø Kommune', region: 'Region Sjælland', typicalHomeSize: 135, housingType: 'villaer og landejendomme', nearbyAreas: ['Ringsted', 'Slagelse', 'Sorø'] },
  
  // Fyn / Jylland
  { name: 'Fredericia', municipality: 'Fredericia Kommune', region: 'Region Syddanmark', typicalHomeSize: 120, housingType: 'parcelhuse', nearbyAreas: ['Middelfart', 'Vejle', 'Kolding'] },
  { name: 'Herning', municipality: 'Herning Kommune', region: 'Region Midtjylland', typicalHomeSize: 135, housingType: 'parcelhuse', nearbyAreas: ['Ikast', 'Silkeborg', 'Holstebro'] },
  { name: 'Kolding', municipality: 'Kolding Kommune', region: 'Region Syddanmark', typicalHomeSize: 130, housingType: 'villaer', nearbyAreas: ['Vejle', 'Fredericia', 'Haderslev'] },
  { name: 'Middelfart', municipality: 'Middelfart Kommune', region: 'Region Syddanmark', typicalHomeSize: 130, housingType: 'parcelhuse', nearbyAreas: ['Fredericia', 'Odense'] },
  { name: 'Odense', municipality: 'Odense Kommune', region: 'Region Syddanmark', typicalHomeSize: 115, housingType: 'byhuse, lejligheder og villaer', nearbyAreas: ['Middelfart', 'Nyborg', 'Svendborg'] },
  { name: 'Randers', municipality: 'Randers Kommune', region: 'Region Midtjylland', typicalHomeSize: 120, housingType: 'parcelhuse', nearbyAreas: ['Aarhus', 'Hobro', 'Viborg'] },
  { name: 'Vejle', municipality: 'Vejle Kommune', region: 'Region Syddanmark', typicalHomeSize: 135, housingType: 'skræntvillaer og parcelhuse', nearbyAreas: ['Kolding', 'Fredericia', 'Horsens'] },
  { name: 'Viborg', municipality: 'Viborg Kommune', region: 'Region Midtjylland', typicalHomeSize: 130, housingType: 'parcelhuse', nearbyAreas: ['Randers', 'Silkeborg', 'Skive'] },
  { name: 'Aalborg', municipality: 'Aalborg Kommune', region: 'Region Nordjylland', typicalHomeSize: 110, housingType: 'lejligheder og villaer', nearbyAreas: ['Nørresundby', 'Svenstrup', 'Støvring'] },
  { name: 'Aarhus', municipality: 'Aarhus Kommune', region: 'Region Midtjylland', typicalHomeSize: 95, housingType: 'lejligheder og forstadsvillaer', nearbyAreas: ['Randers', 'Skanderborg', 'Højbjerg', 'Risskov'] }
];

// Helper to replace Danish characters to URL-safe slugs
function slugifyDanish(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

export const cities: City[] = rawCities.map((c) => {
  const slug = slugifyDanish(c.name);
  
  // Generate generic intro but make it flow organically and uniquely based on data fields
  const localIntro = `Hos Renzen tilbyder vi professionel, tryg og effektiv rengøring i ${c.name} og omegn. Vi forstår, at hverdagen kan være travl, og vores mål er at give dig mere tid og mental ro ved at tage os af rengøringen. Uanset om du bor i en af områdets mange ${c.housingType} eller en lejlighed, matcher vi dig med en af vores dygtige, forsikrede Zenmestre. Vi dækker hele ${c.municipality} og leverer altid et skinnende rent resultat, der tåler kontrol.`;

  const localSearchTerms = [
    `rengøring ${c.name}`,
    `privat rengøring ${c.name}`,
    `rengøringshjælp ${c.name}`,
    `flytterengøring ${c.name}`,
    `hjemmerengøring ${c.name}`
  ];

  const serviceFocus = c.name === 'København' || c.region === 'Region Hovedstaden' 
    ? 'privat rengøring og lejlighedsrengøring' 
    : 'klassisk hjemmerengøring for familier';

  // Default indexable services:
  // WordPress-URLs that already rank are indexable. Other new ones are false by default on city level.
  // The user specified:
  // /
  // /privat-rengoring/
  // /privat-rengoring/koebenhavn/
  // /privat-rengoring/frederiksberg/
  // /flytterengoring/
  // /airbnb-rengoring/
  // /priser/
  // /faq/
  // /artikler/[slug]/
  // We want to make sure the main service pages are indexable (rengoring, privat-rengoring, flytterengoring, airbnb-rengoring).
  // On city pages, let's allow:
  // - "privat-rengoring" and "rengoring" to be indexable for København and Frederiksberg by default.
  // Let's configure this using indexableServices array.
  const indexableServices = ['privat-rengoring', 'airbnb-rengoring'];

  const faq = [
    {
      question: `Hvad koster rengøring i ${c.name}?`,
      answer: `Prisen for rengøring i ${c.name} afhænger af din boligs størrelse i kvadratmeter. Vores standard listepris er en grundpris på ${pricingConfig.basePrice} kr. plus ${pricingConfig.pricePerSqm} kr. pr. m². Du kan få op til 20% rabat, hvis du vælger en fast ugentlig aftale.`
    },
    {
      question: `Er jeres rengøringsfolk forsikrede i ${c.name}?`,
      answer: `Ja, alle vores Zenmestre, der udfører rengøring i og omkring ${c.name}, er fuldt dækkede af vores erhvervs- og ansvarsforsikring. Det giver dig 100% tryghed.`
    }
  ];

  return {
    ...c,
    slug,
    localIntro,
    serviceFocus,
    localSearchTerms,
    indexableServices,
    faq,
  };
});

export function getCityBySlug(slug: string): City | undefined {
  const normSlug = slug.toLowerCase().trim();
  return cities.find((c) => c.slug === normSlug);
}
