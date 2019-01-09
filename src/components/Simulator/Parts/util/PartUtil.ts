import { Circle, Node, Rect, Group } from "konva";
import PartName from "./PartName";
import { CIRCUIT_COLOR, ASSET_DIR } from "../../Circuit/util";
import { getImage } from "../../../../util/imageUtil";
import IDimension from "../../../../util/IDimension";
import { AREA_UNIT as UNIT } from '../../Circuit/util';

export const AREA_UNIT = UNIT;
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

export function partRect(dimension: IDimension, group: Group, id: string) {
  const realDimension = convertDimension(dimension);
  const shape = new Rect({
    id,
    width: realDimension.width,
    height: realDimension.height,
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

export function centerPositionX(baseNode: Node, targetWidth: number): number {
  const centerPoint = getNodeCenterY(baseNode);
  return centerPoint - targetWidth / 2;
}

export function convertDimension(base: IDimension): IDimension {
  return {
    width: base.width * AREA_UNIT,
    height: base.height * AREA_UNIT,
  };
}
