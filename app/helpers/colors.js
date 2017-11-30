import { scaleOrdinal } from "d3-scale";

export const COLORS_GENDER = ["#ccc", "#9B1E64", "#3F456B"];
export const genderColorScale = scaleOrdinal().range(COLORS_GENDER);

export const COLORS_SURVEY_RESPONSE = ["#ccc", "#1f496d", "#94424f"];

export const COLORS_TRADE_BALANCE = ["#E5656C", "#4E6FD0", "#ccc"];
export const tradeBalanceColorScale = scaleOrdinal().range(
  COLORS_TRADE_BALANCE
);

export const COLORS_INSTITUTIONS = [
  "#2892BD",
  "#4AB6C3",
  "#84CDBC",
  "#AFD898",
  "#2F67A6"
];
export const institutionsColorScale = scaleOrdinal().range(COLORS_INSTITUTIONS);

export const COLORS_EMPLOYMENT = ["#E8B25D", "#049FA3", "#E2646E", "#7167B2"];
export const employmentColorScale = scaleOrdinal().range(COLORS_EMPLOYMENT);

export const COLORS_EDUCATION_LEVEL = [
  "#381643",
  "#663058",
  "#9A5F8E",
  "#A090B1",
  "#7C7C77",
  "#C8CFD8",
  "#8EA3BA",
  "#596F84"
];
export const educationLevelColorScale = scaleOrdinal().range(
  COLORS_EDUCATION_LEVEL
);
export const RDTypesColorScale = scaleOrdinal().range(COLORS_EDUCATION_LEVEL);

export const COLORS_CONTINENTS = [
  "#84386E",
  "#5D5DA8",
  "#455084",
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
export const regionsColorScale = scaleOrdinal().range(PRODUCTS_COLORS);

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
