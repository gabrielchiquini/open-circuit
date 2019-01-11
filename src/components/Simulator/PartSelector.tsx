import React, { Component } from 'react';
import { SomePart } from './Parts';
import { PARTS } from './Parts';
import { ASSET_DIR } from './Circuit/util';
import './PartSelector.css';

interface IPropsType {
  changeSelectedPart: (part: SomePart) => void;
}

export default class PartSelector extends Component<IPropsType> {
  constructor(props: IPropsType) {
    super(props);
    props.changeSelectedPart(PARTS[0]);
  }

  render() {
    return (
      <div className="circuit-parts">
        {PARTS.map(part => {
          return (
            <div className="part-card" key={part.name} onClick={_ => this.props.changeSelectedPart(part)}>
              <img
                src={`${ASSET_DIR + part.name}.svg`}
                className="part-image"
              />
            </div>
          );
        })}
      </div>
    );
  }
}
