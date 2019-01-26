import VoltageSource from "./VoltageSource";
import Resistor from "./Resistor";
import Part from "./Part";

export type SomePart = (new() => Part) & { imageSrc: string };

export const PARTS: SomePart[] = [
  VoltageSource,
  Resistor,
];
