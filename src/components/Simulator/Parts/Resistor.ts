import Konva from "konva";
import Part from "./Part";
import {
  getPoleShapes,
  getNodeCenterY,
} from "./util/PartUtil";
import IDimension from "../../../util/IDimension";

const defaultResistance = 1e3;

export default class Resistor extends Part {
  resistance: number;

  constructor() {
    super(2);
    this.resistance = defaultResistance;
  }

  protected get dimension(): IDimension {
    return {
      width: 4,
      height: 2,
    };
  }
  protected definePoles(shape: Konva.Rect, group: Konva.Group, poleShapes: Konva.Circle[]) {
    const leftPole = poleShapes[0];
    const rightPole = poleShapes[1];
    leftPole.x(group.x());
    rightPole.x(group.x() + shape.width());
    const yLocation = getNodeCenterY(shape);
    leftPole.y(yLocation);
    rightPole.y(yLocation);
    group.add(leftPole, rightPole);
  }
}
