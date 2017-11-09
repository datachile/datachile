import { scaleOrdinal } from "d3-scale";

export const COLORS_GENDER = ["#ccc", "#9B1E64", "#3F456B"];
export const genderColorScale = scaleOrdinal().range(COLORS_GENDER);

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
