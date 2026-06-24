export interface City {
  slug: string;
  name: string;
  defaultPostal: string;
  region: string; // Matches the key in REGIONS
  municipalitySlug?: string; // Shared municipality data for towns that are not municipalities
  avgRating: number;
  reviewsCount: number;
  tier: 1 | 2 | 3;
}

export interface Region {
  slug: string;
  name: string;
  defaultCitySlug: string; // Main city in the region for default zip codes
}

export function getLocationPhrase(location: City | Region): string {
  const isRegion = !("region" in location);
  if (isRegion && (location.slug === "fyn" || location.slug === "bornholm")) {
    return `på ${location.name}`;
  }
  if (isRegion && location.slug === "sydsjaelland-og-oeer") {
    return "på Sydsjælland og øerne";
  }
  return `i ${location.name}`;
}

export const REGIONS: Record<string, Region> = {
  storkoebenhavn: { slug: "storkoebenhavn", name: "Storkøbenhavn", defaultCitySlug: "koebenhavn" },
  nordsjaelland: { slug: "nordsjaelland", name: "Nordsjælland", defaultCitySlug: "hilleroed" },
  oestjylland: { slug: "oestjylland", name: "Østjylland", defaultCitySlug: "aarhus" },
  fyn: { slug: "fyn", name: "Fyn", defaultCitySlug: "odense" },
  bornholm: { slug: "bornholm", name: "Bornholm", defaultCitySlug: "roenne" },
  vestsjaelland: { slug: "vestsjaelland", name: "Vestsjælland", defaultCitySlug: "roskilde" },
  "sydsjaelland-og-oeer": { slug: "sydsjaelland-og-oeer", name: "Sydsjælland og øer", defaultCitySlug: "naestved" },
  soenderjylland: { slug: "soenderjylland", name: "Sønderjylland", defaultCitySlug: "esbjerg" },
  nordjylland: { slug: "nordjylland", name: "Nordjylland", defaultCitySlug: "aalborg" },
  "midt-vestjylland": { slug: "midt-vestjylland", name: "Midt/Vestjylland", defaultCitySlug: "herning" }
};

export const CITIES: Record<string, City> = {
  "koebenhavn": {
    "slug": "koebenhavn",
    "name": "København",
    "defaultPostal": "1050",
    "region": "storkoebenhavn",
    "avgRating": 4.7,
    "reviewsCount": 123,
    "tier": 1
  },
  "frederiksberg": {
    "slug": "frederiksberg",
    "name": "Frederiksberg",
    "defaultPostal": "2000",
    "region": "storkoebenhavn",
    "avgRating": 4.6,
    "reviewsCount": 64,
    "tier": 1
  },
  "ballerup": {
    "slug": "ballerup",
    "name": "Ballerup",
    "defaultPostal": "2750",
    "region": "storkoebenhavn",
    "avgRating": 4.7,
    "reviewsCount": 160,
    "tier": 2
  },
  "broendby": {
    "slug": "broendby",
    "name": "Brøndby",
    "defaultPostal": "2605",
    "region": "storkoebenhavn",
    "avgRating": 4.8,
    "reviewsCount": 76,
    "tier": 2
  },
  "dragoer": {
    "slug": "dragoer",
    "name": "Dragør",
    "defaultPostal": "2791",
    "region": "storkoebenhavn",
    "avgRating": 4.6,
    "reviewsCount": 72,
    "tier": 1
  },
  "gentofte": {
    "slug": "gentofte",
    "name": "Gentofte",
    "defaultPostal": "2820",
    "region": "storkoebenhavn",
    "avgRating": 4.9,
    "reviewsCount": 69,
    "tier": 1
  },
  "gladsaxe": {
    "slug": "gladsaxe",
    "name": "Gladsaxe",
    "defaultPostal": "2860",
    "region": "storkoebenhavn",
    "avgRating": 4.6,
    "reviewsCount": 208,
    "tier": 1
  },
  "glostrup": {
    "slug": "glostrup",
    "name": "Glostrup",
    "defaultPostal": "2600",
    "region": "storkoebenhavn",
    "avgRating": 4.8,
    "reviewsCount": 193,
    "tier": 2
  },
  "herlev": {
    "slug": "herlev",
    "name": "Herlev",
    "defaultPostal": "2730",
    "region": "storkoebenhavn",
    "avgRating": 4.6,
    "reviewsCount": 174,
    "tier": 2
  },
  "albertslund": {
    "slug": "albertslund",
    "name": "Albertslund",
    "defaultPostal": "2620",
    "region": "storkoebenhavn",
    "avgRating": 4.8,
    "reviewsCount": 81,
    "tier": 2
  },
  "hvidovre": {
    "slug": "hvidovre",
    "name": "Hvidovre",
    "defaultPostal": "2650",
    "region": "storkoebenhavn",
    "avgRating": 4.7,
    "reviewsCount": 138,
    "tier": 2
  },
  "hoeje-taastrup": {
    "slug": "hoeje-taastrup",
    "name": "Høje-Taastrup",
    "defaultPostal": "2630",
    "region": "storkoebenhavn",
    "avgRating": 4.9,
    "reviewsCount": 50,
    "tier": 2
  },
  "lyngby-taarbaek": {
    "slug": "lyngby-taarbaek",
    "name": "Lyngby-Taarbæk",
    "defaultPostal": "2800",
    "region": "storkoebenhavn",
    "avgRating": 4.6,
    "reviewsCount": 147,
    "tier": 1
  },
  "roedovre": {
    "slug": "roedovre",
    "name": "Rødovre",
    "defaultPostal": "2610",
    "region": "storkoebenhavn",
    "avgRating": 4.7,
    "reviewsCount": 87,
    "tier": 2
  },
  "ishoej": {
    "slug": "ishoej",
    "name": "Ishøj",
    "defaultPostal": "2635",
    "region": "storkoebenhavn",
    "avgRating": 4.7,
    "reviewsCount": 182,
    "tier": 2
  },
  "taarnby": {
    "slug": "taarnby",
    "name": "Tårnby",
    "defaultPostal": "2770",
    "region": "storkoebenhavn",
    "avgRating": 4.7,
    "reviewsCount": 159,
    "tier": 2
  },
  "vallensbaek": {
    "slug": "vallensbaek",
    "name": "Vallensbæk",
    "defaultPostal": "2625",
    "region": "storkoebenhavn",
    "avgRating": 4.8,
    "reviewsCount": 179,
    "tier": 2
  },
  "furesoe": {
    "slug": "furesoe",
    "name": "Furesø",
    "defaultPostal": "3500",
    "region": "nordsjaelland",
    "avgRating": 4.7,
    "reviewsCount": 78,
    "tier": 1
  },
  "alleroed": {
    "slug": "alleroed",
    "name": "Allerød",
    "defaultPostal": "3450",
    "region": "nordsjaelland",
    "avgRating": 4.8,
    "reviewsCount": 92,
    "tier": 1
  },
  "fredensborg": {
    "slug": "fredensborg",
    "name": "Fredensborg",
    "defaultPostal": "3480",
    "region": "nordsjaelland",
    "avgRating": 4.8,
    "reviewsCount": 46,
    "tier": 2
  },
  "helsingoer": {
    "slug": "helsingoer",
    "name": "Helsingør",
    "defaultPostal": "3000",
    "region": "nordsjaelland",
    "avgRating": 4.6,
    "reviewsCount": 218,
    "tier": 2
  },
  "hilleroed": {
    "slug": "hilleroed",
    "name": "Hillerød",
    "defaultPostal": "3400",
    "region": "nordsjaelland",
    "avgRating": 4.8,
    "reviewsCount": 201,
    "tier": 2
  },
  "hoersholm": {
    "slug": "hoersholm",
    "name": "Hørsholm",
    "defaultPostal": "2970",
    "region": "nordsjaelland",
    "avgRating": 4.9,
    "reviewsCount": 134,
    "tier": 1
  },
  "rudersdal": {
    "slug": "rudersdal",
    "name": "Rudersdal",
    "defaultPostal": "2840",
    "region": "nordsjaelland",
    "avgRating": 4.8,
    "reviewsCount": 168,
    "tier": 1
  },
  "egedal": {
    "slug": "egedal",
    "name": "Egedal",
    "defaultPostal": "3650",
    "region": "nordsjaelland",
    "avgRating": 4.6,
    "reviewsCount": 182,
    "tier": 2
  },
  "frederikssund": {
    "slug": "frederikssund",
    "name": "Frederikssund",
    "defaultPostal": "3600",
    "region": "nordsjaelland",
    "avgRating": 4.6,
    "reviewsCount": 109,
    "tier": 2
  },
  "greve": {
    "slug": "greve",
    "name": "Greve",
    "defaultPostal": "2670",
    "region": "vestsjaelland",
    "avgRating": 4.7,
    "reviewsCount": 75,
    "tier": 2
  },
  "koege": {
    "slug": "koege",
    "name": "Køge",
    "defaultPostal": "4600",
    "region": "sydsjaelland-og-oeer",
    "avgRating": 4.9,
    "reviewsCount": 126,
    "tier": 2
  },
  "halsnaes": {
    "slug": "halsnaes",
    "name": "Halsnæs",
    "defaultPostal": "3300",
    "region": "nordsjaelland",
    "avgRating": 4.8,
    "reviewsCount": 141,
    "tier": 3
  },
  "roskilde": {
    "slug": "roskilde",
    "name": "Roskilde",
    "defaultPostal": "4000",
    "region": "vestsjaelland",
    "avgRating": 4.9,
    "reviewsCount": 151,
    "tier": 2
  },
  "solroed": {
    "slug": "solroed",
    "name": "Solrød",
    "defaultPostal": "2680",
    "region": "vestsjaelland",
    "avgRating": 4.9,
    "reviewsCount": 238,
    "tier": 2
  },
  "gribskov": {
    "slug": "gribskov",
    "name": "Gribskov",
    "defaultPostal": "3200",
    "region": "nordsjaelland",
    "avgRating": 4.6,
    "reviewsCount": 111,
    "tier": 2
  },
  "odsherred": {
    "slug": "odsherred",
    "name": "Odsherred",
    "defaultPostal": "4500",
    "region": "vestsjaelland",
    "avgRating": 4.8,
    "reviewsCount": 194,
    "tier": 3
  },
  "holbaek": {
    "slug": "holbaek",
    "name": "Holbæk",
    "defaultPostal": "4300",
    "region": "vestsjaelland",
    "avgRating": 4.9,
    "reviewsCount": 204,
    "tier": 2
  },
  "faxe": {
    "slug": "faxe",
    "name": "Faxe",
    "defaultPostal": "4640",
    "region": "sydsjaelland-og-oeer",
    "avgRating": 4.9,
    "reviewsCount": 165,
    "tier": 3
  },
  "kalundborg": {
    "slug": "kalundborg",
    "name": "Kalundborg",
    "defaultPostal": "4400",
    "region": "vestsjaelland",
    "avgRating": 4.9,
    "reviewsCount": 130,
    "tier": 3
  },
  "ringsted": {
    "slug": "ringsted",
    "name": "Ringsted",
    "defaultPostal": "4100",
    "region": "sydsjaelland-og-oeer",
    "avgRating": 4.9,
    "reviewsCount": 219,
    "tier": 2
  },
  "slagelse": {
    "slug": "slagelse",
    "name": "Slagelse",
    "defaultPostal": "4200",
    "region": "vestsjaelland",
    "avgRating": 4.8,
    "reviewsCount": 54,
    "tier": 2
  },
  "stevns": {
    "slug": "stevns",
    "name": "Stevns",
    "defaultPostal": "4673",
    "region": "sydsjaelland-og-oeer",
    "avgRating": 4.9,
    "reviewsCount": 131,
    "tier": 3
  },
  "soroe": {
    "slug": "soroe",
    "name": "Sorø",
    "defaultPostal": "4180",
    "region": "vestsjaelland",
    "avgRating": 4.6,
    "reviewsCount": 137,
    "tier": 2
  },
  "lejre": {
    "slug": "lejre",
    "name": "Lejre",
    "defaultPostal": "4320",
    "region": "vestsjaelland",
    "avgRating": 4.8,
    "reviewsCount": 180,
    "tier": 2
  },
  "lolland": {
    "slug": "lolland",
    "name": "Lolland",
    "defaultPostal": "4900",
    "region": "sydsjaelland-og-oeer",
    "avgRating": 4.7,
    "reviewsCount": 151,
    "tier": 3
  },
  "naestved": {
    "slug": "naestved",
    "name": "Næstved",
    "defaultPostal": "4700",
    "region": "sydsjaelland-og-oeer",
    "avgRating": 4.7,
    "reviewsCount": 85,
    "tier": 2
  },
  "guldborgsund": {
    "slug": "guldborgsund",
    "name": "Guldborgsund",
    "defaultPostal": "4800",
    "region": "sydsjaelland-og-oeer",
    "avgRating": 4.8,
    "reviewsCount": 151,
    "tier": 3
  },
  "vordingborg": {
    "slug": "vordingborg",
    "name": "Vordingborg",
    "defaultPostal": "4760",
    "region": "sydsjaelland-og-oeer",
    "avgRating": 4.9,
    "reviewsCount": 45,
    "tier": 3
  },
  "roenne": {
    "slug": "roenne",
    "name": "Rønne",
    "defaultPostal": "3700",
    "region": "bornholm",
    "municipalitySlug": "bornholm",
    "avgRating": 4.6,
    "reviewsCount": 63,
    "tier": 2
  },
  "aakirkeby": {
    "slug": "aakirkeby",
    "name": "Aakirkeby",
    "defaultPostal": "3720",
    "region": "bornholm",
    "municipalitySlug": "bornholm",
    "avgRating": 4.6,
    "reviewsCount": 63,
    "tier": 3
  },
  "nexoe": {
    "slug": "nexoe",
    "name": "Nexø",
    "defaultPostal": "3730",
    "region": "bornholm",
    "municipalitySlug": "bornholm",
    "avgRating": 4.6,
    "reviewsCount": 63,
    "tier": 3
  },
  "svaneke": {
    "slug": "svaneke",
    "name": "Svaneke",
    "defaultPostal": "3740",
    "region": "bornholm",
    "municipalitySlug": "bornholm",
    "avgRating": 4.6,
    "reviewsCount": 63,
    "tier": 3
  },
  "gudhjem": {
    "slug": "gudhjem",
    "name": "Gudhjem",
    "defaultPostal": "3760",
    "region": "bornholm",
    "municipalitySlug": "bornholm",
    "avgRating": 4.6,
    "reviewsCount": 63,
    "tier": 3
  },
  "allinge": {
    "slug": "allinge",
    "name": "Allinge",
    "defaultPostal": "3770",
    "region": "bornholm",
    "municipalitySlug": "bornholm",
    "avgRating": 4.6,
    "reviewsCount": 63,
    "tier": 3
  },
  "klemensker": {
    "slug": "klemensker",
    "name": "Klemensker",
    "defaultPostal": "3782",
    "region": "bornholm",
    "municipalitySlug": "bornholm",
    "avgRating": 4.6,
    "reviewsCount": 63,
    "tier": 3
  },
  "hasle": {
    "slug": "hasle",
    "name": "Hasle",
    "defaultPostal": "3790",
    "region": "bornholm",
    "municipalitySlug": "bornholm",
    "avgRating": 4.6,
    "reviewsCount": 63,
    "tier": 3
  },
  "middelfart": {
    "slug": "middelfart",
    "name": "Middelfart",
    "defaultPostal": "5500",
    "region": "fyn",
    "avgRating": 4.9,
    "reviewsCount": 118,
    "tier": 2
  },
  "assens": {
    "slug": "assens",
    "name": "Assens",
    "defaultPostal": "5610",
    "region": "fyn",
    "avgRating": 4.8,
    "reviewsCount": 183,
    "tier": 2
  },
  "faaborg-midtfyn": {
    "slug": "faaborg-midtfyn",
    "name": "Faaborg-Midtfyn",
    "defaultPostal": "5750",
    "region": "fyn",
    "avgRating": 4.9,
    "reviewsCount": 88,
    "tier": 2
  },
  "kerteminde": {
    "slug": "kerteminde",
    "name": "Kerteminde",
    "defaultPostal": "5300",
    "region": "fyn",
    "avgRating": 4.6,
    "reviewsCount": 92,
    "tier": 2
  },
  "nyborg": {
    "slug": "nyborg",
    "name": "Nyborg",
    "defaultPostal": "5800",
    "region": "fyn",
    "avgRating": 4.8,
    "reviewsCount": 58,
    "tier": 2
  },
  "odense": {
    "slug": "odense",
    "name": "Odense",
    "defaultPostal": "5000",
    "region": "fyn",
    "avgRating": 4.8,
    "reviewsCount": 171,
    "tier": 2
  },
  "svendborg": {
    "slug": "svendborg",
    "name": "Svendborg",
    "defaultPostal": "5700",
    "region": "fyn",
    "avgRating": 4.6,
    "reviewsCount": 76,
    "tier": 2
  },
  "nordfyns": {
    "slug": "nordfyns",
    "name": "Nordfyns",
    "defaultPostal": "5400",
    "region": "soenderjylland",
    "avgRating": 4.8,
    "reviewsCount": 220,
    "tier": 3
  },
  "langeland": {
    "slug": "langeland",
    "name": "Langeland",
    "defaultPostal": "5900",
    "region": "fyn",
    "avgRating": 4.9,
    "reviewsCount": 231,
    "tier": 3
  },
  "aeroe": {
    "slug": "aeroe",
    "name": "Ærø",
    "defaultPostal": "5960",
    "region": "fyn",
    "avgRating": 4.9,
    "reviewsCount": 103,
    "tier": 3
  },
  "haderslev": {
    "slug": "haderslev",
    "name": "Haderslev",
    "defaultPostal": "6100",
    "region": "soenderjylland",
    "avgRating": 4.7,
    "reviewsCount": 233,
    "tier": 2
  },
  "billund": {
    "slug": "billund",
    "name": "Billund",
    "defaultPostal": "7190",
    "region": "soenderjylland",
    "avgRating": 4.8,
    "reviewsCount": 227,
    "tier": 3
  },
  "soenderborg": {
    "slug": "soenderborg",
    "name": "Sønderborg",
    "defaultPostal": "6400",
    "region": "soenderjylland",
    "avgRating": 4.9,
    "reviewsCount": 128,
    "tier": 2
  },
  "toender": {
    "slug": "toender",
    "name": "Tønder",
    "defaultPostal": "6270",
    "region": "soenderjylland",
    "avgRating": 4.7,
    "reviewsCount": 99,
    "tier": 3
  },
  "esbjerg": {
    "slug": "esbjerg",
    "name": "Esbjerg",
    "defaultPostal": "6700",
    "region": "soenderjylland",
    "avgRating": 4.6,
    "reviewsCount": 149,
    "tier": 2
  },
  "fanoe": {
    "slug": "fanoe",
    "name": "Fanø",
    "defaultPostal": "6720",
    "region": "soenderjylland",
    "avgRating": 4.9,
    "reviewsCount": 198,
    "tier": 2
  },
  "varde": {
    "slug": "varde",
    "name": "Varde",
    "defaultPostal": "6800",
    "region": "soenderjylland",
    "avgRating": 4.9,
    "reviewsCount": 211,
    "tier": 2
  },
  "vejen": {
    "slug": "vejen",
    "name": "Vejen",
    "defaultPostal": "6600",
    "region": "soenderjylland",
    "avgRating": 4.9,
    "reviewsCount": 91,
    "tier": 2
  },
  "aabenraa": {
    "slug": "aabenraa",
    "name": "Aabenraa",
    "defaultPostal": "6200",
    "region": "soenderjylland",
    "avgRating": 4.9,
    "reviewsCount": 226,
    "tier": 2
  },
  "fredericia": {
    "slug": "fredericia",
    "name": "Fredericia",
    "defaultPostal": "7000",
    "region": "oestjylland",
    "avgRating": 4.7,
    "reviewsCount": 46,
    "tier": 2
  },
  "horsens": {
    "slug": "horsens",
    "name": "Horsens",
    "defaultPostal": "8700",
    "region": "oestjylland",
    "avgRating": 4.7,
    "reviewsCount": 117,
    "tier": 2
  },
  "kolding": {
    "slug": "kolding",
    "name": "Kolding",
    "defaultPostal": "6000",
    "region": "oestjylland",
    "avgRating": 4.7,
    "reviewsCount": 155,
    "tier": 2
  },
  "vejle": {
    "slug": "vejle",
    "name": "Vejle",
    "defaultPostal": "7100",
    "region": "oestjylland",
    "avgRating": 4.6,
    "reviewsCount": 92,
    "tier": 2
  },
  "herning": {
    "slug": "herning",
    "name": "Herning",
    "defaultPostal": "7400",
    "region": "midt-vestjylland",
    "avgRating": 4.8,
    "reviewsCount": 216,
    "tier": 2
  },
  "holstebro": {
    "slug": "holstebro",
    "name": "Holstebro",
    "defaultPostal": "7500",
    "region": "midt-vestjylland",
    "avgRating": 4.6,
    "reviewsCount": 132,
    "tier": 2
  },
  "lemvig": {
    "slug": "lemvig",
    "name": "Lemvig",
    "defaultPostal": "7620",
    "region": "midt-vestjylland",
    "avgRating": 4.8,
    "reviewsCount": 202,
    "tier": 3
  },
  "struer": {
    "slug": "struer",
    "name": "Struer",
    "defaultPostal": "7560",
    "region": "midt-vestjylland",
    "avgRating": 4.6,
    "reviewsCount": 53,
    "tier": 3
  },
  "syddjurs": {
    "slug": "syddjurs",
    "name": "Syddjurs",
    "defaultPostal": "8410",
    "region": "oestjylland",
    "avgRating": 4.7,
    "reviewsCount": 111,
    "tier": 2
  },
  "norddjurs": {
    "slug": "norddjurs",
    "name": "Norddjurs",
    "defaultPostal": "8500",
    "region": "oestjylland",
    "avgRating": 4.6,
    "reviewsCount": 230,
    "tier": 2
  },
  "favrskov": {
    "slug": "favrskov",
    "name": "Favrskov",
    "defaultPostal": "8382",
    "region": "oestjylland",
    "avgRating": 4.8,
    "reviewsCount": 140,
    "tier": 2
  },
  "odder": {
    "slug": "odder",
    "name": "Odder",
    "defaultPostal": "8300",
    "region": "oestjylland",
    "avgRating": 4.8,
    "reviewsCount": 109,
    "tier": 2
  },
  "randers": {
    "slug": "randers",
    "name": "Randers",
    "defaultPostal": "8900",
    "region": "oestjylland",
    "avgRating": 4.9,
    "reviewsCount": 117,
    "tier": 2
  },
  "silkeborg": {
    "slug": "silkeborg",
    "name": "Silkeborg",
    "defaultPostal": "8600",
    "region": "oestjylland",
    "avgRating": 4.9,
    "reviewsCount": 183,
    "tier": 2
  },
  "samsoe": {
    "slug": "samsoe",
    "name": "Samsø",
    "defaultPostal": "8305",
    "region": "oestjylland",
    "avgRating": 4.6,
    "reviewsCount": 94,
    "tier": 3
  },
  "skanderborg": {
    "slug": "skanderborg",
    "name": "Skanderborg",
    "defaultPostal": "8660",
    "region": "oestjylland",
    "avgRating": 4.7,
    "reviewsCount": 196,
    "tier": 2
  },
  "aarhus": {
    "slug": "aarhus",
    "name": "Aarhus",
    "defaultPostal": "8000",
    "region": "oestjylland",
    "avgRating": 4.8,
    "reviewsCount": 122,
    "tier": 1
  },
  "ikast-brande": {
    "slug": "ikast-brande",
    "name": "Ikast-Brande",
    "defaultPostal": "7430",
    "region": "midt-vestjylland",
    "avgRating": 4.7,
    "reviewsCount": 105,
    "tier": 2
  },
  "ringkoebing-skjern": {
    "slug": "ringkoebing-skjern",
    "name": "Ringkøbing-Skjern",
    "defaultPostal": "6950",
    "region": "midt-vestjylland",
    "avgRating": 4.9,
    "reviewsCount": 68,
    "tier": 2
  },
  "hedensted": {
    "slug": "hedensted",
    "name": "Hedensted",
    "defaultPostal": "8722",
    "region": "oestjylland",
    "avgRating": 4.9,
    "reviewsCount": 115,
    "tier": 2
  },
  "morsoe": {
    "slug": "morsoe",
    "name": "Morsø",
    "defaultPostal": "7900",
    "region": "nordjylland",
    "avgRating": 4.7,
    "reviewsCount": 63,
    "tier": 3
  },
  "skive": {
    "slug": "skive",
    "name": "Skive",
    "defaultPostal": "7840",
    "region": "midt-vestjylland",
    "avgRating": 4.7,
    "reviewsCount": 57,
    "tier": 2
  },
  "thisted": {
    "slug": "thisted",
    "name": "Thisted",
    "defaultPostal": "7700",
    "region": "nordjylland",
    "avgRating": 4.6,
    "reviewsCount": 168,
    "tier": 2
  },
  "viborg": {
    "slug": "viborg",
    "name": "Viborg",
    "defaultPostal": "8800",
    "region": "midt-vestjylland",
    "avgRating": 4.7,
    "reviewsCount": 236,
    "tier": 2
  },
  "broenderslev": {
    "slug": "broenderslev",
    "name": "Brønderslev",
    "defaultPostal": "9700",
    "region": "nordjylland",
    "avgRating": 4.7,
    "reviewsCount": 221,
    "tier": 2
  },
  "frederikshavn": {
    "slug": "frederikshavn",
    "name": "Frederikshavn",
    "defaultPostal": "9900",
    "region": "nordjylland",
    "avgRating": 4.8,
    "reviewsCount": 212,
    "tier": 2
  },
  "vesthimmerlands": {
    "slug": "vesthimmerlands",
    "name": "Vesthimmerlands",
    "defaultPostal": "9600",
    "region": "nordjylland",
    "avgRating": 4.9,
    "reviewsCount": 233,
    "tier": 3
  },
  "laesoe": {
    "slug": "laesoe",
    "name": "Læsø",
    "defaultPostal": "9940",
    "region": "nordjylland",
    "avgRating": 4.6,
    "reviewsCount": 144,
    "tier": 3
  },
  "rebild": {
    "slug": "rebild",
    "name": "Rebild",
    "defaultPostal": "9530",
    "region": "nordjylland",
    "avgRating": 4.7,
    "reviewsCount": 119,
    "tier": 2
  },
  "mariagerfjord": {
    "slug": "mariagerfjord",
    "name": "Mariagerfjord",
    "defaultPostal": "9500",
    "region": "nordjylland",
    "avgRating": 4.8,
    "reviewsCount": 183,
    "tier": 2
  },
  "jammerbugt": {
    "slug": "jammerbugt",
    "name": "Jammerbugt",
    "defaultPostal": "9440",
    "region": "nordjylland",
    "avgRating": 4.6,
    "reviewsCount": 140,
    "tier": 3
  },
  "aalborg": {
    "slug": "aalborg",
    "name": "Aalborg",
    "defaultPostal": "9000",
    "region": "nordjylland",
    "avgRating": 4.7,
    "reviewsCount": 128,
    "tier": 2
  },
  "hjoerring": {
    "slug": "hjoerring",
    "name": "Hjørring",
    "defaultPostal": "9800",
    "region": "nordjylland",
    "avgRating": 4.8,
    "reviewsCount": 185,
    "tier": 2
  }
};
