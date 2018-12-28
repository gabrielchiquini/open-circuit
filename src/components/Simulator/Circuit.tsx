import React, { Component } from "react";
import Konva, { KonvaEventObject } from 'konva';
import { CIRCUIT_MESH, getImage } from "../../util/imageUtil";


export default class Circuit extends Component {
  canvas: Konva.Stage = null;
  circuitLayer: Konva.Layer = null;
  constructor(props: {}) {
    super(props);
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
    const node = new Konva.Star({
      fill: 'red',
      numPoints: 6,
      innerRadius: 30,
      outerRadius: 5,
      x: ev.evt.layerX,
      y: ev.evt.layerY,
    });
    this.circuitLayer.add(node);
    this.canvas.draw();
  }

  render() {
    return (
      <div className="circuit-area" id="circuit-area"></div>
    );
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
    baseLayer.on('click', (ev) => this.addSelectedElement(ev));
  }
}
