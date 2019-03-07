import React, { Component } from 'react';
import { SomePart } from './Parts';
import { PARTS } from './Parts';
import { ASSET_DIR } from './Circuit/util';
import './PartSelector.scss';

interface IPropsType {
  changeSelectedPart: (part: SomePart) => void;
  selectedElement: () => SomePart;
}

interface IStateType {
  visible: boolean;
}

export default class PartSelector extends Component<IPropsType, IStateType> {
  constructor(props: IPropsType) {
    super(props);
    props.changeSelectedPart(PARTS[0]);
    this.state = { visible: true };
  }

  render() {
    const selectedPart = this.props.selectedElement() || PARTS[0];
    return (
      <div>
        <div className="selector-toggle" onClick={this.toggle}>
          <i className={'fa fa-fw fa-angle-' + (this.state.visible ? 'up' : 'down')} />
        </div>
        <div className="circuit-parts m-2" hidden={!this.state.visible}>
          {PARTS.map(part => {
            const clazz = ['part-card', 'mr-3'];
            if (selectedPart.imageSrc === part.imageSrc) {
              clazz.push('selected');
            }
            return (
              <div className={clazz.join(' ')} key={part.name} onClick={_ => this.props.changeSelectedPart(part)}>
                <img src={part.imageSrc} className="part-image" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  toggle = () => {
    this.setState({ visible: !this.state.visible });
  }
}
