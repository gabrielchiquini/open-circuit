import VoltageSource from "./VoltageSource";
import Resistor from "./Resistor";
import Part from "./Part";
import Ground from "./Ground";
import CurrentSource from "./CurrentSource";

export type SomePart = typeof Part & { imageSrc: string };

export const PARTS: Array<typeof Part> = [
  CurrentSource,
  VoltageSource,
  Resistor,
  Ground,
];
