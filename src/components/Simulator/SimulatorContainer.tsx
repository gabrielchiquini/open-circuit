import React, {Component} from "react";
import CircuitCanvas from "./CircuitCanvas";
import PartSelector from "./PartSelector";
import Circuit from "./Circuit/Circuit";
import {SomePart} from "./Parts";

export default class SimulatorContainer extends Component<{}, { selectedPart: SomePart }> {
  circuit: Circuit;

  constructor(props: {}) {
    super(props);
    this.circuit = new Circuit();
    this.state = {selectedPart: null};
  }

  render() {
    return (
      <div>
        <PartSelector changeSelectedPart={this.changedSelectedElement} selectedElement={this.getSelectedPart}/>
        <CircuitCanvas circuit={this.circuit} selectedElement={this.getSelectedPart}/>
      </div>

    );
  }

  getSelectedPart = () => {
    return this.state.selectedPart;
  };

  private changedSelectedElement = (selectedPart: SomePart) => {
    this.setState({selectedPart});
  };
}
