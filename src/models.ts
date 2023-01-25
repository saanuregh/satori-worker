import { FontStyle, FontWeight } from "satori";

export type FontConfig = {
  name: string;
  weight: FontWeight;
  style: FontStyle;
};

export type SatoriRequest = {
  html: string;
  width: number;
  height: number;
  fonts?: FontConfig[];
};
