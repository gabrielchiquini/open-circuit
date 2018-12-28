import React, { Component } from "react";
import { connect, Provider } from 'react-redux';
import Circuit from "./Circuit";
import PartSelector from "./PartSelector";

class Simulator extends Component {

  render() {
    return (
      <div>
        <PartSelector />
        <Circuit />
      </div>

    );
  }
}

const SimulatorContainer = connect()(Simulator);
export default SimulatorContainer;
