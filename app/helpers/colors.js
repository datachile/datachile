import { scaleOrdinal } from 'd3-scale';

export const COLORS_CROP = {
  "Fibres": "#A599D0",
  "Cereals": "#C993A8",
  "Fruits": "#DB968E",
  "Oil Crops": "#D69F7A",
  "Pulses": "#DBC678",
  "Roots & Tubers": "#E7E79D",
  "Stimulants": "#C9DB78",
  "Sugar Crops": "#AED7A1",
  "Vegetables": "#809FC2"
};

export const COLORS_GENDER = {
  female: "#A599D0",
  male: "#C9DB78"
};

export const COLORS_RESIDENCE = {
  rural: "#AED7A1",
  urban: "#809FC2"
};

export const COLORS_CONDITION = {
  wasted: "#C993A8",
  stunted: "#D69F7A",
  underweight: "#DB968E"
};

export const ORDINAL_COLORS = ['#79C3F4','#245955','#22A29C','#70BFB8',
                               '#B2DAAF','#9FC57E','#F2EF94','#E1CF28',
                               '#F5907A','#F05454','#E61B3D','#A41D36',
                               '#892158','#E3A3C0','#B07CB4','#7F53AB',
                               '#5E56DF','#0F21B9','#9FADFF','#3770D5',
                               'red', 'green', 'blue'];

export const ordinalColorScale = scaleOrdinal().range(ORDINAL_COLORS);
