import Konva, { Line, Group, Circle } from 'konva';
import {
  AREA_UNIT,
  getVerticalLine,
  getHorizontalLine,
  correctPosition,
  CIRCUIT_COLOR,
  hasIntersection,
  realDimension,
  SELECTION_COLOR,
  STROKE_WIDTH,
} from './Circuit/util';
import IPartProperty from './IPartProperty';

export default class NodeManager {
  get editingPartId() {
    return this._selectedPart;
  }
  canvas: Konva.Stage;
  container: HTMLDivElement;
  circuitLayer: Konva.Layer<Konva.Node>;
  private _selectedPart: string;
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
    const xPosition = correctPosition(posX, groupDimension.width, this.width());
    const yPosition = correctPosition(posY, groupDimension.height, this.heigth());
    node.x(xPosition);
    node.y(yPosition);
  }

  addConnection(target: Konva.Circle, selectedPole: Konva.Circle): void {
    const position1 = selectedPole.getAbsolutePosition();
    const position2 = target.getAbsolutePosition();
    const line = new Konva.Line({
      points: [position1.x, position1.y, position2.x, position2.y],
      stroke: CIRCUIT_COLOR,
      strokeWidth: STROKE_WIDTH,
      tension: 1,
      name: `pole-${target.id()} pole-${selectedPole.id()}`,
    });
    selectedPole.fill(CIRCUIT_COLOR);
    target.fill(CIRCUIT_COLOR);
    this.addNode(line);
  }

  selectPole(target: Konva.Circle): void {
    target.fill(SELECTION_COLOR);
    target.draw();
  }

  updatePartProperties(editingPartId: string, properties: IPartProperty): any {
    const labelNode = this.canvas.find('#' + editingPartId + '-label')[0] as Konva.Text;
    labelNode.text(`${properties.value} ${properties.unit}`);
    this.canvas.draw();
  }

  selectPart(partId: string): void {
    const part = this.canvas.find('#' + partId)[0] as Group;
    const currentPart = this.getSelectedPart();
    this.setImageStroke(currentPart, 'transparent');
    if (this._selectedPart === partId) {
      this._selectedPart = null;
    } else {
      this._selectedPart = partId;
      this.setImageStroke(part, CIRCUIT_COLOR);
    }
    this.canvas.batchDraw();
  }

  rotatePart(poles: string[]): void {
    const selectedPart = this.getSelectedPart();
    const lineMappings: Array<{ pole: Circle; relations: Circle[] }> = [];
    poles.forEach(poleId => {
      const nameForLine = 'pole-' + poleId;
      const lines = this.canvas.find('.' + nameForLine);
      const targets = lines.toArray().map(line => {
        const targetPoleId = line
          .removeName(nameForLine)
          .name()
          .replace('pole-', '');
        return this.canvas.find('#' + targetPoleId)[0] as Circle;
      });
      lines.each(line => line.remove());
      lineMappings.push({
        pole: this.canvas.find('#' + poleId)[0] as Circle,
        relations: targets,
      });
    });
    const anchor = lineMappings
      .map(mapping => mapping.pole)
      .reduce((previous, current) => {
        if (previous == null) {
          return current;
        }
        if (previous.x() === current.x()) {
          return previous.y() < current.y() ? previous : current;
        }
        return previous.x() < current.x() ? previous : current;
      });
    const oldAnchorPosition = anchor.getAbsolutePosition();
    selectedPart.rotate(90);
    const newAnchorPostion = anchor.getAbsolutePosition();
    selectedPart.x(selectedPart.x() - (newAnchorPostion.x - oldAnchorPosition.x));
    selectedPart.y(selectedPart.y() - (newAnchorPostion.y - oldAnchorPosition.y));
    lineMappings.forEach(mapping => {
      mapping.relations.forEach((target: Circle) => {
        this.addConnection(mapping.pole, target);
      });
    });
    selectedPart.offsetY(0);
    this.canvas.batchDraw();
  }

  private getSelectedPart() {
    return this.canvas.find('#' + this._selectedPart)[0] as Group;
  }
  private setImageStroke(part: Konva.Group<Konva.Node>, color: string) {
    if (part && part.hasChildren()) {
      part.getChildren().each((child: Konva.Node) => {
        if (child instanceof Konva.Image) {
          child.stroke(color);
        }
      });
    }
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
    // TODO: correct insert
    // const interceptor = Array.from(this.circuitLayer.getChildren())
    //   .filter(existingPart => !(existingPart instanceof Line))
    //   .find(existingPart => {
    //     return hasIntersection(existingPart, node);
    //   });
    // return typeof interceptor === 'undefined';
    return true;
  }
}
