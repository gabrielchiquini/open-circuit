import React, {Component} from 'react';
import CircuitCanvas from './CircuitCanvas';
import calculate from 'open-circuit-calculator';
import PartSelector from './PartSelector';
import Circuit from './Circuit/Circuit';
import {SomePart} from './Parts';
import IResponseRepresentation from "./Circuit/IResponseRepresentation";

export default class SimulatorContainer extends Component<{}, { selectedPart: SomePart, response: IResponseRepresentation[] }> {
  circuit: Circuit;

  constructor(props: {}) {
    super(props);
    this.circuit = new Circuit();
    this.state = {selectedPart: null, response: null};
  }

  render() {
    return (
      <div>
        <PartSelector
          changeSelectedPart={this.changedSelectedElement}
          selectedElement={this.getSelectedPart}
          simulate={this.simulate}

        />
        <CircuitCanvas
          circuit={this.circuit}
          selectedElement={this.getSelectedPart}
          response={this.state.response}
        />
      </div>
    );
  }

  getSelectedPart = () => {
    return this.state.selectedPart;
  };

  simulate = () => {
    console.log(this.circuit.getRepresentation());
    const response = calculate(this.circuit.getRepresentation()).map(value => {
      return {
        pole: value.pole,
        voltage: value.voltage.toFixed(2),
      };
    });
    this.setState({response});
  }

  private changedSelectedElement = (selectedPart: SomePart) => {
    this.setState({selectedPart});
  };
}
