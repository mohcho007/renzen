export interface LocalMarketData {
  municipalityName: string;
  population: number;
  households: number;
  cleaningFirmsCount: number;
  primaryPostal: string;
  postalcodes: string[];
  townsServed: string[];
}

export const LOCAL_MARKET_DATA: Record<string, LocalMarketData> = {
  "koebenhavn": {
    "municipalityName": "København Kommune",
    "population": 671714,
    "households": 332181,
    "cleaningFirmsCount": 250,
    "primaryPostal": "1050",
    "postalcodes": [
      "1050",
      "1550",
      "2100",
      "2150",
      "2200",
      "2300",
      "2400",
      "2450",
      "2500",
      "2700",
      "2720"
    ],
    "townsServed": [
      "København K",
      "København V",
      "København Ø",
      "Nordhavn",
      "København N",
      "København S",
      "København NV",
      "København SV",
      "Valby",
      "Brønshøj",
      "Vanløse"
    ]
  },
  "frederiksberg": {
    "municipalityName": "Frederiksberg Kommune",
    "population": 106150,
    "households": 55393,
    "cleaningFirmsCount": 97,
    "primaryPostal": "2000",
    "postalcodes": [
      "2000",
      "1800"
    ],
    "townsServed": [
      "Frederiksberg",
      "Frederiksberg C"
    ]
  },
  "ballerup": {
    "municipalityName": "Ballerup Kommune",
    "population": 53950,
    "households": 25695,
    "cleaningFirmsCount": 49,
    "primaryPostal": "2750",
    "postalcodes": [
      "2750",
      "2740",
      "2760"
    ],
    "townsServed": [
      "Ballerup",
      "Skovlunde",
      "Måløv"
    ]
  },
  "broendby": {
    "municipalityName": "Brøndby Kommune",
    "population": 40990,
    "households": 17921,
    "cleaningFirmsCount": 37,
    "primaryPostal": "2605",
    "postalcodes": [
      "2605",
      "2660"
    ],
    "townsServed": [
      "Brøndby",
      "Brøndby Strand"
    ]
  },
  "dragoer": {
    "municipalityName": "Dragør Kommune",
    "population": 14474,
    "households": 6155,
    "cleaningFirmsCount": 13,
    "primaryPostal": "2791",
    "postalcodes": [
      "2791"
    ],
    "townsServed": [
      "Dragør"
    ]
  },
  "gentofte": {
    "municipalityName": "Gentofte Kommune",
    "population": 75106,
    "households": 34024,
    "cleaningFirmsCount": 68,
    "primaryPostal": "2820",
    "postalcodes": [
      "2820",
      "2870",
      "2900",
      "2920",
      "2930"
    ],
    "townsServed": [
      "Gentofte",
      "Dyssegård",
      "Hellerup",
      "Charlottenlund",
      "Klampenborg"
    ]
  },
  "gladsaxe": {
    "municipalityName": "Gladsaxe Kommune",
    "population": 71185,
    "households": 32787,
    "cleaningFirmsCount": 65,
    "primaryPostal": "2860",
    "postalcodes": [
      "2860",
      "2880"
    ],
    "townsServed": [
      "Søborg",
      "Bagsværd"
    ]
  },
  "glostrup": {
    "municipalityName": "Glostrup Kommune",
    "population": 25834,
    "households": 11857,
    "cleaningFirmsCount": 23,
    "primaryPostal": "2600",
    "postalcodes": [
      "2600"
    ],
    "townsServed": [
      "Glostrup"
    ]
  },
  "herlev": {
    "municipalityName": "Herlev Kommune",
    "population": 32030,
    "households": 14749,
    "cleaningFirmsCount": 29,
    "primaryPostal": "2730",
    "postalcodes": [
      "2730"
    ],
    "townsServed": [
      "Herlev"
    ]
  },
  "albertslund": {
    "municipalityName": "Albertslund Kommune",
    "population": 29262,
    "households": 13219,
    "cleaningFirmsCount": 27,
    "primaryPostal": "2620",
    "postalcodes": [
      "2620"
    ],
    "townsServed": [
      "Albertslund"
    ]
  },
  "hvidovre": {
    "municipalityName": "Hvidovre Kommune",
    "population": 54228,
    "households": 24491,
    "cleaningFirmsCount": 49,
    "primaryPostal": "2650",
    "postalcodes": [
      "2650"
    ],
    "townsServed": [
      "Hvidovre"
    ]
  },
  "hoeje-taastrup": {
    "municipalityName": "Høje-Taastrup Kommune",
    "population": 60458,
    "households": 25719,
    "cleaningFirmsCount": 55,
    "primaryPostal": "2630",
    "postalcodes": [
      "2630",
      "2640"
    ],
    "townsServed": [
      "Taastrup",
      "Hedehusene"
    ]
  },
  "lyngby-taarbaek": {
    "municipalityName": "Lyngby-Taarbæk Kommune",
    "population": 58614,
    "households": 28633,
    "cleaningFirmsCount": 53,
    "primaryPostal": "2800",
    "postalcodes": [
      "2800",
      "2830"
    ],
    "townsServed": [
      "Kongens Lyngby",
      "Virum"
    ]
  },
  "roedovre": {
    "municipalityName": "Rødovre Kommune",
    "population": 45138,
    "households": 20598,
    "cleaningFirmsCount": 41,
    "primaryPostal": "2610",
    "postalcodes": [
      "2610"
    ],
    "townsServed": [
      "Rødovre"
    ]
  },
  "ishoej": {
    "municipalityName": "Ishøj Kommune",
    "population": 24685,
    "households": 10090,
    "cleaningFirmsCount": 22,
    "primaryPostal": "2635",
    "postalcodes": [
      "2635"
    ],
    "townsServed": [
      "Ishøj"
    ]
  },
  "taarnby": {
    "municipalityName": "Tårnby Kommune",
    "population": 44214,
    "households": 19570,
    "cleaningFirmsCount": 40,
    "primaryPostal": "2770",
    "postalcodes": [
      "2770"
    ],
    "townsServed": [
      "Kastrup"
    ]
  },
  "vallensbaek": {
    "municipalityName": "Vallensbæk Kommune",
    "population": 18689,
    "households": 7331,
    "cleaningFirmsCount": 17,
    "primaryPostal": "2625",
    "postalcodes": [
      "2625",
      "2665"
    ],
    "townsServed": [
      "Vallensbæk",
      "Vallensbæk Strand"
    ]
  },
  "furesoe": {
    "municipalityName": "Furesø Kommune",
    "population": 42874,
    "households": 18165,
    "cleaningFirmsCount": 39,
    "primaryPostal": "3500",
    "postalcodes": [
      "3500",
      "3520"
    ],
    "townsServed": [
      "Værløse",
      "Farum"
    ]
  },
  "alleroed": {
    "municipalityName": "Allerød Kommune",
    "population": 26496,
    "households": 11004,
    "cleaningFirmsCount": 24,
    "primaryPostal": "3450",
    "postalcodes": [
      "3450",
      "3540"
    ],
    "townsServed": [
      "Allerød",
      "Lynge"
    ]
  },
  "fredensborg": {
    "municipalityName": "Fredensborg Kommune",
    "population": 42445,
    "households": 18768,
    "cleaningFirmsCount": 39,
    "primaryPostal": "3480",
    "postalcodes": [
      "3480",
      "2980",
      "2990",
      "3050"
    ],
    "townsServed": [
      "Fredensborg",
      "Kokkedal",
      "Nivå",
      "Humlebæk"
    ]
  },
  "helsingoer": {
    "municipalityName": "Helsingør Kommune",
    "population": 64244,
    "households": 30945,
    "cleaningFirmsCount": 58,
    "primaryPostal": "3000",
    "postalcodes": [
      "3000",
      "3060",
      "3070",
      "3080",
      "3100",
      "3140",
      "3150",
      "3230",
      "3490"
    ],
    "townsServed": [
      "Helsingør",
      "Espergærde",
      "Snekkersten",
      "Tikøb",
      "Hornbæk",
      "Ålsgårde",
      "Hellebæk",
      "Græsted",
      "Kvistgård"
    ]
  },
  "hilleroed": {
    "municipalityName": "Hillerød Kommune",
    "population": 55182,
    "households": 24753,
    "cleaningFirmsCount": 50,
    "primaryPostal": "3400",
    "postalcodes": [
      "3400",
      "3320",
      "3330"
    ],
    "townsServed": [
      "Hillerød",
      "Skævinge",
      "Gørløse"
    ]
  },
  "hoersholm": {
    "municipalityName": "Hørsholm Kommune",
    "population": 25354,
    "households": 11865,
    "cleaningFirmsCount": 23,
    "primaryPostal": "2970",
    "postalcodes": [
      "2970",
      "2950",
      "2960"
    ],
    "townsServed": [
      "Hørsholm",
      "Vedbæk",
      "Rungsted Kyst"
    ]
  },
  "rudersdal": {
    "municipalityName": "Rudersdal Kommune",
    "population": 57912,
    "households": 25661,
    "cleaningFirmsCount": 53,
    "primaryPostal": "2840",
    "postalcodes": [
      "2840",
      "2850",
      "2942",
      "3460"
    ],
    "townsServed": [
      "Holte",
      "Nærum",
      "Skodsborg",
      "Birkerød"
    ]
  },
  "egedal": {
    "municipalityName": "Egedal Kommune",
    "population": 46240,
    "households": 18742,
    "cleaningFirmsCount": 42,
    "primaryPostal": "3650",
    "postalcodes": [
      "3650",
      "2765",
      "3660",
      "3670"
    ],
    "townsServed": [
      "Ølstykke",
      "Smørum",
      "Stenløse",
      "Veksø Sjælland"
    ]
  },
  "frederikssund": {
    "municipalityName": "Frederikssund Kommune",
    "population": 47450,
    "households": 21807,
    "cleaningFirmsCount": 43,
    "primaryPostal": "3600",
    "postalcodes": [
      "3600",
      "3550",
      "3630",
      "4050"
    ],
    "townsServed": [
      "Frederikssund",
      "Slangerup",
      "Jægerspris",
      "Skibby"
    ]
  },
  "greve": {
    "municipalityName": "Greve Kommune",
    "population": 54120,
    "households": 22978,
    "cleaningFirmsCount": 49,
    "primaryPostal": "2670",
    "postalcodes": [
      "2670",
      "2690",
      "4030"
    ],
    "townsServed": [
      "Greve",
      "Karlslunde",
      "Tune"
    ]
  },
  "koege": {
    "municipalityName": "Køge Kommune",
    "population": 63962,
    "households": 28382,
    "cleaningFirmsCount": 58,
    "primaryPostal": "4600",
    "postalcodes": [
      "4600",
      "4140",
      "4623",
      "4632",
      "4681",
      "4682"
    ],
    "townsServed": [
      "Køge",
      "Borup",
      "Lille Skensved",
      "Bjæverskov",
      "Herfølge",
      "Tureby"
    ]
  },
  "halsnaes": {
    "municipalityName": "Halsnæs Kommune",
    "population": 31738,
    "households": 14838,
    "cleaningFirmsCount": 29,
    "primaryPostal": "3300",
    "postalcodes": [
      "3300",
      "3310",
      "3360",
      "3370",
      "3390"
    ],
    "townsServed": [
      "Frederiksværk",
      "Ølsted",
      "Liseleje",
      "Melby",
      "Hundested"
    ]
  },
  "roskilde": {
    "municipalityName": "Roskilde Kommune",
    "population": 92697,
    "households": 43228,
    "cleaningFirmsCount": 84,
    "primaryPostal": "4000",
    "postalcodes": [
      "4000",
      "4040",
      "4130",
      "4621"
    ],
    "townsServed": [
      "Roskilde",
      "Jyllinge",
      "Viby Sjælland",
      "Gadstrup"
    ]
  },
  "solroed": {
    "municipalityName": "Solrød Kommune",
    "population": 25040,
    "households": 10601,
    "cleaningFirmsCount": 23,
    "primaryPostal": "2680",
    "postalcodes": [
      "2680",
      "4622"
    ],
    "townsServed": [
      "Solrød Strand",
      "Havdrup"
    ]
  },
  "gribskov": {
    "municipalityName": "Gribskov Kommune",
    "population": 41787,
    "households": 19027,
    "cleaningFirmsCount": 38,
    "primaryPostal": "3200",
    "postalcodes": [
      "3200",
      "3120",
      "3210",
      "3220",
      "3250"
    ],
    "townsServed": [
      "Helsinge",
      "Dronningmølle",
      "Vejby",
      "Tisvildeleje",
      "Gilleleje"
    ]
  },
  "odsherred": {
    "municipalityName": "Odsherred Kommune",
    "population": 31988,
    "households": 16426,
    "cleaningFirmsCount": 29,
    "primaryPostal": "4500",
    "postalcodes": [
      "4500",
      "4534",
      "4540",
      "4550",
      "4560",
      "4571",
      "4572",
      "4573",
      "4581",
      "4583",
      "4591"
    ],
    "townsServed": [
      "Nykøbing Sj",
      "Hørve",
      "Fårevejle",
      "Asnæs",
      "Vig",
      "Grevinge",
      "Nørre Asmindrup",
      "Højby",
      "Rørvig",
      "Sjællands Odde",
      "Føllenslev"
    ]
  },
  "holbaek": {
    "municipalityName": "Holbæk Kommune",
    "population": 75009,
    "households": 35147,
    "cleaningFirmsCount": 68,
    "primaryPostal": "4300",
    "postalcodes": [
      "4300",
      "4305",
      "4340",
      "4350",
      "4360",
      "4370",
      "4390",
      "4420",
      "4440",
      "4450",
      "4520",
      "4532"
    ],
    "townsServed": [
      "Holbæk",
      "Orø",
      "Tølløse",
      "Ugerløse",
      "Kirke Eskilstrup",
      "Store Merløse",
      "Vipperød",
      "Regstrup",
      "Mørkøv",
      "Jyderup",
      "Svinninge",
      "Gislinge"
    ]
  },
  "faxe": {
    "municipalityName": "Faxe Kommune",
    "population": 38143,
    "households": 17696,
    "cleaningFirmsCount": 35,
    "primaryPostal": "4640",
    "postalcodes": [
      "4640",
      "4654",
      "4683",
      "4690"
    ],
    "townsServed": [
      "Faxe",
      "Faxe Ladeplads",
      "Rønnede",
      "Haslev"
    ]
  },
  "kalundborg": {
    "municipalityName": "Kalundborg Kommune",
    "population": 47954,
    "households": 23723,
    "cleaningFirmsCount": 44,
    "primaryPostal": "4400",
    "postalcodes": [
      "4400",
      "4270",
      "4281",
      "4291",
      "4460",
      "4470",
      "4480",
      "4490",
      "4592",
      "4593"
    ],
    "townsServed": [
      "Kalundborg",
      "Høng",
      "Gørlev",
      "Ruds Vedby",
      "Snertinge",
      "Svebølle",
      "Store Fuglede",
      "Jerslev Sjælland",
      "Sejerø",
      "Eskebjerg"
    ]
  },
  "ringsted": {
    "municipalityName": "Ringsted Kommune",
    "population": 36010,
    "households": 16310,
    "cleaningFirmsCount": 33,
    "primaryPostal": "4100",
    "postalcodes": [
      "4100",
      "4174"
    ],
    "townsServed": [
      "Ringsted",
      "Jystrup Midtsj"
    ]
  },
  "slagelse": {
    "municipalityName": "Slagelse Kommune",
    "population": 80959,
    "households": 40220,
    "cleaningFirmsCount": 74,
    "primaryPostal": "4200",
    "postalcodes": [
      "4200",
      "4220",
      "4230",
      "4241",
      "4242",
      "4243",
      "4244",
      "4245",
      "4261"
    ],
    "townsServed": [
      "Slagelse",
      "Korsør",
      "Skælskør",
      "Vemmelev",
      "Boeslunde",
      "Rude",
      "Agersø",
      "Omø",
      "Dalmose"
    ]
  },
  "stevns": {
    "municipalityName": "Stevns Kommune",
    "population": 23842,
    "households": 10910,
    "cleaningFirmsCount": 22,
    "primaryPostal": "4673",
    "postalcodes": [
      "4673",
      "4652",
      "4653",
      "4660",
      "4671",
      "4672"
    ],
    "townsServed": [
      "Rødvig Stevns",
      "Hårlev",
      "Karise",
      "Store Heddinge",
      "Strøby",
      "Klippinge"
    ]
  },
  "soroe": {
    "municipalityName": "Sorø Kommune",
    "population": 30853,
    "households": 14392,
    "cleaningFirmsCount": 28,
    "primaryPostal": "4180",
    "postalcodes": [
      "4180",
      "4173",
      "4190",
      "4293",
      "4295",
      "4296"
    ],
    "townsServed": [
      "Sorø",
      "Fjenneslev",
      "Munke Bjergby",
      "Dianalund",
      "Stenlille",
      "Nyrup"
    ]
  },
  "lejre": {
    "municipalityName": "Lejre Kommune",
    "population": 29879,
    "households": 12458,
    "cleaningFirmsCount": 27,
    "primaryPostal": "4320",
    "postalcodes": [
      "4320",
      "4060",
      "4070",
      "4330"
    ],
    "townsServed": [
      "Lejre",
      "Kirke Såby",
      "Kirke Hyllinge",
      "Hvalsø"
    ]
  },
  "lolland": {
    "municipalityName": "Lolland Kommune",
    "population": 38533,
    "households": 20571,
    "cleaningFirmsCount": 35,
    "primaryPostal": "4900",
    "postalcodes": [
      "4900",
      "4895",
      "4912",
      "4913",
      "4920",
      "4930",
      "4941",
      "4942",
      "4943",
      "4944",
      "4945",
      "4951"
    ],
    "townsServed": [
      "Nakskov",
      "Errindlev",
      "Harpelunde",
      "Horslunde",
      "Søllested",
      "Maribo",
      "Bandholm",
      "Askø",
      "Torrig L",
      "Fejø",
      "Femø",
      "Nørreballe"
    ]
  },
  "naestved": {
    "municipalityName": "Næstved Kommune",
    "population": 85163,
    "households": 40952,
    "cleaningFirmsCount": 77,
    "primaryPostal": "4700",
    "postalcodes": [
      "4700",
      "4160",
      "4171",
      "4250",
      "4262",
      "4684",
      "4733",
      "4736"
    ],
    "townsServed": [
      "Næstved",
      "Herlufmagle",
      "Glumsø",
      "Fuglebjerg",
      "Sandved",
      "Holmegaard",
      "Tappernøje",
      "Karrebæksminde"
    ]
  },
  "guldborgsund": {
    "municipalityName": "Guldborgsund Kommune",
    "population": 59119,
    "households": 30575,
    "cleaningFirmsCount": 54,
    "primaryPostal": "4800",
    "postalcodes": [
      "4800",
      "4840",
      "4850",
      "4862",
      "4863",
      "4871",
      "4872",
      "4873",
      "4874",
      "4880",
      "4891",
      "4892"
    ],
    "townsServed": [
      "Nykøbing F",
      "Nørre Alslev",
      "Stubbekøbing",
      "Guldborg",
      "Eskilstrup",
      "Horbelev",
      "Idestrup",
      "Væggerløse",
      "Gedser",
      "Nysted",
      "Toreby L",
      "Kettinge"
    ]
  },
  "vordingborg": {
    "municipalityName": "Vordingborg Kommune",
    "population": 44831,
    "households": 22841,
    "cleaningFirmsCount": 41,
    "primaryPostal": "4760",
    "postalcodes": [
      "4760",
      "4720",
      "4735",
      "4750",
      "4771",
      "4772",
      "4773",
      "4780",
      "4791",
      "4792",
      "4793"
    ],
    "townsServed": [
      "Vordingborg",
      "Præstø",
      "Mern",
      "Lundby",
      "Kalvehave",
      "Langebæk",
      "Stensved",
      "Stege",
      "Borre",
      "Askeby",
      "Bogø By"
    ]
  },
  "bornholm": {
    "municipalityName": "Bornholms Regionskommune",
    "population": 38677,
    "households": 20071,
    "cleaningFirmsCount": 35,
    "primaryPostal": "3700",
    "postalcodes": [
      "3700",
      "3720",
      "3730",
      "3740",
      "3751",
      "3760",
      "3770",
      "3782",
      "3790"
    ],
    "townsServed": [
      "Rønne",
      "Aakirkeby",
      "Nexø",
      "Svaneke",
      "Østermarie",
      "Gudhjem",
      "Allinge",
      "Klemensker",
      "Hasle"
    ]
  },
  "middelfart": {
    "municipalityName": "Middelfart Kommune",
    "population": 40625,
    "households": 19100,
    "cleaningFirmsCount": 37,
    "primaryPostal": "5500",
    "postalcodes": [
      "5500",
      "5463",
      "5464",
      "5466",
      "5580",
      "5591",
      "5592"
    ],
    "townsServed": [
      "Middelfart",
      "Harndrup",
      "Brenderup Fyn",
      "Asperup",
      "Nørre Aaby",
      "Gelsted",
      "Ejby"
    ]
  },
  "assens": {
    "municipalityName": "Assens Kommune",
    "population": 40369,
    "households": 19157,
    "cleaningFirmsCount": 37,
    "primaryPostal": "5610",
    "postalcodes": [
      "5610",
      "5492",
      "5560",
      "5620",
      "5631",
      "5642",
      "5683",
      "5690"
    ],
    "townsServed": [
      "Assens",
      "Vissenbjerg",
      "Aarup",
      "Glamsbjerg",
      "Ebberup",
      "Millinge",
      "Haarby",
      "Tommerup"
    ]
  },
  "faaborg-midtfyn": {
    "municipalityName": "Faaborg-Midtfyn Kommune",
    "population": 52328,
    "households": 24606,
    "cleaningFirmsCount": 48,
    "primaryPostal": "5750",
    "postalcodes": [
      "5750",
      "5600",
      "5601",
      "5602",
      "5603",
      "5672",
      "5772",
      "5792",
      "5854",
      "5856",
      "5863"
    ],
    "townsServed": [
      "Ringe",
      "Faaborg",
      "Lyø",
      "Avernakø",
      "Bjørnø",
      "Broby",
      "Kværndrup",
      "Årslev",
      "Gislev",
      "Ryslinge",
      "Ferritslev Fyn"
    ]
  },
  "kerteminde": {
    "municipalityName": "Kerteminde Kommune",
    "population": 24299,
    "households": 11696,
    "cleaningFirmsCount": 22,
    "primaryPostal": "5300",
    "postalcodes": [
      "5300",
      "5290",
      "5330",
      "5350",
      "5370",
      "5380",
      "5390",
      "5550"
    ],
    "townsServed": [
      "Kerteminde",
      "Marslev",
      "Munkebo",
      "Rynkeby",
      "Mesinge",
      "Dalby",
      "Martofte",
      "Langeskov"
    ]
  },
  "nyborg": {
    "municipalityName": "Nyborg Kommune",
    "population": 32401,
    "households": 15985,
    "cleaningFirmsCount": 29,
    "primaryPostal": "5800",
    "postalcodes": [
      "5800",
      "5540",
      "5853",
      "5871"
    ],
    "townsServed": [
      "Nyborg",
      "Ullerslev",
      "Ørbæk",
      "Frørup"
    ]
  },
  "odense": {
    "municipalityName": "Odense Kommune",
    "population": 213168,
    "households": 107786,
    "cleaningFirmsCount": 194,
    "primaryPostal": "5000",
    "postalcodes": [
      "5000",
      "5200",
      "5210",
      "5220",
      "5230",
      "5240",
      "5250",
      "5260",
      "5270",
      "5320",
      "5491"
    ],
    "townsServed": [
      "Odense C",
      "Odense V",
      "Odense NV",
      "Odense SØ",
      "Odense M",
      "Odense NØ",
      "Odense SV",
      "Odense S",
      "Odense N",
      "Agedrup",
      "Blommenslyst"
    ]
  },
  "svendborg": {
    "municipalityName": "Svendborg Kommune",
    "population": 60027,
    "households": 29215,
    "cleaningFirmsCount": 55,
    "primaryPostal": "5700",
    "postalcodes": [
      "5700",
      "5762",
      "5771",
      "5874",
      "5881",
      "5882",
      "5883",
      "5884",
      "5892"
    ],
    "townsServed": [
      "Svendborg",
      "Vester Skerninge",
      "Stenstrup",
      "Hesselager",
      "Skårup Fyn",
      "Vejstrup",
      "Oure",
      "Gudme",
      "Gudbjerg Sydfyn"
    ]
  },
  "nordfyns": {
    "municipalityName": "Nordfyns Kommune",
    "population": 29179,
    "households": 13560,
    "cleaningFirmsCount": 27,
    "primaryPostal": "5400",
    "postalcodes": [
      "5400",
      "5450",
      "5462",
      "5471",
      "5474",
      "5485"
    ],
    "townsServed": [
      "Bogense",
      "Otterup",
      "Morud",
      "Søndersø",
      "Veflinge",
      "Skamby"
    ]
  },
  "langeland": {
    "municipalityName": "Langeland Kommune",
    "population": 11841,
    "households": 6528,
    "cleaningFirmsCount": 12,
    "primaryPostal": "5900",
    "postalcodes": [
      "5900",
      "5932",
      "5935",
      "5943",
      "5953"
    ],
    "townsServed": [
      "Rudkøbing",
      "Humble",
      "Bagenkop",
      "Strynø",
      "Tranekær"
    ]
  },
  "aeroe": {
    "municipalityName": "Ærø Kommune",
    "population": 5766,
    "households": 3245,
    "cleaningFirmsCount": 12,
    "primaryPostal": "5960",
    "postalcodes": [
      "5960",
      "5965",
      "5970",
      "5985"
    ],
    "townsServed": [
      "Marstal",
      "Birkholm",
      "Ærøskøbing",
      "Søby Ærø"
    ]
  },
  "haderslev": {
    "municipalityName": "Haderslev Kommune",
    "population": 55218,
    "households": 27033,
    "cleaningFirmsCount": 50,
    "primaryPostal": "6100",
    "postalcodes": [
      "6100",
      "6500",
      "6510",
      "6541",
      "6560"
    ],
    "townsServed": [
      "Haderslev",
      "Vojens",
      "Gram",
      "Bevtoft",
      "Sommersted"
    ]
  },
  "billund": {
    "municipalityName": "Billund Kommune",
    "population": 27200,
    "households": 12683,
    "cleaningFirmsCount": 25,
    "primaryPostal": "7190",
    "postalcodes": [
      "7190",
      "6623",
      "7200",
      "7250",
      "7260"
    ],
    "townsServed": [
      "Billund",
      "Vorbasse",
      "Grindsted",
      "Hejnsvig",
      "Sønder Omme"
    ]
  },
  "soenderborg": {
    "municipalityName": "Sønderborg Kommune",
    "population": 74123,
    "households": 36780,
    "cleaningFirmsCount": 67,
    "primaryPostal": "6400",
    "postalcodes": [
      "6400",
      "6300",
      "6310",
      "6320",
      "6430",
      "6440",
      "6470"
    ],
    "townsServed": [
      "Sønderborg",
      "Gråsten",
      "Broager",
      "Egernsund",
      "Nordborg",
      "Augustenborg",
      "Sydals"
    ]
  },
  "toender": {
    "municipalityName": "Tønder Kommune",
    "population": 36174,
    "households": 17680,
    "cleaningFirmsCount": 33,
    "primaryPostal": "6270",
    "postalcodes": [
      "6270",
      "6240",
      "6261",
      "6280",
      "6520",
      "6534",
      "6535",
      "6780",
      "6792"
    ],
    "townsServed": [
      "Tønder",
      "Løgumkloster",
      "Bredebro",
      "Højer",
      "Toftlund",
      "Agerskov",
      "Branderup J",
      "Skærbæk",
      "Rømø"
    ]
  },
  "esbjerg": {
    "municipalityName": "Esbjerg Kommune",
    "population": 114947,
    "households": 57062,
    "cleaningFirmsCount": 104,
    "primaryPostal": "6700",
    "postalcodes": [
      "6700",
      "6690",
      "6705",
      "6710",
      "6715",
      "6731",
      "6740",
      "6760",
      "6771"
    ],
    "townsServed": [
      "Esbjerg",
      "Gørding",
      "Esbjerg Ø",
      "Esbjerg V",
      "Esbjerg N",
      "Tjæreborg",
      "Bramming",
      "Ribe",
      "Gredstedbro"
    ]
  },
  "fanoe": {
    "municipalityName": "Fanø Kommune",
    "population": 3332,
    "households": 1743,
    "cleaningFirmsCount": 12,
    "primaryPostal": "6720",
    "postalcodes": [
      "6720"
    ],
    "townsServed": [
      "Fanø"
    ]
  },
  "varde": {
    "municipalityName": "Varde Kommune",
    "population": 49468,
    "households": 23024,
    "cleaningFirmsCount": 45,
    "primaryPostal": "6800",
    "postalcodes": [
      "6800",
      "6753",
      "6818",
      "6823",
      "6830",
      "6840",
      "6851",
      "6852",
      "6853",
      "6854",
      "6855",
      "6857"
    ],
    "townsServed": [
      "Varde",
      "Agerbæk",
      "Årre",
      "Ansager",
      "Nørre Nebel",
      "Oksbøl",
      "Janderup Vestj",
      "Billum",
      "Vejers Strand",
      "Henne",
      "Outrup",
      "Blåvand"
    ]
  },
  "vejen": {
    "municipalityName": "Vejen Kommune",
    "population": 42641,
    "households": 19613,
    "cleaningFirmsCount": 39,
    "primaryPostal": "6600",
    "postalcodes": [
      "6600",
      "6621",
      "6622",
      "6630",
      "6650",
      "6660",
      "6670",
      "6682",
      "6683",
      "6752"
    ],
    "townsServed": [
      "Vejen",
      "Gesten",
      "Bække",
      "Rødding",
      "Brørup",
      "Lintrup",
      "Holsted",
      "Hovborg",
      "Føvling",
      "Glejbjerg"
    ]
  },
  "aabenraa": {
    "municipalityName": "Aabenraa Kommune",
    "population": 58405,
    "households": 28355,
    "cleaningFirmsCount": 53,
    "primaryPostal": "6200",
    "postalcodes": [
      "6200",
      "6210",
      "6230",
      "6330",
      "6340",
      "6360",
      "6372",
      "6392"
    ],
    "townsServed": [
      "Aabenraa",
      "Barsø",
      "Rødekro",
      "Padborg",
      "Kruså",
      "Tinglev",
      "Bylderup-Bov",
      "Bolderslev"
    ]
  },
  "fredericia": {
    "municipalityName": "Fredericia Kommune",
    "population": 52939,
    "households": 26322,
    "cleaningFirmsCount": 48,
    "primaryPostal": "7000",
    "postalcodes": [
      "7000"
    ],
    "townsServed": [
      "Fredericia"
    ]
  },
  "horsens": {
    "municipalityName": "Horsens Kommune",
    "population": 98806,
    "households": 46411,
    "cleaningFirmsCount": 90,
    "primaryPostal": "8700",
    "postalcodes": [
      "8700",
      "8732",
      "8740",
      "8751",
      "8752",
      "8789"
    ],
    "townsServed": [
      "Horsens",
      "Hovedgård",
      "Brædstrup",
      "Gedved",
      "Østbirk",
      "Endelave"
    ]
  },
  "kolding": {
    "municipalityName": "Kolding Kommune",
    "population": 96214,
    "households": 45450,
    "cleaningFirmsCount": 87,
    "primaryPostal": "6000",
    "postalcodes": [
      "6000",
      "6051",
      "6052",
      "6064",
      "6070",
      "6091",
      "6092",
      "6093",
      "6094",
      "6580",
      "6640"
    ],
    "townsServed": [
      "Kolding",
      "Almind",
      "Viuf",
      "Jordrup",
      "Christiansfeld",
      "Bjert",
      "Sønder Stenderup",
      "Sjølund",
      "Hejls",
      "Vamdrup",
      "Lunderskov"
    ]
  },
  "vejle": {
    "municipalityName": "Vejle Kommune",
    "population": 123250,
    "households": 56957,
    "cleaningFirmsCount": 112,
    "primaryPostal": "7100",
    "postalcodes": [
      "7100",
      "6040",
      "7080",
      "7120",
      "7173",
      "7182",
      "7183",
      "7184",
      "7300",
      "7321",
      "7323"
    ],
    "townsServed": [
      "Vejle",
      "Egtved",
      "Børkop",
      "Vejle Øst",
      "Vonge",
      "Bredsten",
      "Randbøl",
      "Vandel",
      "Jelling",
      "Gadbjerg",
      "Give"
    ]
  },
  "herning": {
    "municipalityName": "Herning Kommune",
    "population": 90546,
    "households": 42402,
    "cleaningFirmsCount": 82,
    "primaryPostal": "7400",
    "postalcodes": [
      "7400",
      "6933",
      "6973",
      "6990",
      "7270",
      "7280",
      "7451",
      "7480",
      "7490",
      "7540",
      "7550"
    ],
    "townsServed": [
      "Herning",
      "Kibæk",
      "Ørnhøj",
      "Ulfborg",
      "Stakroge",
      "Sønder Felding",
      "Sunds",
      "Vildbjerg",
      "Aulum",
      "Haderup",
      "Sørvad"
    ]
  },
  "holstebro": {
    "municipalityName": "Holstebro Kommune",
    "population": 59324,
    "households": 27952,
    "cleaningFirmsCount": 54,
    "primaryPostal": "7500",
    "postalcodes": [
      "7500",
      "7600",
      "7830"
    ],
    "townsServed": [
      "Holstebro",
      "Struer",
      "Vinderup"
    ]
  },
  "lemvig": {
    "municipalityName": "Lemvig Kommune",
    "population": 18596,
    "households": 9151,
    "cleaningFirmsCount": 17,
    "primaryPostal": "7620",
    "postalcodes": [
      "7620",
      "7570",
      "7650",
      "7660",
      "7673",
      "7680"
    ],
    "townsServed": [
      "Lemvig",
      "Vemb",
      "Bøvlingbjerg",
      "Bækmarksbro",
      "Harboøre",
      "Thyborøn"
    ]
  },
  "struer": {
    "municipalityName": "Struer Kommune",
    "population": 20122,
    "households": 9987,
    "cleaningFirmsCount": 18,
    "primaryPostal": "7560",
    "postalcodes": [
      "7560",
      "7790"
    ],
    "townsServed": [
      "Hjerm",
      "Thyholm"
    ]
  },
  "syddjurs": {
    "municipalityName": "Syddjurs Kommune",
    "population": 44394,
    "households": 20399,
    "cleaningFirmsCount": 40,
    "primaryPostal": "8410",
    "postalcodes": [
      "8410",
      "8400",
      "8420",
      "8444",
      "8543",
      "8544",
      "8550",
      "8560",
      "8581"
    ],
    "townsServed": [
      "Rønde",
      "Ebeltoft",
      "Knebel",
      "Balle",
      "Hornslet",
      "Mørke",
      "Ryomgård",
      "Kolind",
      "Nimtofte"
    ]
  },
  "norddjurs": {
    "municipalityName": "Norddjurs Kommune",
    "population": 36477,
    "households": 18477,
    "cleaningFirmsCount": 33,
    "primaryPostal": "8500",
    "postalcodes": [
      "8500",
      "8570",
      "8585",
      "8586",
      "8592",
      "8950",
      "8961",
      "8963"
    ],
    "townsServed": [
      "Grenaa",
      "Trustrup",
      "Glesborg",
      "Ørum Djurs",
      "Anholt",
      "Ørsted",
      "Allingåbro",
      "Auning"
    ]
  },
  "favrskov": {
    "municipalityName": "Favrskov Kommune",
    "population": 49773,
    "households": 21101,
    "cleaningFirmsCount": 45,
    "primaryPostal": "8382",
    "postalcodes": [
      "8382",
      "8370",
      "8450",
      "8472",
      "8860",
      "8870",
      "8881"
    ],
    "townsServed": [
      "Hinnerup",
      "Hadsten",
      "Hammel",
      "Sporup",
      "Ulstrup",
      "Langå",
      "Thorsø"
    ]
  },
  "odder": {
    "municipalityName": "Odder Kommune",
    "population": 24310,
    "households": 11222,
    "cleaningFirmsCount": 22,
    "primaryPostal": "8300",
    "postalcodes": [
      "8300",
      "8350",
      "8799"
    ],
    "townsServed": [
      "Odder",
      "Hundslund",
      "Tunø"
    ]
  },
  "randers": {
    "municipalityName": "Randers Kommune",
    "population": 100564,
    "households": 49894,
    "cleaningFirmsCount": 91,
    "primaryPostal": "8900",
    "postalcodes": [
      "8900",
      "8920",
      "8930",
      "8940",
      "8960",
      "8970",
      "8981",
      "8983"
    ],
    "townsServed": [
      "Randers C",
      "Randers NV",
      "Randers NØ",
      "Randers SV",
      "Randers SØ",
      "Havndal",
      "Spentrup",
      "Gjerlev J"
    ]
  },
  "silkeborg": {
    "municipalityName": "Silkeborg Kommune",
    "population": 102753,
    "households": 46429,
    "cleaningFirmsCount": 93,
    "primaryPostal": "8600",
    "postalcodes": [
      "8600",
      "7362",
      "7442",
      "8620",
      "8632",
      "8641",
      "8643",
      "8653",
      "8654",
      "8882",
      "8883"
    ],
    "townsServed": [
      "Silkeborg",
      "Hampen",
      "Engesvang",
      "Kjellerup",
      "Lemming",
      "Sorring",
      "Ans By",
      "Them",
      "Bryrup",
      "Fårvang",
      "Gjern"
    ]
  },
  "samsoe": {
    "municipalityName": "Samsø Kommune",
    "population": 3617,
    "households": 1948,
    "cleaningFirmsCount": 12,
    "primaryPostal": "8305",
    "postalcodes": [
      "8305"
    ],
    "townsServed": [
      "Samsø"
    ]
  },
  "skanderborg": {
    "municipalityName": "Skanderborg Kommune",
    "population": 66352,
    "households": 27831,
    "cleaningFirmsCount": 60,
    "primaryPostal": "8660",
    "postalcodes": [
      "8660",
      "8362",
      "8464",
      "8670",
      "8680"
    ],
    "townsServed": [
      "Skanderborg",
      "Hørning",
      "Galten",
      "Låsby",
      "Ry"
    ]
  },
  "aarhus": {
    "municipalityName": "Aarhus Kommune",
    "population": 378361,
    "households": 186792,
    "cleaningFirmsCount": 250,
    "primaryPostal": "8000",
    "postalcodes": [
      "8000",
      "8200",
      "8210",
      "8220",
      "8230",
      "8240",
      "8250",
      "8260",
      "8270",
      "8310",
      "8320",
      "8330"
    ],
    "townsServed": [
      "Aarhus C",
      "Aarhus N",
      "Aarhus V",
      "Brabrand",
      "Åbyhøj",
      "Risskov",
      "Egå",
      "Viby J",
      "Højbjerg",
      "Tranbjerg J",
      "Mårslet",
      "Beder"
    ]
  },
  "ikast-brande": {
    "municipalityName": "Ikast-Brande Kommune",
    "population": 43305,
    "households": 19267,
    "cleaningFirmsCount": 39,
    "primaryPostal": "7430",
    "postalcodes": [
      "7430",
      "7330",
      "7361",
      "7441",
      "8765",
      "8766"
    ],
    "townsServed": [
      "Ikast",
      "Brande",
      "Ejstrupholm",
      "Bording",
      "Klovborg",
      "Nørre Snede"
    ]
  },
  "ringkoebing-skjern": {
    "municipalityName": "Ringkøbing-Skjern Kommune",
    "population": 55405,
    "households": 25744,
    "cleaningFirmsCount": 50,
    "primaryPostal": "6950",
    "postalcodes": [
      "6950",
      "6880",
      "6893",
      "6900",
      "6920",
      "6940",
      "6960",
      "6971",
      "6980"
    ],
    "townsServed": [
      "Ringkøbing",
      "Tarm",
      "Hemmet",
      "Skjern",
      "Videbæk",
      "Lem St",
      "Hvide Sande",
      "Spjald",
      "Tim"
    ]
  },
  "hedensted": {
    "municipalityName": "Hedensted Kommune",
    "population": 48578,
    "households": 21709,
    "cleaningFirmsCount": 44,
    "primaryPostal": "8722",
    "postalcodes": [
      "8722",
      "7130",
      "7140",
      "7150",
      "7160",
      "7171",
      "8721",
      "8723",
      "8762",
      "8763",
      "8781",
      "8783"
    ],
    "townsServed": [
      "Hedensted",
      "Juelsminde",
      "Stouby",
      "Barrit",
      "Tørring",
      "Uldum",
      "Daugård",
      "Løsning",
      "Flemming",
      "Rask Mølle",
      "Stenderup",
      "Hornsyld"
    ]
  },
  "morsoe": {
    "municipalityName": "Morsø Kommune",
    "population": 19344,
    "households": 9757,
    "cleaningFirmsCount": 18,
    "primaryPostal": "7900",
    "postalcodes": [
      "7900",
      "7950",
      "7960",
      "7970",
      "7980",
      "7990"
    ],
    "townsServed": [
      "Nykøbing M",
      "Erslev",
      "Karby",
      "Redsted M",
      "Vils",
      "Øster Assels"
    ]
  },
  "skive": {
    "municipalityName": "Skive Kommune",
    "population": 44104,
    "households": 22119,
    "cleaningFirmsCount": 40,
    "primaryPostal": "7840",
    "postalcodes": [
      "7840",
      "7860",
      "7870",
      "7884"
    ],
    "townsServed": [
      "Højslev",
      "Spøttrup",
      "Roslev",
      "Fur"
    ]
  },
  "thisted": {
    "municipalityName": "Thisted Kommune",
    "population": 42572,
    "households": 20542,
    "cleaningFirmsCount": 39,
    "primaryPostal": "7700",
    "postalcodes": [
      "7700",
      "7730",
      "7741",
      "7742",
      "7752",
      "7755",
      "7760",
      "7770"
    ],
    "townsServed": [
      "Thisted",
      "Hanstholm",
      "Frøstrup",
      "Vesløs",
      "Snedsted",
      "Bedsted Thy",
      "Hurup Thy",
      "Vestervig"
    ]
  },
  "viborg": {
    "municipalityName": "Viborg Kommune",
    "population": 97874,
    "households": 46754,
    "cleaningFirmsCount": 89,
    "primaryPostal": "8800",
    "postalcodes": [
      "8800",
      "7470",
      "7800",
      "7850",
      "8830",
      "8831",
      "8832",
      "8840",
      "8850",
      "9632"
    ],
    "townsServed": [
      "Viborg",
      "Karup J",
      "Skive",
      "Stoholm Jyll",
      "Tjele",
      "Løgstrup",
      "Skals",
      "Rødkærsbro",
      "Bjerringbro",
      "Møldrup"
    ]
  },
  "broenderslev": {
    "municipalityName": "Brønderslev Kommune",
    "population": 36529,
    "households": 17122,
    "cleaningFirmsCount": 33,
    "primaryPostal": "9700",
    "postalcodes": [
      "9700",
      "9320",
      "9330",
      "9340",
      "9370",
      "9480",
      "9740"
    ],
    "townsServed": [
      "Brønderslev",
      "Hjallerup",
      "Dronninglund",
      "Asaa",
      "Hals",
      "Løkken",
      "Jerslev J"
    ]
  },
  "frederikshavn": {
    "municipalityName": "Frederikshavn Kommune",
    "population": 57523,
    "households": 29582,
    "cleaningFirmsCount": 52,
    "primaryPostal": "9900",
    "postalcodes": [
      "9900",
      "9300",
      "9352",
      "9750",
      "9970",
      "9981",
      "9982",
      "9990"
    ],
    "townsServed": [
      "Frederikshavn",
      "Sæby",
      "Dybvad",
      "Østervrå",
      "Strandby",
      "Jerup",
      "Ålbæk",
      "Skagen"
    ]
  },
  "vesthimmerlands": {
    "municipalityName": "Vesthimmerlands Kommune",
    "population": 35632,
    "households": 17411,
    "cleaningFirmsCount": 32,
    "primaryPostal": "9600",
    "postalcodes": [
      "9600",
      "9620",
      "9631",
      "9640",
      "9670",
      "9681"
    ],
    "townsServed": [
      "Aars",
      "Aalestrup",
      "Gedsted",
      "Farsø",
      "Løgstør",
      "Ranum"
    ]
  },
  "laesoe": {
    "municipalityName": "Læsø Kommune",
    "population": 1683,
    "households": 982,
    "cleaningFirmsCount": 12,
    "primaryPostal": "9940",
    "postalcodes": [
      "9940"
    ],
    "townsServed": [
      "Læsø"
    ]
  },
  "rebild": {
    "municipalityName": "Rebild Kommune",
    "population": 31280,
    "households": 13531,
    "cleaningFirmsCount": 28,
    "primaryPostal": "9530",
    "postalcodes": [
      "9530",
      "9520",
      "9541",
      "9560",
      "9574",
      "9575",
      "9610"
    ],
    "townsServed": [
      "Støvring",
      "Skørping",
      "Suldrup",
      "Hadsund",
      "Bælum",
      "Terndrup",
      "Nørager"
    ]
  },
  "mariagerfjord": {
    "municipalityName": "Mariagerfjord Kommune",
    "population": 41541,
    "households": 20201,
    "cleaningFirmsCount": 38,
    "primaryPostal": "9500",
    "postalcodes": [
      "9500",
      "8990",
      "9510",
      "9550"
    ],
    "townsServed": [
      "Hobro",
      "Fårup",
      "Arden",
      "Mariager"
    ]
  },
  "jammerbugt": {
    "municipalityName": "Jammerbugt Kommune",
    "population": 37998,
    "households": 18103,
    "cleaningFirmsCount": 35,
    "primaryPostal": "9440",
    "postalcodes": [
      "9440",
      "9460",
      "9490",
      "9492",
      "9493",
      "9690"
    ],
    "townsServed": [
      "Aabybro",
      "Brovst",
      "Pandrup",
      "Blokhus",
      "Saltum",
      "Fjerritslev"
    ]
  },
  "aalborg": {
    "municipalityName": "Aalborg Kommune",
    "population": 226033,
    "households": 116937,
    "cleaningFirmsCount": 205,
    "primaryPostal": "9000",
    "postalcodes": [
      "9000",
      "9200",
      "9210",
      "9220",
      "9230",
      "9240",
      "9260",
      "9270",
      "9280",
      "9293",
      "9310",
      "9362"
    ],
    "townsServed": [
      "Aalborg",
      "Aalborg SV",
      "Aalborg SØ",
      "Aalborg Øst",
      "Svenstrup J",
      "Nibe",
      "Gistrup",
      "Klarup",
      "Storvorde",
      "Kongerslev",
      "Vodskov",
      "Gandrup"
    ]
  },
  "hjoerring": {
    "municipalityName": "Hjørring Kommune",
    "population": 62979,
    "households": 31298,
    "cleaningFirmsCount": 57,
    "primaryPostal": "9800",
    "postalcodes": [
      "9800",
      "9760",
      "9830",
      "9850",
      "9870",
      "9881"
    ],
    "townsServed": [
      "Hjørring",
      "Vrå",
      "Tårs",
      "Hirtshals",
      "Sindal",
      "Bindslev"
    ]
  }
};
