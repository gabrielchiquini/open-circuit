import React, { Component } from "react";
import CircuitCanvas from "./CircuitCanvas";
import PartSelector from "./PartSelector";
import Circuit from "./Circuit/Circuit";
import Part from "./Parts/Part";
import VoltageSource from "./Parts/VoltageSource";

export type SomePart = new() => Part;

export default class SimulatorContainer extends Component {
  circuit: Circuit;
  selectedElement: SomePart;

  constructor(props: {}) {
    super(props);
    this.circuit = new Circuit();
    this.selectedElement = VoltageSource;
  }

  render() {
    return (
      <div>
        <PartSelector selectedElement={this.selectedElement} />
        <CircuitCanvas circuit={this.circuit} selectedElement={this.selectedElement} />
      </div>

    );
  }
}
