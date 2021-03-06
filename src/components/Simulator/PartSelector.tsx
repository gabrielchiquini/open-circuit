import React, {Component} from 'react';
import {PARTS, SomePart} from './Parts';
import './PartSelector.scss';

interface IPropsType {
  changeSelectedPart: (part: SomePart) => void;
  selectedElement: () => SomePart;
  simulate: () => any;
  addPart: () => any;
}

interface IStateType {
  visible: boolean;
}

export default class PartSelector extends Component<IPropsType, IStateType> {
  constructor(props: IPropsType) {
    super(props);
    props.changeSelectedPart(PARTS[0]);
    this.state = {visible: true};
  }

  render() {
    const selectedPart = this.props.selectedElement() || PARTS[0];
    return (
      <div>
        <div className="selector-toggle">
          <i className="far fa-play-circle" onClick={this.props.simulate}/>
          <i className={'fa fa-fw fa-angle-' + (this.state.visible ? 'up' : 'down')} onClick={this.toggle}/>
        </div>
        <div className="circuit-parts m-2" hidden={!this.state.visible}>
          {PARTS.map(part => {
            const clazz = ['part-card', 'mr-3'];
            return (
              <div className={clazz.join(' ')} key={part.name} onClick={() => this.props.changeSelectedPart(part)}>
                <img src={part.imageSrc} className="part-image" alt="part image"/>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  toggle = () => {
    this.setState({visible: !this.state.visible});
  };
}
