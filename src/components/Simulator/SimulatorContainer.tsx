import React, {Component} from 'react';
import CircuitCanvas from './CircuitCanvas';
import calculate, {CircuitError} from 'open-circuit-calculator';
import PartSelector from './PartSelector';
import Circuit from './Circuit/Circuit';
import {SomePart} from './Parts';
import IResponseRepresentation from "./Circuit/IResponseRepresentation";
import {Subject} from "rxjs";

interface IState {
  selectedPart: SomePart;
}

export default class SimulatorContainer extends Component<{}, IState> {
  circuit: Circuit;
  addPartSubject = new Subject<void>();
  responseSubject = new Subject<IResponseRepresentation>();


  constructor(props: {}) {
    super(props);
    this.circuit = new Circuit();
    this.state = {selectedPart: null};
  }

  render() {
    return (
      <div>
        <PartSelector
          changeSelectedPart={this.changedSelectedElement}
          selectedElement={this.getSelectedPart}
          simulate={this.simulate}
          addPart={() => this.addPartSubject.next()}
        />
        <CircuitCanvas
          circuit={this.circuit}
          selectedElement={this.getSelectedPart}
          addPart$={this.addPartSubject.asObservable()}
          response$={this.responseSubject.asObservable()}
        />
      </div>
    );
  }

  getSelectedPart = () => {
    return this.state.selectedPart;
  };

  simulate = () => {
    try {
      const nodes = calculate(this.circuit.getRepresentation()).map(value => {
        return {
          pole: value.pole,
          voltage: this.getVoltageText(value.voltage),
        };
      });
      const response: IResponseRepresentation = {
        timestamp: new Date(),
        nodes,
      };
      this.responseSubject.next(response);
    } catch (err) {
      const e = err as CircuitError;
      if (e.floating) {
        alert('O circuito possui elementos flutuando');
      } else if (e.shortCircuit) {
        alert('O circuito possui elementos em curto circuito');
      } else if (e.groundMissing) {
        alert('O circuito não possui o elemento terra');
      }
    }
  };

  changedSelectedElement = (selectedPart: SomePart) => {
    const callback = this.state.selectedPart ? (() => {
      this.addPartSubject.next();
    }) : undefined;
    this.setState({selectedPart}, callback);

  };

  private getVoltageText(value: number): string {
    const order = Math.floor(Math.log10(value)) + 1;
    if (order > 0) {
      return value + ' V';
    } else if (order >= -3) {
      return this.roundValue(value, 3) + ' mV';
    } else if (order >= -6) {
      return this.roundValue(value, 3) + ' μV';
    } else if (order >= -9) {
      return this.roundValue(value, 9) + ' nV';
    }
    return value.toFixed(2);
  }

  private roundValue(value: number, exponent: number): string {
    return (value * Math.pow(10, exponent)).toFixed(3);
  }
}
