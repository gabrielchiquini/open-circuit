import Part from "./Part";
import IDimension from "../../../util/IDimension";
import Konva from "konva";
import { getNodeCenterX } from "./util/PartUtil";

export default class VoltageSource extends Part {
  constructor() {
    super(2);
  }

  get dimension(): IDimension {
    return {
      width: 2,
      height: 4,
    };
  }

  protected definePoles(shape: Konva.Rect, group: Konva.Group, poleShapes: Konva.Circle[]): void {
    const upperPole = poleShapes[0];
    const lowerPole = poleShapes[1];
    const center = getNodeCenterX(shape);
    upperPole.x(center);
    lowerPole.x(center);
    upperPole.y(group.y());
    lowerPole.y(group.y() + shape.height());
    group.add(lowerPole, upperPole);
  }
}
