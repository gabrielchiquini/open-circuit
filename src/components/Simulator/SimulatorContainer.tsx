import React, {Component} from 'react';
import CircuitCanvas from './CircuitCanvas';
import calculate from 'open-circuit-calculator';
import PartSelector from './PartSelector';
import Circuit from './Circuit/Circuit';
import {SomePart} from './Parts';
import IResponseRepresentation from "./Circuit/IResponseRepresentation";

interface IState {
  selectedPart: SomePart;
  response: IResponseRepresentation;
}

export default class SimulatorContainer extends Component<{}, IState> {
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
    const nodes = calculate(this.circuit.getRepresentation()).map(value => {
      return {
        pole: value.pole,
        voltage: value.voltage.toFixed(2),
      };
    });
    const response: IResponseRepresentation = {
      timestamp: new Date(),
      nodes,
    };
    this.setState({response});
  };

  changedSelectedElement = (selectedPart: SomePart) => {
    this.setState({selectedPart});
  };
}
