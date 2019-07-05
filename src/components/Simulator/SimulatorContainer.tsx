import React, { Component } from 'react';
import CircuitCanvas from './CircuitCanvas';
import calculate from 'open-circuit-calculator';
import PartSelector from './PartSelector';
import Circuit from './Circuit/Circuit';
import { SomePart } from './Parts';

export default class SimulatorContainer extends Component<{}, { selectedPart: SomePart, response: string[] }> {
  circuit: Circuit;

  constructor(props: {}) {
    super(props);
    this.circuit = new Circuit();
    this.state = { selectedPart: null, response: null };
  }

  render() {
    return (
      <div>
        <PartSelector
          changeSelectedPart={this.changedSelectedElement}
          selectedElement={this.getSelectedPart}
          simulate={this.simulate}
          response={this.state.response}
        />
        <CircuitCanvas circuit={this.circuit} selectedElement={this.getSelectedPart} />
      </div>
    );
  }

  getSelectedPart = () => {
    return this.state.selectedPart;
  };

  simulate = () => {
    const response = calculate(this.circuit.getRepresentation()).map(value => value.toFixed(2));
    this.setState({ response });
  }

  private changedSelectedElement = (selectedPart: SomePart) => {
    this.setState({selectedPart});
  };
}
