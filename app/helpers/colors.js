import { scaleOrdinal } from "d3-scale";

export function hexToRGB(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

export const COLORS_GENDER = ["#ccc", "#9B1E64", "#3F456B"];
export const genderColorScale = scaleOrdinal().range(COLORS_GENDER);

export const COLORS_SURVEY_RESPONSE = ["#ccc", "#1f496d", "#94424f"];

export const COLORS_REGIONS = [
  //"#ccc",
  "#d28a39",
  "#e9884b",
  "#d25e39",
  "#f55443",
  "#8c2a3d",
  "#455084",
  "#487782",
  "#00b486",
  "#169699",
  "#7f92cc",
  "#78bbff",
  "#62717f",
  "#752155",
  "#3eb3ce",
  "#ffbe46"
];

export const COLORS_SCALE_EXPORTS = ["#ccd5f1", "#5076C4"];
export const COLORS_SCALE_IMPORTS = ["#f8d8db", "#E56671"];

export const COLORS_SCALE_INFANT_MORTALITY = ["#eee", "#80CBC4", "#009688"];

export const COLORS_TRADE_BALANCE = ["#E5656C", "#4E6FD0", "#ccc"];
export const tradeBalanceColorScale = scaleOrdinal().range(
  COLORS_TRADE_BALANCE
);

export const civicsColorScale = scaleOrdinal().range([
  "#FED6D7",
  "#FAA7A8",
  "#FD9F6D",
  "#F3A75C",
  "#FD835C",
  "#DD654F",
  "#F65A5D",
  "#DA4548",
  "#C50A3C",
  "#C90914",
  "#82070C",
  "#AE4E5E",
  "#CA3A6D",
  "#AA0C5D",
  "#95174B"
]);

export const COLORS_INSTITUTIONS = [
  "#2892BD",
  "#4AB6C3",
  "#84CDBC",
  "#AFD898",
  "#2F67A6"
];
export const institutionsColorScale = scaleOrdinal().range(COLORS_INSTITUTIONS);

export const crimesColorScale = scaleOrdinal().range([
  "#1D4A37",
  "#558E6B",
  "#AEBC7A",
  "#D9EAB7",
  "#D8DB7B"
]);

export const COLORS_HEALTHINSURANCE = [
  "#35468C",
  "#7FB1F0",
  "#3B88CD",
  "#1B486D",
  "#464960"
];
export const healthInsuranceColorScale = scaleOrdinal().range(
  COLORS_HEALTHINSURANCE
);

export const COLORS_INDUSTRY_OCCUPATION = [
  "#BF6083",
  "#734C6C",
  "#F06060",
  "#F2A679",
  "#664848",
  "#8E3D3D",
  "#6B1C33",
  "#99174C"
];
export const industryOccupationColorScale = scaleOrdinal().range(
  COLORS_INDUSTRY_OCCUPATION
);

export const employmentBySexColorScale = scaleOrdinal().range([
  "#F9B938",
  "#00A2AE",
  "#E8696D",
  "#7167B2"
]);

export const incomeByAgeColorScale = scaleOrdinal().range([
  "#E4B0AE",
  "#843835",
  "#E56F6A",
  "#1D8CA1",
  "#3FB8C9"
]);

export const COLORS_MIGRATION_BY_EDUCATION = [
  "#12A29B",
  "#73BFB8",
  "#275854",
  "#B3D9B0",
  "#F2EE99",
  "#A0C481",
  "#77C1E0"
];

export const migrationByEducationColorScale = scaleOrdinal().range(
  COLORS_MIGRATION_BY_EDUCATION
);

export const COLORS_EMPLOYMENT = [
  "#74C0E2",
  "#406662",
  "#549E95",
  "#8ABDB6",
  "#BCD8AF",
  "#A8C380",
  "#EDE788",
  "#D6C650",
  "#DC8E7A",
  "#D05555",
  "#BF3251",
  "#872A41",
  "#993F7B",
  "#7454A6",
  "#A17CB0"
];
export const employmentColorScale = scaleOrdinal().range(COLORS_EMPLOYMENT);

export const COLORS_EDUCATION_LEVEL = [
  "#574162",
  "#695475",
  "#7b6788",
  "#8d7b9d",
  "#a090b1",
  "#8e88a6",
  "#7d7f9a",
  "#6b778f",
  "#596f84"
];
export const educationLevelColorScale = scaleOrdinal().range(
  COLORS_EDUCATION_LEVEL
);
export const RDTypesColorScale = scaleOrdinal().range(COLORS_EDUCATION_LEVEL);

export const COLORS_CONTINENTS = [
  "#84386E",
  "#5D5DA8",
  "#335cb5",
  "#3C8181",
  "#E89CA2",
  "#CCBC4A"
];
export const continentColorScale = scaleOrdinal().range(COLORS_CONTINENTS);

export const PRODUCTS_COLORS = [
  "#74C0E2",
  "#406662",
  "#549E95",
  "#8ABDB6",
  "#BCD8AF",
  "#A8C380",
  "#EDE788",
  "#D6C650",
  "#DC8E7A",
  "#D05555",
  "#BF3251",
  "#872A41",
  "#993F7B",
  "#7454A6",
  "#A17CB0",
  "#D1A1BC",
  "#A1AAFB",
  "#5C57D9",
  "#1C26B3",
  "#4D6FD0",
  "#7485AA"
];
export const productsColorScale = scaleOrdinal().range(PRODUCTS_COLORS);
export const regionsColorScale = scaleOrdinal().range(COLORS_REGIONS);

export const INDUSTRIES_COLORS = [
  "#70BFB8",
  "#B2DAAF",
  "#9FC57E",
  "#EDE788",
  "#E1CF27",
  "#F5907A",
  "#E24040",
  "#E61B3D",
  "#A41D36",
  "#882158",
  "#E3A3C0",
  "#B07DB4",
  "#7F53AB",
  "#5E56DF",
  "#0F21B9",
  "#9FADFF",
  "#3670D5",
  "#7C4848",
  "#476D47",
  "#30396B",
  "#79C3F4"
];
export const industriesColorScale = scaleOrdinal().range(INDUSTRIES_COLORS);

export const ORDINAL_COLORS = [
  "#74C0E2",
  "#245955",
  "#22A29C",
  "#70BFB8",
  "#B2DAAF",
  "#9FC57E",
  "#F2EF94",
  "#E1CF28",
  "#F5907A",
  "#F05454",
  "#E61B3D",
  "#A41D36",
  "#892158",
  "#E3A3C0",
  "#B07CB4",
  "#7F53AB",
  "#5E56DF",
  "#0F21B9",
  "#9FADFF",
  "#3770D5",
  "red",
  "green",
  "blue"
];
export const ordinalColorScale = scaleOrdinal().range(ORDINAL_COLORS);

export const administrationColorScale = scaleOrdinal().range([
  "#823A6D",
  "#5D5FA6",
  "#365ED2",
  "#3F8180"
]);

export const MAP_SCALE_COLORS = {
  getItem(key) {
    return this[key] || [];
  },
  economy: [
    "#E3E7EF",
    "#B1C0D7",
    "#96AACA",
    "#7D95BD",
    "#637FAF",
    "#486AA2",
    "#39578A",
    "#1E407A"
  ],
  education: [
    "#E8E1EF",
    "#D2C4DD",
    "#BBA6CD",
    "#A388BC",
    "#8C6AAB",
    "#764C9A",
    "#5F308A",
    "#481679"
  ],
  environment: [
    "#E1F4F2",
    "#C3E8E5",
    "#A5DDD8",
    "#87D1CC",
    "#69C6BF",
    "#4DBBB2",
    "#33AFA4",
    "#1DA397"
  ],
  demographics: [
    "#F7E2E7",
    "#EEC6CF",
    "#E6A9B7",
    "#DE8C9F",
    "#D57086",
    "#CD536F",
    "#C53857",
    "#BD1D41"
  ],
  health: [
    "#E2F5F8",
    "#C4EAF1",
    "#A7E0E9",
    "#8AD5E3",
    "#6DCBDC",
    "#51C1D5",
    "#37B6CE",
    "#22ACC6"
  ],
  civics: [
    "#FEEAE6",
    "#FED5CD",
    "#FEC0B5",
    "#FDAB9B",
    "#FD9683",
    "#FD816A",
    "#FD6C53",
    "#FC583C"
  ]
};

export const coalitionColorScale = [
  {
    keys: [7, 10, 13, 14],
    elected: "#BC2E35",
    no_elected: "#F99398",
    base: "#F65A5D",
    slug: "nueva-mayoria"
  },
  {
    keys: [1, 4, 5, 17],
    elected: "#0E518E",
    no_elected: "#578AC1",
    base: "#416797",
    slug: "chile-vamos"
  },
  {
    keys: [9, 16, 12],
    elected: "#089E93",
    no_elected: "#6BCEC7",
    base: "#42B2AC",
    slug: "frente-amplio"
  },
  {
    keys: [6],
    elected: "#05B2C9",
    no_elected: "#6EDAE5",
    base: "#27C9E5",
    slug: "regionalista"
  },
  {
    keys: [18, 19],
    elected: "#853099",
    no_elected: "#C97DDB",
    base: "#90539B",
    slug: "progresista"
  },
  {
    keys: [8],
    elected: "#EABA42",
    no_elected: "#F9DB98",
    base: "#EFCA65",
    slug: "democracia-cristiana"
  },
  {
    keys: [2],
    elected: "#828229",
    no_elected: "#B2B269",
    base: "#A0A838",
    slug: "independiente"
  },
  {
    keys: [20],
    elected: "#AD1E6D",
    no_elected: "#A54A78",
    base: "#95174B",
    slug: "sumemos"
  },
  {
    keys: [0],
    elected: "#B5D9F7",
    no_elected: "#B5D9F7",
    base: "#B5D9F7",
    slug: "nulo-blanco"
  },
  {
    keys: [3, 11, 15, 21],
    elected: "#ccc",
    no_elected: "#ccc",
    base: "#ccc",
    slug: "sin-asignar"
  }
];

export const presidentialColorScale = [
  {
    keys: [1, 567],
    elected: "#BC2E35",
    no_elected: "#F99398",
    base: "#F65A5D",
    slug: "nueva-mayoria"
  },
  {
    keys: [2, 2649],
    elected: "#0E518E",
    no_elected: "#578AC1",
    base: "#416797",
    slug: "chile-vamos"
  },
  {
    keys: [2650],
    elected: "#089E93",
    no_elected: "#6BCEC7",
    base: "#42B2AC",
    slug: "frente-amplio"
  },
  {
    keys: [],
    elected: "#05B2C9",
    no_elected: "#6EDAE5",
    base: "#27C9E5",
    slug: "regionalista"
  },
  {
    keys: [3],
    elected: "#853099",
    no_elected: "#C97DDB",
    base: "#90539B",
    slug: "progresista"
  },
  {
    keys: [561],
    elected: "#EABA42",
    no_elected: "#F9DB98",
    base: "#EFCA65",
    slug: "democracia-cristiana"
  },
  {
    keys: [],
    elected: "#828229",
    no_elected: "#B2B269",
    base: "#A0A838",
    slug: "independiente"
  },
  {
    keys: [],
    elected: "#AD1E6D",
    no_elected: "#A54A78",
    base: "#95174B",
    slug: "sumemos"
  },
  {
    keys: [8, 9],
    elected: "#B5D9F7",
    no_elected: "#B5D9F7",
    base: "#B5D9F7",
    slug: "nulo-blanco"
  },
  {
    keys: [],
    elected: "#000",
    no_elected: "#000",
    base: "#000",
    slug: "sin-asignar"
  },
  {
    keys: [147],
    elected: "#297F7D",
    no_elected: "#297F7D",
    base: "#297F7D",
    slug: "jose-antonio-kast"
  },
  {
    keys: [2651],
    elected: "#567569",
    no_elected: "#567569",
    base: "#567569",
    slug: "eduardo-artes"
  },
  {
    keys: [535],
    elected: "#679A7C",
    no_elected: "#679A7C",
    base: "#679A7C",
    slug: "alejandro-navarro"
  },
  {
    keys: [7],
    elected: "#27B87A",
    no_elected: "#27B87A",
    base: "#27B87A",
    slug: "roxana-miranda"
  },
  {
    keys: [10],
    elected: "#63CB9D",
    no_elected: "#63CB9D",
    base: "#63CB9D",
    slug: "ricardo-israel"
  },
  {
    keys: [4],
    elected: "#42B2AC",
    no_elected: "#42B2AC",
    base: "#42B2AC",
    slug: "franco-parisi"
  },
  {
    keys: [11],
    elected: "#6AC0C6",
    no_elected: "#6AC0C6",
    base: "#6AC0C6",
    slug: "tomas-jholt"
  },
  {
    keys: [5],
    elected: "#C6EFA7",
    no_elected: "#C6EFA7",
    base: "#C6EFA7",
    slug: "marcel-claude"
  },
  {
    keys: [6],
    elected: "#9AEBC6",
    no_elected: "#9AEBC6",
    base: "#9AEBC6",
    slug: "alfredo-sfeir"
  }
];

export const INDEPENDENT_COLORS = [
  "#297F7D",
  "#567569",
  "#679A7C",
  "#27B87A",
  "#63CB9D",
  "#42B2AC",
  "#6AC0C6",
  "#C6EFA7",
  "#9AEBC6"
];

export const independentColorScale = scaleOrdinal().range(INDEPENDENT_COLORS);

export const snedColorScale = scaleOrdinal().range([
  "#0D659D",
  "#1BAAC0",
  "#9AEBC6"
]);

export const snedComparisonColorScale = scaleOrdinal().range([
  "#3698BA",
  "#4CCCCC",
  "#8AC1A5"
]);
