import { scaleOrdinal } from "d3-scale";

export const COLORS_GENDER = ["#ccc", "#8E2D66", "#454C70"];

export const ORDINAL_COLORS = [
  "#79C3F4",
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
