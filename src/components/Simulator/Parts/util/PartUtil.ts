import { Circle, Node, Rect, Group } from "konva";
import PartName from "./PartName";
import { CIRCUIT_COLOR, ASSET_DIR } from "../../Circuit/util";
import { getImage } from "../../../../util/imageUtil";

const POLE_RADIUS = 5.7;

export function getPoleShapes(ids: string[]) {
  return ids.map(uid => {
    return new Circle({
      radius: POLE_RADIUS,
      fill: CIRCUIT_COLOR,
      id: uid,
      name: PartName.Pole,
    });
  });
}

export function partRect(width: number, group: Group, id: string) {
  const height = 25;
  const shape = new Rect({
    id,
    width,
    height,
    name: PartName.Part,
    x: group.x(),
    y: group.y(),
    stroke: 'transparent',
  });
  return shape;
}

export function getAsset(className: string): Promise<HTMLImageElement> {
  return getImage(ASSET_DIR + className + '.svg');
}

export function getNodeCenterX(node: Node): number {
  return node.x() + node.width() / 2;
}

export function getNodeCenterY(node: Node): number {
  return node.y() + node.height() / 2;
}

export function centerPositionY(baseNode: Node, targetHeight: number): number {
  const centerPoint = getNodeCenterY(baseNode);
  return centerPoint - targetHeight / 2;
}
