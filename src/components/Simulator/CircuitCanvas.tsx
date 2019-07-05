import React, {Component} from 'react';
import Konva, {KonvaEventObject} from 'konva';
import {SomePart} from './Parts';
import Circuit from './Circuit/Circuit';
import PartName from './Parts/util/PartName';
import NodeManager from './NodeManager';
import PropertiesEditor from './PropertiesEditor';
import IPartProperties from './IPartProperties';

import './CircuitCanvas.scss';

interface IProps {
  circuit: Circuit;
  selectedElement: () => SomePart;
}

interface IState {
  propertiesEditorFields: IPartProperties;
  editingProperties: boolean;
  width: number;
  height: number;
  isPartSelected: boolean;
}

export default class CircuitCanvas extends Component<IProps, IState> {
  private circuit: Circuit;
  private container: HTMLDivElement;
  private stage: Konva.Stage;
  private nodeManager: NodeManager;
  private selectedPole: Konva.Circle;

  constructor(props: Readonly<IProps>) {
    super(props);
    this.circuit = props.circuit;
    this.state = {
      propertiesEditorFields: {},
      editingProperties: false,
      width: window.innerWidth,
      height: window.innerHeight,
      isPartSelected: false,
    };

    window.addEventListener('resize', () => {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  }

  render() {
    return (
      <div>
        <div className="partOptionsContainer m-2" hidden={!this.state.isPartSelected}>
          <div>
            <i className="fa fa-fw fa-edit" onClick={this.openEditPart}/>
          </div>
          <div>
            <i className="fa fa-fw fa-redo" onClick={this.rotatePart}/>
          </div>
          {/* <div>
            <i className="fa fa-fw fa-trash-alt" onClick={this.deletePart}/>
          </div> */}
        </div>
        <div
          className="circuit-area"
          id="circuit-area"
          ref={div => (this.container = div)}
          style={{
            width: this.state.width,
            height: this.state.height,
            overflow: 'scroll',
          }}
        />
        <PropertiesEditor
          fields={this.state.propertiesEditorFields}
          returnProperties={this.returnProperties}
          visible={this.state.editingProperties}
          editingHide={this.editingHide}
        />
      </div>
    );
  }

  componentDidMount() {
    this.stage = new Konva.Stage({
      container: 'circuit-area',
      width: 1000,
      height: 1000,
    });
    this.nodeManager = new NodeManager(this.stage);
    this.nodeManager.setupKonva().then(__ => this.stage.on('click tap', ev => this.stageClicked(ev)));
  }

  addEvents(node: Konva.Group): any {
    node.getChildren().each(childNode => {
      if (childNode.name() === PartName.Pole) {
        childNode.on('click touchend', ev => {
          this.handlePoleClick(ev);
        });
      } else if (childNode.name() === PartName.Part) {
        childNode.on('click touchend', ev => {
          this.handlePartClick(ev);
        });
      }
    });
  }

  editingHide = () => {
    this.setState({propertiesEditorFields: {}, editingProperties: false});
  };

  returnProperties = (properties: IPartProperties) => {
    this.setState({propertiesEditorFields: {}, editingProperties: false});
    if (properties !== null) {
      this.circuit.setPartProperties(this.nodeManager.selectedPart, properties);
      const mainProperty = this.circuit.getPartMainProperty(this.nodeManager.selectedPart);
      this.nodeManager.updatePartProperties(this.nodeManager.selectedPart, properties[mainProperty]);
    }
  };

  private handlePartClick(ev: Konva.KonvaEventObject<Event>): any {
    const {posX, posY} = this.guessClickPosition(ev);
    if (this.nodeManager.checkNoPoleNear(posX, posY)) {
      const isPartSelected = this.nodeManager.selectPart(ev.target.getParent().id());
      this.setState({isPartSelected});
    }
  }

  private openEditPart = () => {
    const properties = this.circuit.getPartProperties(this.nodeManager.selectedPart);
    if (properties) {
      this.setState({propertiesEditorFields: properties, editingProperties: true});
    }
  };

  private rotatePart = () => {
    const poles = this.circuit.getPartPoleIds(this.nodeManager.selectedPart);
    this.nodeManager.rotatePart(poles);
  };

  private handlePoleClick(ev: Konva.KonvaEventObject<Event>) {
    const target = ev.target as Konva.Circle;
    ev.cancelBubble = true;
    if (this.selectedPole) {
      this.circuit.addConnection(this.selectedPole.id(), target.id());
      this.nodeManager.addConnection(target, this.selectedPole);
      this.selectedPole = null;
    } else {
      this.selectedPole = target;
      this.nodeManager.selectPole(target);
    }
  }

  private guessClickPosition(ev: Konva.KonvaEventObject<Event>) {
    let posX = 0;
    let posY = 0;
    if (this.isMouseEvent(ev.evt)) {
      posY = ev.evt.pageY;
      posX = ev.evt.pageX;
    } else {
      const touch = (ev.evt as TouchEvent).changedTouches[0];
      posY = touch.pageY;
      posX = touch.pageX;
    }
    posY += this.container.scrollTop - this.container.offsetTop;
    posX += this.container.scrollLeft - this.container.offsetLeft;
    return {posX, posY};
  }

  private isMouseEvent(event: Event): event is MouseEvent {
    const anyEvent = event as any;
    return typeof anyEvent.layerX === 'number' && typeof anyEvent.layerY === 'number';
  }

  private stageClicked(ev: KonvaEventObject<Event>): void {
    if (ev.target !== ev.currentTarget) {
      return;
    }
    const {posX, posY} = this.guessClickPosition(ev);
    if (this.nodeManager.checkNoPoleNear(posX, posY)) {
      this.addSelectedElement(posX, posY);
    }
  }

  private async addSelectedElement(posX: number, posY: number) {
    const selectedConstructor = this.props.selectedElement();
    const part = new selectedConstructor();
    const node = await part.getNode();
    this.addEvents(node);
    this.circuit.addPart(part);
    this.nodeManager.addPart(node, posX, posY);
  }

  private deletePart = () => {
    const poles = this.circuit.getPartPoleIds(this.nodeManager.selectedPart);
    this.nodeManager.deletePart(poles);
    this.circuit.deletePart(this.nodeManager.selectedPart);
    this.setState({isPartSelected: false});
  }
}
