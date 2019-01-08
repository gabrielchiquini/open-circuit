import Konva from "konva";
import Part from "./Part";
import { getPoleShapes, getAsset, getNodeCenterY } from "./util/PartUtil";
import { scaleHeight } from "../../../util/imageUtil";
import IDimension from "./util/IDimension";

const defaultResistance = 1e3;

export default class Resistor extends Part {
  get dimension(): IDimension {
    return {
      width: 4,
      height: 2,
    };
  }

  resistance: number;

  constructor() {
    super(2);
    this.resistance = defaultResistance;
  }

  protected async getImage() {
    const image = await getAsset(this.constructor.name);
    scaleHeight(image, 13);
    return image;
  }

  protected definePoles(shape: Konva.Rect, group: Konva.Group) {
    const poleShapes = getPoleShapes(this.uids);
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
