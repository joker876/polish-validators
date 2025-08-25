import { removeWhitespace } from './_utils';

const IBAN_COUNTRY_DATA: Record<string, { country: string; length: number }> = {
  AL: { country: 'Albania', length: 28 },
  AD: { country: 'Andora', length: 24 },
  AT: { country: 'Austria', length: 20 },
  AZ: { country: 'Azerbejdżan', length: 28 },
  BH: { country: 'Bahrajn', length: 22 },
  BY: { country: 'Białoruś', length: 28 },
  BE: { country: 'Belgia', length: 16 },
  BA: { country: 'Bośnia i Hercegowina', length: 20 },
  BR: { country: 'Brazylia', length: 29 },
  BG: { country: 'Bułgaria', length: 22 },
  BI: { country: 'Burundi', length: 27 },
  CR: { country: 'Kostaryka', length: 22 },
  HR: { country: 'Chorwacja', length: 21 },
  CY: { country: 'Cypr', length: 28 },
  CZ: { country: 'Czechy', length: 24 },
  DK: { country: 'Dania', length: 18 },
  DJ: { country: 'Dżibuti', length: 27 },
  DO: { country: 'Dominikana', length: 28 },
  EG: { country: 'Egipt', length: 29 },
  SV: { country: 'Salwador', length: 28 },
  EE: { country: 'Estonia', length: 20 },
  FK: { country: 'Falklandy', length: 18 },
  FO: { country: 'Wyspy Owcze', length: 18 },
  FI: { country: 'Finlandia', length: 18 },
  FR: { country: 'Francja', length: 27 },
  GE: { country: 'Gruzja', length: 22 },
  DE: { country: 'Niemcy', length: 22 },
  GI: { country: 'Gibraltar', length: 23 },
  GR: { country: 'Grecja', length: 27 },
  GL: { country: 'Grenlandia', length: 18 },
  GT: { country: 'Gwatemala', length: 28 },
  VA: { country: 'Watykan', length: 22 },
  HU: { country: 'Węgry', length: 28 },
  IS: { country: 'Islandia', length: 26 },
  IQ: { country: 'Irak', length: 23 },
  IE: { country: 'Irlandia', length: 22 },
  IL: { country: 'Izrael', length: 23 },
  IT: { country: 'Włochy', length: 27 },
  JO: { country: 'Jordania', length: 30 },
  KZ: { country: 'Kazachstan', length: 20 },
  XK: { country: 'Kosowo', length: 20 },
  KW: { country: 'Kuwejt', length: 30 },
  LV: { country: 'Łotwa', length: 21 },
  LB: { country: 'Liban', length: 28 },
  LY: { country: 'Libia', length: 25 },
  LI: { country: 'Liechtenstein', length: 21 },
  LT: { country: 'Litwa', length: 20 },
  LU: { country: 'Luksemburg', length: 20 },
  MT: { country: 'Malta', length: 31 },
  MR: { country: 'Mauretania', length: 27 },
  MU: { country: 'Mauritius', length: 30 },
  MD: { country: 'Mołdawia', length: 24 },
  MC: { country: 'Monako', length: 27 },
  MN: { country: 'Mongolia', length: 20 },
  ME: { country: 'Czarnogóra', length: 22 },
  NL: { country: 'Holandia', length: 18 },
  NI: { country: 'Nikaragua', length: 28 },
  MK: { country: 'Macedonia Północna', length: 19 },
  NO: { country: 'Norwegia', length: 15 },
  PK: { country: 'Pakistan', length: 24 },
  PS: { country: 'Palestyna', length: 29 },
  PL: { country: 'Polska', length: 28 },
  PT: { country: 'Portugalia', length: 25 },
  QA: { country: 'Katar', length: 29 },
  RO: { country: 'Rumunia', length: 24 },
  RU: { country: 'Rosja', length: 33 },
  LC: { country: 'Saint Lucia', length: 32 },
  SM: { country: 'San Marino', length: 27 },
  ST: { country: 'Wyspy Świętego Tomasza i Książęca', length: 25 },
  SA: { country: 'Arabia Saudyjska', length: 24 },
  RS: { country: 'Serbia', length: 22 },
  SC: { country: 'Seszele', length: 31 },
  SK: { country: 'Słowacja', length: 24 },
  SI: { country: 'Słowenia', length: 19 },
  SO: { country: 'Somalia', length: 23 },
  ES: { country: 'Hiszpania', length: 24 },
  SD: { country: 'Sudan', length: 18 },
  OM: { country: 'Oman', length: 23 },
  SE: { country: 'Szwecja', length: 24 },
  CH: { country: 'Szwajcaria', length: 21 },
  TL: { country: 'Timor Wschodni', length: 23 },
  TN: { country: 'Tunezja', length: 24 },
  TR: { country: 'Turcja', length: 26 },
  UA: { country: 'Ukraina', length: 29 },
  AE: { country: 'Zjednoczone Emiraty Arabskie', length: 23 },
  GB: { country: 'Wielka Brytania', length: 22 },
  VG: { country: 'Brytyjskie Wyspy Dziewicze', length: 24 },
  YE: { country: 'Jemen', length: 30 },
};

const BANK_NAMES: Record<string, string> = {
  '101': 'Narodowy Bank Polski',
  '102': 'PKO BP',
  '103': 'Bank Handlowy (Citi Handlowy)',
  '105': 'ING Bank Śląski',
  '109': 'Santander Bank Polska',
  '113': 'BGK',
  '114': 'mBank',
  '116': 'Bank Millennium',
  '124': 'Pekao SA',
  '132': 'Bank Pocztowy',
  '137': 'DNB Bank Polska Spółka Akcyjna',
  '154': 'BOŚ Bank',
  '156': 'Velo Bank',
  '158': 'Mercedes-Benz Bank Polska',
  '161': 'SGB - Bank',
  '167': 'RBS Bank (Polska)',
  '168': 'Plus Bank',
  '184': 'Societe Generale',
  '187': 'Nest Bank',
  '193': 'Bank Polskiej Spółdzielczości',
  '194': 'Credit Agricole Bank Polska',
  '203': 'BNP Paribas',
  '212': 'Santander Consumer Bank',
  '216': 'Toyota Bank',
  '219': 'DNB Bank Polska',
  '248': 'Getin Noble Bank',
  '249': 'Alior Bank',
  '271': 'FCE Bank Polska',
  '272': 'Inbank',
  '277': 'Volkswagen Bank',
  '280': 'HSBC',
  '291': 'Aion Bank',
  '812': 'Bank Spółdzielczy w Porąbce',
  '845': 'Orzesko-Knurowski Bank Spółdzielczy',
  '914': 'Bank Spółdzielczy w Przysusze',
};

const BANK_FULL_NAMES: Record<string, string> = {
  "000": "Alior Bank Spółka Akcyjna",
  "101": "Narodowy Bank Polski",
  "102": "Powszechna Kasa Oszczędności Bank Polski Spółka Akcyjna",
  "103": "Bank Handlowy w Warszawie Spółka Akcyjna",
  "104": "Bank Millennium Spółka Akcyjna",
  "105": "ING Bank Śląski Spółka Akcyjna",
  "106": "Bank BPH Spółka Akcyjna",
  "109": "Santander Bank Polska Spółka Akcyjna",
  "113": "Bank Gospodarstwa Krajowego",
  "114": "mBank Spółka Akcyjna",
  "116": "Bank Millennium Spółka Akcyjna",
  "122": "Bank Handlowo-Kredytowy Spółka Akcyjna w Katowicach w likwidacji",
  "124": "Bank Polska Kasa Opieki Spółka Akcyjna",
  "128": "HSBC Continental Europe (Spółka Akcyjna) Oddział w Polsce",
  "132": "Bank Pocztowy Spółka Akcyjna",
  "137": "DNB Bank Polska Spółka Akcyjna",
  "139": "Santander Bank Polska Spółka Akcyjna",
  "144": "Powszechna Kasa Oszczędności Bank Polski Spółka Akcyjna",
  "146": "VeloBank Spółka Akcyjna",
  "147": "Bank Millennium Spółka Akcyjna",
  "150": "Santander Bank Polska Spółka Akcyjna",
  "151": "mBank Spółka Akcyjna",
  "152": "VeloBank Spółka Akcyjna",
  "154": "Bank Ochrony Środowiska Spółka Akcyjna",
  "156": "VeloBank Spółka Akcyjna",
  "157": "HSBC Continental Europe (Spółka Akcyjna) Oddział w Polsce",
  "160": "BNP Paribas Bank Polska Spółka Akcyjna",
  "161": "SGB-Bank Spółka Akcyjna",
  "163": "mBank Spółka Akcyjna",
  "168": "PLUS BANK Spółka Akcyjna",
  "171": "Bank BPH Spółka Akcyjna",
  "175": "BNP Paribas Bank Polska Spółka Akcyjna",
  "179": "Credit Agricole Bank Polska Spółka Akcyjna",
  "180": "ING Bank Śląski Spółka Akcyjna",
  "182": "Bank Handlowy w Warszawie Spółka Akcyjna",
  "183": "Danske Bank A/S Spółka Akcyjna Oddział w Polsce",
  "184": "Société Générale Spółka Akcyjna Oddział w Polsce",
  "186": "BNP Paribas S.A. Oddział w Polsce",
  "187": "Nest Bank Spółka Akcyjna",
  "188": "Deutsche Bank Polska Spółka Akcyjna",
  "189": "Pekao Bank Hipoteczny Spółka Akcyjna",
  "190": "Bank BPH Spółka Akcyjna",
  "191": "Santander Bank Polska Spółka Akcyjna",
  "193": "BANK POLSKIEJ SPÓŁDZIELCZOŚCI SPÓŁKA AKCYJNA",
  "194": "Credit Agricole Bank Polska Spółka Akcyjna",
  "195": "Bank Polska Kasa Opieki Spółka Akcyjna",
  "196": "Santander Consumer Bank Spółka Akcyjna",
  "197": "ING Bank Śląski Spółka Akcyjna",
  "200": "BNP Paribas Bank Polska Spółka Akcyjna",
  "201": "BANK POLSKIEJ SPÓŁDZIELCZOŚCI SPÓŁKA AKCYJNA",
  "202": "BANK POLSKIEJ SPÓŁDZIELCZOŚCI SPÓŁKA AKCYJNA",
  "204": "SGB-Bank Spółka Akcyjna",
  "205": "BANK POLSKIEJ SPÓŁDZIELCZOŚCI SPÓŁKA AKCYJNA",
  "206": "SGB-Bank Spółka Akcyjna",
  "208": "SGB-Bank Spółka Akcyjna",
  "210": "BANK POLSKIEJ SPÓŁDZIELCZOŚCI SPÓŁKA AKCYJNA",
  "211": "BANK POLSKIEJ SPÓŁDZIELCZOŚCI SPÓŁKA AKCYJNA",
  "212": "Santander Consumer Bank Spółka Akcyjna",
  "213": "Volkswagen Bank GmbH Spółka z ograniczoną odpowiedzialnością Oddział w Polsce",
  "214": "CA Auto Bank S.p.A. Spółka Akcyjna Oddział w Polsce",
  "215": "mBank Hipoteczny Spółka Akcyjna",
  "216": "Toyota Bank Polska Spółka Akcyjna",
  "218": "ING Bank Śląski Spółka Akcyjna",
  "219": "DNB Bank Polska Spółka Akcyjna",
  "220": "Svenska Handelsbanken AB Spółka Akcyjna Oddział w Polsce",
  "225": "Svenska Handelsbanken AB Spółka Akcyjna Oddział w Polsce",
  "226": "RCI Banque Spółka Akcyjna Oddział w Polsce",
  "229": "VeloBank Spółka Akcyjna",
  "233": "Credit Agricole Bank Polska Spółka Akcyjna",
  "234": "Raiffeisen Bank International AG (Spółka Akcyjna) Oddział w Polsce",
  "235": "BNP Paribas S.A. Oddział w Polsce",
  "236": "Danske Bank A/S Spółka Akcyjna Oddział w Polsce",
  "237": "Skandinaviska Enskilda Banken AB (Spółka Akcyjna) - Oddział w Polsce",
  "239": "CAIXABANK, S.A. (SPÓŁKA AKCYJNA) ODDZIAŁ W POLSCE",
  "241": "U.S. Bank Europe Designated Activity Company (Spółka z o.o. o Wyznaczonym Przedmiocie Działalności) Oddział w Polsce",
  "243": "BNP Paribas S.A. Oddział w Polsce",
  "247": "HAITONG BANK, S.A. Spółka Akcyjna Oddział w Polsce",
  "248": "VeloBank Spółka Akcyjna",
  "249": "Alior Bank Spółka Akcyjna",
  "251": "Aareal Bank Aktiengesellschaft (Spółka Akcyjna) - Oddział w Polsce",
  "253": "Nest Bank Spółka Akcyjna",
  "254": "Citibank Europe plc (Publiczna Spółka Akcyjna) Oddział w Polsce",
  "255": "Ikano Bank AB (publ) Spółka Akcyjna Oddział w Polsce",
  "256": "Nordea Bank Abp Spółka Akcyjna Oddział w Polsce",
  "258": "J.P. Morgan SE (Spółka Europejska) Oddział w Polsce",
  "260": "Bank of China (Europe) S.A. Spółka Akcyjna Oddział w Polsce",
  "262": "Industrial and Commercial Bank of China (Europe) S.A. (Spółka Akcyjna) Oddział w Polsce",
  "264": "RCI Banque Spółka Akcyjna Oddział w Polsce",
  "265": "EUROCLEAR Bank SA/NV (Spółka Akcyjna) - Oddział w Polsce",
  "266": "Intesa Sanpaolo S.p.A. Spółka Akcyjna Oddział w Polsce",
  "267": "Western Union International Bank GmbH, Sp. z o.o. Oddział w Polsce",
  "269": "PKO Bank Hipoteczny Spółka Akcyjna",
  "270": "TF BANK AB (Spółka Akcyjna) Oddział w Polsce",
  "272": "AS Inbank Spółka Akcyjna - Oddział w Polsce",
  "273": "China Construction Bank (Europe) S.A. (Spółka Akcyjna) Oddział w Polsce",
  "275": "John Deere Bank S.A. Spółka Akcyjna Oddział w Polsce",
  "277": "Volkswagen Bank GmbH Spółka z ograniczoną odpowiedzialnością Oddział w Polsce",
  "278": "ING Bank Hipoteczny Spółka Akcyjna",
  "279": "Raiffeisen Bank International AG (Spółka Akcyjna) Oddział w Polsce",
  "280": "HSBC Continental Europe (Spółka Akcyjna) Oddział w Polsce",
  "281": "Goldman Sachs Bank Europe SE Spółka Europejska Oddział w Polsce",
  "283": "J.P. Morgan SE (Spółka Europejska) Oddział w Polsce",
  "285": "BFF Bank S.p.A. Spółka Akcyjna Oddział w Polsce",
  "286": "CA Auto Bank S.p.A. Spółka Akcyjna Oddział w Polsce",
  "287": "Bank Nowy Spółka Akcyjna",
  "288": "Allfunds Bank S.A.U. (Spółka Akcyjna) Oddział w Polsce",
  "289": "Hoist Finance AB (publ) Spółka Akcyjna Oddział w Polsce",
  "290": "Millennium Bank Hipoteczny Spółka Akcyjna",
  "291": "AION Bank S.A. Spółka Akcyjna Oddział w Polsce",
  "293": "VeloBank Spółka Akcyjna",
  "294": "Morgan Stanley Europe SE (Spółka Europejska) Oddział w Polsce",
  "296": "Woori Bank Europe GmbH spółka z ograniczoną odpowiedzialnością Oddział w Polsce",
  "800": "Bank Spółdzielczy w Otwocku",
  "801": "Bank Spółdzielczy w Halinowie",
  "802": "Bank Spółdzielczy w Karczewie",
  "803": "Bank Spółdzielczy w Trzebieszowie",
  "804": "Bank Spółdzielczy w Łomazach",
  "805": "Bank Spółdzielczy w Białej Podlaskiej",
  "806": "Bank Spółdzielczy w Białymstoku",
  "808": "Bank Spółdzielczy w Hajnówce",
  "809": "Bank Spółdzielczy w Sokółce",
  "811": "Bank Spółdzielczy w Kalwarii Zebrzydowskiej",
  "813": "ABS Bank Spółdzielczy",
  "815": "Bank Spółdzielczy w Piotrkowie Kujawskim",
  "817": "Bank Spółdzielczy w Nakle n/Notecią",
  "818": "Wschodni Bank Spółdzielczy w Chełmie",
  "819": "Bank Spółdzielczy w Leśniowicach",
  "820": "Bank Spółdzielczy w Leśniowicach",
  "821": "Bank Spółdzielczy w Pułtusku",
  "822": "Bank Spółdzielczy w Glinojecku",
  "823": "Bank Spółdzielczy w Płońsku",
  "824": "Bank Spółdzielczy w Pułtusku",
  "825": "Bank Spółdzielczy w Krzepicach",
  "826": "Częstochowski Bank Spółdzielczy JURA BANK",
  "827": "Bank Spółdzielczy w Konopiskach",
  "828": "Międzypowiatowy Bank Spółdzielczy w Myszkowie",
  "829": "Międzypowiatowy Bank Spółdzielczy w Myszkowie",
  "830": "Bank Spółdzielczy w Malborku",
  "831": "Braniewsko - Pasłęcki Bank Spółdzielczy z siedzibą w Pasłęku",
  "832": "Bank Spółdzielczy w Sierakowicach",
  "833": "Bank Spółdzielczy w Starogardzie Gdańskim",
  "834": "Bank Spółdzielczy w Skórczu",
  "835": "Gospodarczy Bank Spółdzielczy w Barlinku",
  "837": "Bank Spółdzielczy w Rzepinie",
  "838": "Bank Spółdzielczy Lwówek Śląski w Lwówku Śląskim",
  "840": "Bank Spółdzielczy w Pleszewie",
  "841": "Rejonowy Bank Spółdzielczy w Lututowie",
  "843": "Bank Spółdzielczy w Będzinie",
  "844": "Bank Spółdzielczy w Pszczynie",
  "845": "Bank Spółdzielczy Czechowice-Dziedzice-Bestwina",
  "846": "Mikołowski Bank Spółdzielczy w Mikołowie",
  "849": "Bank Spółdzielczy w Łopusznie",
  "851": "Bank Spółdzielczy w Kielcach",
  "853": "Bank Spółdzielczy w Witkowie",
  "854": "Bank Spółdzielczy w Kłodawie",
  "855": "Bank Spółdzielczy w Witkowie",
  "856": "Ludowy Bank Spółdzielczy w Strzałkowie",
  "857": "Bank Spółdzielczy w Sławnie",
  "858": "Bank Spółdzielczy w Kaliszu Pomorskim",
  "859": "Krakowski Bank Spółdzielczy",
  "862": "Bank Spółdzielczy w Lipinkach",
  "865": "Bank Spółdzielczy we Wschowie",
  "866": "Bank Spółdzielczy we Wschowie",
  "868": "Rejonowy Bank Spółdzielczy w Bychawie",
  "869": "Rejonowy Bank Spółdzielczy w Bychawie",
  "870": "Bank Spółdzielczy w Niemcach",
  "871": "Bank Spółdzielczy w Lubartowie",
  "872": "Bank Spółdzielczy w Radzyniu Podlaskim",
  "873": "Powiatowy Bank Spółdzielczy w Opolu Lubelskim",
  "874": "Powiatowy Bank Spółdzielczy w Opolu Lubelskim",
  "875": "Bank Spółdzielczy w Kolnie",
  "877": "Bank Spółdzielczy w Mońkach",
  "878": "Bank Spółdzielczy Ziemi Kaliskiej",
  "879": "Bank Spółdzielczy w Limanowej",
  "880": "Łącki Bank Spółdzielczy",
  "882": "Bank Spółdzielczy w Bartoszycach",
  "883": "Bank Spółdzielczy w Nidzicy",
  "884": "Bank Spółdzielczy w Szczytnie",
  "885": "Bank Spółdzielczy w Bartoszycach",
  "886": "Bank Spółdzielczy w Namysłowie",
  "887": "Bank Spółdzielczy w Zawadzkiem",
  "888": "Bank Spółdzielczy w Gogolinie",
  "890": "Bank Spółdzielczy w Zawadzkiem",
  "891": "Kurpiowski Bank Spółdzielczy w Myszyńcu",
  "892": "Bank Spółdzielczy w Krasnosielcu z siedzibą w Makowie Mazowieckim",
  "893": "Bank Spółdzielczy w Pułtusku",
  "894": "Spółdzielczy Bank Ludowy w Złotowie",
  "895": "Lubusko-Wielkopolski Bank Spółdzielczy",
  "896": "naturoBank Bank Spółdzielczy",
  "898": "Powiatowy Bank Spółdzielczy w Tomaszowie Mazowieckim",
  "899": "Powiatowy Bank Spółdzielczy w Tomaszowie Mazowieckim",
  "900": "Bank Spółdzielczy \"MAZOWSZE\" w Płocku",
  "901": "Bank Spółdzielczy \"MAZOWSZE\" w Płocku",
  "903": "Rejonowy Bank Spółdzielczy w Lututowie",
  "904": "Bank Spółdzielczy \"Wspólna Praca\" w Kutnie",
  "905": "Powiatowy Bank Spółdzielczy we Wrześni",
  "906": "Bank Spółdzielczy w Gnieźnie",
  "907": "Bank Spółdzielczy Pojezierza Międzychodzko - Sierakowskiego w Sierakowie",
  "908": "Bank Spółdzielczy Duszniki",
  "911": "Bank Spółdzielczy Rzemiosła w Radomiu",
  "912": "Bank Spółdzielczy w Zwoleniu",
  "913": "Bank Spółdzielczy w Przysusze",
  "914": "Bank Spółdzielczy Rzemiosła w Radomiu",
  "915": "Bank Spółdzielczy Rzemiosła w Radomiu",
  "916": "Bank Spółdzielczy w Strzyżowie",
  "917": "Bank Spółdzielczy w Sędziszowie Młp.",
  "918": "Bank Spółdzielczy w Przecławiu",
  "919": "Bank Spółdzielczy w Siedlcach",
  "920": "Bank Spółdzielczy w Krzywdzie",
  "921": "Bank Spółdzielczy w Rykach",
  "922": "Bank Spółdzielczy w Mińsku Mazowieckim",
  "923": "Powiatowy Bank Spółdzielczy w Sokołowie Podlaskim",
  "924": "Bank Spółdzielczy w Warcie",
  "925": "Nadwarciański Bank Spółdzielczy w Działoszynie",
  "926": "Rejonowy Bank Spółdzielczy w Lututowie",
  "928": "Rejonowy Bank Spółdzielczy w Lututowie",
  "929": "Bank Spółdzielczy w Skierniewicach",
  "931": "Bank Spółdzielczy w Ustce",
  "932": "Bank Spółdzielczy w Bytowie",
  "933": "Bank Spółdzielczy w Ustce",
  "934": "Mazurski Bank Spółdzielczy w Giżycku",
  "935": "Bank Spółdzielczy w Sejnach",
  "936": "Bank Spółdzielczy w Sejnach",
  "937": "Bank Spółdzielczy Ziemi Szczecińskiej",
  "938": "Bank Spółdzielczy w Chojnie",
  "939": "Bank Spółdzielczy w Tarnobrzegu",
  "940": "Nadsański Bank Spółdzielczy",
  "941": "Nadwiślański Bank Spółdzielczy w Solcu-Zdroju",
  "942": "Bank Spółdzielczy w Sandomierzu",
  "943": "Bank Spółdzielczy w Tarnobrzegu",
  "944": "Bank Spółdzielczy Rzemiosła w Krakowie",
  "946": "Bank Spółdzielczy Rzemiosła w Krakowie",
  "947": "Bank Spółdzielczy w Pilźnie",
  "948": "Bank Spółdzielczy w Brodnicy",
  "949": "Bank Spółdzielczy w Brodnicy",
  "950": "Bank Spółdzielczy w Łasinie",
  "951": "Bank Spółdzielczy w Ząbkowicach Śląskich",
  "952": "Bank Spółdzielczy w Ząbkowicach Śląskich",
  "953": "Bank Spółdzielczy w Jaworze",
  "954": "Kujawsko-Dobrzyński Bank Spółdzielczy",
  "957": "Bank Spółdzielczy w Oławie",
  "959": "Bank Spółdzielczy w Żmigrodzie",
  "960": "Bank Spółdzielczy w Tomaszowie Lubelskim",
  "961": "Bank Spółdzielczy w Izbicy",
  "962": "Bank Spółdzielczy w Tomaszowie Lubelskim",
  "963": "Bank Spółdzielczy w Tomaszowie Lubelskim",
  "964": "Powiatowy Bank Spółdzielczy w Zamościu",
  "965": "Bank Spółdzielczy w Środzie Śląskiej",
  "966": "Bank Spółdzielczy w Siedlcu",
  "967": "Bank Spółdzielczy w Żaganiu",
}

export const BankName = {
  NBP: 'Narodowy Bank Polski',
  PKOBP: 'PKO BP',
  BankHandlowy: 'Bank Handlowy (Citi Handlowy)',
  ING: 'ING Bank Śląski',
  SantanderBankPolska: 'Santander Bank Polska',
  BGK: 'BGK',
  mBank: 'mBank',
  Millenium: 'Bank Millennium',
  PekaoSA: 'Pekao SA',
  BankPocztowy: 'Bank Pocztowy',
  BOSBank: 'BOŚ Bank',
  MercedezBenzBank: 'Mercedes-Benz Bank Polska',
  SGB: 'SGB - Bank',
  RBSBank: 'RBS Bank (Polska)',
  PlusBank: 'Plus Bank',
  SocieteGenerale: 'Societe Generale',
  NestBank: 'Nest Bank',
  BankPolskiejSpoldzielczosci: 'Bank Polskiej Spółdzielczości',
  CreditAgricole: 'Credit Agricole Bank Polska',
  BNPParibas: 'BNP Paribas',
  StantanderConsumerBank: 'Santander Consumer Bank',
  ToyotaBank: 'Toyota Bank',
  DNB: 'DNB Bank Polska',
  GetinNobleBank: 'Getin Noble Bank',
  AliorBank: 'Alior Bank',
  FCE: 'FCE Bank Polska',
  Inbank: 'Inbank',
  VolksvagenBank: 'Volkswagen Bank',
  HSBC: 'HSBC',
  AionBank: 'Aion Bank',
} as const;
export type BankName = (typeof BankName)[keyof typeof BankName];

const IBAN_REGEX = /^([A-Z]{2})?(\d{2})(\d{3})(\d{8,25})$/i;
const IBAN_BANK_DATA_REGEX = /^(?:[A-Z]{2})?\d{2}(\d{3})/i;

function _modulo(number: string, mod: number): number {
  let result = 0;
  for (let i = 0; i < number.length; i++) {
    result = parseInt(result.toString() + number[i]) % mod;
  }
  return result;
}

/**
 * Validates an International Bank Account Number (IBAN). The function checks for
 * proper length, format, and passes the IBAN checksum requirements. In the case of
 * IBANs starting with `PL` (or with no country code), the 3rd-5th digits are validated
 * against a list of Polish banks. Any whitespace is ignored, but other characters will
 * result in the IBAN being invalid.
 *
 * @param {string} iban - The IBAN number as a string, with or without spaces.
 * @returns {boolean} `true` if the IBAN is valid; `false` otherwise.
 */
export function isIbanValid(iban: string): boolean {
  iban = removeWhitespace(iban).toUpperCase();

  // Validate the structure using the regex.
  const match = iban.match(IBAN_REGEX);
  if (!match) {
    return false;
  }
  // Destructure the regex match, defaulting to 'PL' if the country code is missing.
  const [, countryCode = 'PL', controlSum, bankNameNumber, rest] = match;

  // Check the overall length for the given country.
  if (
    !IBAN_COUNTRY_DATA[countryCode] ||
    controlSum.length + bankNameNumber.length + rest.length + 2 !== IBAN_COUNTRY_DATA[countryCode].length
  ) {
    return false;
  }

  // For Polish IBANs, verify that the bank code is in our known list.
  if (countryCode === 'PL' && !BANK_NAMES[bankNameNumber]) {
    return false;
  }

  // Rearrange the IBAN: move the first 4 characters (country code and control sum)
  // to the end. The BBAN (bankNameNumber + rest) comes first.
  const rearranged =
    bankNameNumber +
    rest +
    (countryCode.charCodeAt(0) - 55).toString() +
    (countryCode.charCodeAt(1) - 55).toString() +
    controlSum;
  const checkSum = _modulo(rearranged, 97);

  return checkSum === 1;
}

/**
 * Returns true if the IBAN is invalid; false otherwise.
 *
 * @param {string} iban - The IBAN number as a string.
 * @returns {boolean}
 */
export const isIbanInvalid = (iban: string) => !isIbanValid(iban);

/**
 * Extracts country-specific information from the IBAN.
 *
 * @param {string} iban - The IBAN number as a string.
 * @returns {{ country: string; length: number } | null} An object containing the country name
 * and IBAN length for the given IBAN, or `null` if not valid.
 */
export function getCountryIbanDataFromIban(iban: string): { country: string; length: number } | null {
  iban = removeWhitespace(iban).toUpperCase();
  if (iban.length < 2) {
    return null;
  }
  const countryCode = iban.slice(0, 2);
  return IBAN_COUNTRY_DATA[countryCode] ?? null;
}

/**
 * Fetches the bank name based on the IBAN, specifically for Polish IBANs.
 * If a non-Polish IBAN is supplied, it will always return `null`.
 *
 * @param {string} iban - The IBAN number as a string.
 * @returns {string | null} The bank name as a string, or `null` if not available.
 */
export function getBankNameFromIban(iban: string): string | null {
  iban = removeWhitespace(iban).toUpperCase();
  if (!iban.startsWith('PL')) {
    return null;
  }
  const match = iban.match(IBAN_BANK_DATA_REGEX);
  if (!match) {
    return null;
  }
  const bankCode = match[1];
  return BANK_NAMES[bankCode] ?? null;
}