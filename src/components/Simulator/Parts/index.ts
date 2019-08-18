import VoltageSource from "./VoltageSource";
import Resistor from "./Resistor";
import Part from "./Part";
import Ground from "./Ground";

export type SomePart = typeof Part & { imageSrc: string };

export const PARTS: Array<typeof Part> = [
  VoltageSource,
  Resistor,
  Ground,
];
