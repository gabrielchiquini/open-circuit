import Konva from 'konva';
import {
  AREA_UNIT,
  getVerticalLine,
  getHorizontalLine,
  correctPosition,
  calculateCenter,
  CIRCUIT_COLOR,
  hasIntersection,
  realDimension,
  realBounds,
} from './Circuit/util';

export default class NodeManager {
  canvas: Konva.Stage;
  container: HTMLDivElement;
  circuitLayer: Konva.Layer<Konva.Node>;
  constructor(canvas: Konva.Stage) {
    this.canvas = canvas;
  }

  async setupKonva(): Promise<void> {
    const baseLayer = new Konva.Layer();
    this.setupCircuitLayer();
    this.canvas.add(baseLayer, this.circuitLayer);

    await this.setupBackground(baseLayer);
    this.canvas.draw();
  }

  addNode(node: Konva.Node) {
    this.circuitLayer.add(node);
    this.canvas.batchDraw();
  }

  addPart(node: Konva.Group<Konva.Node>, posX: number, posY: number): any {
    this.definePartPosition(node, posX, posY);
    if (this.canInsert(node)) {
      this.addNode(node);
    }
  }

  definePartPosition(node: Konva.Group, posX: number, posY: number) {
    const groupDimension = realDimension(node);
    const xPosition = correctPosition(
      posX,
      groupDimension.width,
      this.width(),
    );
    const yPosition = correctPosition(
      posY,
      groupDimension.height,
      this.heigth(),
    );
    node.x(xPosition);
    node.y(yPosition);
  }

  addConnection(target: Konva.Circle, selectedPole: Konva.Circle): void {
    const position1 = selectedPole.getAbsolutePosition();
    const position2 = target.getAbsolutePosition();
    const line = new Konva.Line({
      points: [position1.x, position1.y, position2.x, position2.y],
      stroke: CIRCUIT_COLOR,
      strokeWidth: 3,
      tension: 1,
    });
    selectedPole.fill(CIRCUIT_COLOR);
    target.fill(CIRCUIT_COLOR);
    this.addNode(line);
  }

  selectPole(target: Konva.Circle): void {
    target.fill('red');
    target.draw();
  }

  private setupCircuitLayer(): void {
    this.circuitLayer = new Konva.Layer();
  }
  private setupBackground(baseLayer: Konva.Layer) {
    for (let i = 0; i < this.canvas.width(); i += AREA_UNIT) {
      baseLayer.add(getVerticalLine(i, this.canvas));
    }
    for (let i = 0; i < this.canvas.height(); i += AREA_UNIT) {
      baseLayer.add(getHorizontalLine(i, this.canvas));
    }
  }

  private width(): number {
    return this.canvas.width();
  }

  private heigth(): number {
    return this.canvas.height();
  }

  private canInsert(node: Konva.Node): any {
    const interceptor = Array.from(this.circuitLayer.getChildren()).find(existingPart => {
      return hasIntersection(existingPart, node);
    });
    return typeof interceptor === 'undefined';
  }
}
