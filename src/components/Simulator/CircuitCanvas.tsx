import React, { Component } from "react";
import Konva, { KonvaEventObject } from "konva";
import { getImage } from "../../util/imageUtil";
import { SomePart } from "./SimulatorContainer";
import Circuit from "./Circuit/Circuit";
import {
  CIRCUIT_MESH,
  calcGroupDimension,
  ensureInside,
  calculateCenter,
  CIRCUIT_COLOR,
} from "./Circuit/util";
import PartName from "./Parts/util/PartName";

interface IProps {
  circuit: Circuit;
  selectedElement: SomePart;
}

export default class CircuitCanvas extends Component<IProps> {
  circuitLayer: Konva.Layer = null;
  circuit: Circuit;
  private canvas: Konva.Stage = null;
  private selectedPole: Konva.Circle;

  constructor(props: Readonly<IProps>) {
    super(props);
    this.circuit = props.circuit;
  }

  render() {
    return <div className="circuit-area" id="circuit-area" />;
  }
  componentDidMount() {
    this.setupKonva();
  }

  async setupKonva(): Promise<void> {
    this.canvas = new Konva.Stage({
      container: "circuit-area",
      width: 600,
      height: 600,
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
        childNode.on("click touchend", ev => {
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
        points: [
          position1.x,
          position1.y,
          position2.x,
          position2.y,
        ],
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
      target.fill("red");
      target.draw();
    }
  }

  private setupPartPosition(node: Konva.Group, posX: number, posY: number) {
    const groupDimension = calcGroupDimension(node);
    const xPosition = ensureInside(
      calculateCenter(groupDimension.width, posX),
      this.width,
    );
    const yPosition = ensureInside(
      calculateCenter(groupDimension.height, posY),
      this.heigth,
    );
    node.x(xPosition);
    node.y(yPosition);
  }

  private guessClickPosition(ev: Konva.KonvaEventObject<Event>) {
    let posX = 0;
    let posY = 0;
    if (ev.evt instanceof TouchEvent) {
      const touch = ev.evt.changedTouches[0];
      posY = touch.clientY - this.canvas.container().offsetTop;
      posX = touch.clientX - this.canvas.container().offsetLeft;
    } else if (ev.evt instanceof MouseEvent) {
      posY = ev.evt.layerY;
      posX = ev.evt.layerX;
    }
    return { posX, posY };
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
      fillPatternRepeat: "repeat",
    });
    baseLayer.add(background);
    baseLayer.on("click touchend", ev => this.addSelectedElement(ev));
  }

  private get width(): number {
    return this.canvas.width();
  }

  private get heigth(): number {
    return this.canvas.height();
  }
}
