import React, { Component } from "react";
import Konva, { KonvaEventObject } from 'konva';
import { CIRCUIT_MESH, getImage } from "../../util/imageUtil";
import { SomePart } from "./SimulatorContainer";
import Circuit from "./Circuit/Circuit";

interface IProps { circuit: Circuit; selectedElement: SomePart; }

export default class CircuitCanvas extends Component<IProps> {
  canvas: Konva.Stage = null;
  circuitLayer: Konva.Layer = null;
  circuit: Circuit;

  constructor(props: Readonly<IProps>) {
    super(props);
    this.circuit = props.circuit;
  }

  render() {
    return (
      <div className="circuit-area" id="circuit-area"></div>
    );
  }
  componentDidMount() {
    this.setupKonva();
  }


  async setupKonva(): Promise<void> {
    this.canvas = new Konva.Stage({
      container: 'circuit-area',
      width: 1200,
      height: 1200,
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

  addSelectedElement(ev: KonvaEventObject<MouseEvent>): void {
    const part = new this.props.selectedElement();
    this.circuit.addPart(part);
    const node = new Konva.Shape({
      id: part.id,
      x: ev.evt.layerX,
      y: ev.evt.layerY,
    });
    this.addNode(node);
  }

  private addNode(node: Konva.Node) {
    this.circuitLayer.add(node);
    this.canvas.draw();
  }

  private async setupBackground(baseLayer: Konva.Layer) {
    const meshImage = await getImage(CIRCUIT_MESH);
    const background = new Konva.Rect({
      width: baseLayer.width(),
      height: baseLayer.height(),
      fillPatternImage: meshImage,
      fillPatternRepeat: 'repeat',
    });
    baseLayer.add(background);
    baseLayer.on('click', ev => this.addSelectedElement(ev));
  }
}
