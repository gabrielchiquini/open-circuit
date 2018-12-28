import React, { Component } from "react";
import { SomePart } from "./SimulatorContainer";

interface IPropsType {
  selectedElement: SomePart;
}

export default class PartSelector extends Component<IPropsType> {
  render() {
    return (
      <div className="circuit-parts">
      </div>
    );
  }
}
