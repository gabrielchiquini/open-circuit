import React, { Component } from "react";
import CircuitCanvas from "./CircuitCanvas";
import PartSelector from "./PartSelector";
import Circuit from "./Circuit/Circuit";
import Part from "./Parts/Part";
import VoltageSource from "./Parts/VoltageSource";
import { SomePart } from "./Parts";

export default class SimulatorContainer extends Component {
  circuit: Circuit;
  private _selectedPart: SomePart;

  constructor(props: {}) {
    super(props);
    this.circuit = new Circuit();
    this._selectedPart = null;
  }

  render() {
    return (
      <div>
        <PartSelector changeSelectedPart={this.changedSelectedElement} />
        <CircuitCanvas circuit={this.circuit} selectedElement={this.getSelectedPart} />
      </div>

    );
  }

  getSelectedPart = () => {
    return this._selectedPart;
  }

  private changedSelectedElement = (part: SomePart) => {
    this._selectedPart = part;
  }
}
