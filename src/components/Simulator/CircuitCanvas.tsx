import React, { Component } from 'react';
import Konva, { KonvaEventObject } from 'konva';
import { getImage } from '../../util/imageUtil';
import { SomePart } from './SimulatorContainer';
import Circuit from './Circuit/Circuit';
import {
  CIRCUIT_MESH,
  calcGroupDimension,
  correctPosition,
  calculateCenter,
  CIRCUIT_COLOR,
} from './Circuit/util';
import PartName from './Parts/util/PartName';

interface IProps {
  circuit: Circuit;
  selectedElement: SomePart;
}

export default class CircuitCanvas extends Component<IProps> {
  circuitLayer: Konva.Layer = null;
  circuit: Circuit;
  container: HTMLDivElement;
  private canvas: Konva.Stage = null;
  private selectedPole: Konva.Circle;

  constructor(props: Readonly<IProps>) {
    super(props);
    this.circuit = props.circuit;
  }

  render() {
    return (
      <div
        className="circuit-area"
        id="circuit-area"
        ref={div => (this.container = div)}
        style={{
          width: '400px',
          height: '400px',
          overflow: 'scroll',
        }}
      />
    );
  }
  componentDidMount() {
    this.setupKonva();
  }

  async setupKonva(): Promise<void> {
    this.canvas = new Konva.Stage({
      container: 'circuit-area',
      width: 1000,
      height: 1000,
    });
    const baseLayer = new Konva.Layer();
    this.setupCircuitLayer();
    this.canvas.add(baseLayer, this.circuitLayer);

    await this.setupBackground(baseLayer);
    this.canvas.draw();
  }

  setupCircuitLayer(): any {
    this.circuitLayer = new Konva.Layer();
  }

  async addSelectedElement(ev: KonvaEventObject<Event>): Promise<void> {
    const { posX, posY } = this.guessClickPosition(ev);
    const part = new this.props.selectedElement();
    const node = await part.konvaNode;
    this.setupPartPosition(node, posX, posY);
    this.addEvents(node);
    this.circuit.addPart(part);
    this.addNode(node);
  }
  addEvents(node: Konva.Group): any {
    node.getChildren().each(childNode => {
      if (childNode.name() === PartName.Pole) {
        childNode.on('click touchend', ev => {
          this.handlePoleClick(ev);
        });
      }
    });
  }

  private handlePoleClick(ev: Konva.KonvaEventObject<Event>) {
    const target = ev.target as Konva.Circle;
    if (this.selectedPole) {
      this.circuit.addConnection(this.selectedPole.id(), target.id());
      const position1 = this.selectedPole.getAbsolutePosition();
      const position2 = target.getAbsolutePosition();
      const line = new Konva.Line({
        points: [position1.x, position1.y, position2.x, position2.y],
        stroke: CIRCUIT_COLOR,
        strokeWidth: 1,
        tension: 1,
      });
      this.selectedPole.fill(CIRCUIT_COLOR);
      target.fill(CIRCUIT_COLOR);
      this.addNode(line);
      this.selectedPole = null;
    } else {
      this.selectedPole = target;
      target.fill('red');
      target.draw();
    }
  }

  private setupPartPosition(node: Konva.Group, posX: number, posY: number) {
    const groupDimension = calcGroupDimension(node);
    const xPosition = correctPosition(
      calculateCenter(groupDimension.width, posX),
      this.width,
    );
    const yPosition = correctPosition(
      calculateCenter(groupDimension.height, posY),
      this.heigth,
    );
    node.x(xPosition);
    node.y(yPosition);
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
    posY += this.container.scrollTop - this.canvas.container().offsetTop;
    posX -= this.canvas.container().offsetLeft;
    return { posX, posY };
  }

  private isMouseEvent(event: Event): event is MouseEvent {
    const anyEvent = event as any;
    return (
      typeof anyEvent.layerX === 'number' && typeof anyEvent.layerY === 'number'
    );
  }

  private addNode(node: Konva.Node) {
    this.circuitLayer.add(node);
    this.canvas.batchDraw();
  }

  private async setupBackground(baseLayer: Konva.Layer) {
    const meshImage = await getImage(CIRCUIT_MESH);
    const background = new Konva.Rect({
      width: baseLayer.width(),
      height: baseLayer.height(),
      fillPatternImage: meshImage,
      fillPatternRepeat: 'repeat',
      preventDefault: false,
    });
    baseLayer.add(background);
    baseLayer.on('click touchend', ev => this.addSelectedElement(ev));
  }

  private get width(): number {
    return this.canvas.width();
  }

  private get heigth(): number {
    return this.canvas.height();
  }
}
