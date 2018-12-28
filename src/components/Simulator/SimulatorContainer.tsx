import React, { Component } from "react";
import { connect, Provider } from 'react-redux';
import CircuitCanvas from "./CircuitCanvas";
import PartSelector from "./PartSelector";
import Resistor from "./Circuit/Parts/Resistor";
import Circuit from "./Circuit/Circuit";
import Part from "./Circuit/Parts/Part";

export type SomePart = new() => Part;

export default class SimulatorContainer extends Component {
  circuit: Circuit;
  selectedElement: SomePart;

  constructor(props: {}) {
    super(props);
    this.circuit = new Circuit();
    this.selectedElement = Resistor;
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
