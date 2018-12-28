import Part from "./Part";

const defaultResistance = 1e3;

export default class Resistor extends Part {
  resistance: number;
  constructor() {
    super(2);
    this.resistance = defaultResistance;
  }
}
