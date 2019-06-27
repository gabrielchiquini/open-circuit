import Konva, {Circle, Group, Rect} from 'konva';
import PartName from './PartName';
import {AREA_UNIT as UNIT, CIRCUIT_COLOR, realDimension} from '../../Circuit/util';
import IDimension from '../../../../util/IDimension';

export const AREA_UNIT = UNIT;
const POLE_RADIUS = 5.7;

export function getPoleShapes(ids: string[]): Konva.Circle[] {
  return ids.map(uid => {
    return new Circle({
      radius: POLE_RADIUS,
      fill: CIRCUIT_COLOR,
      name: PartName.Pole,
      id: uid,
    });
  });
}

export function partRect(dimension: IDimension, group: Group) {
  const absoluteDimension = convertDimension(dimension);
  return new Rect({
    width: absoluteDimension.width,
    height: absoluteDimension.height,
    name: PartName.Part,
    x: group.x(),
    y: group.y(),
    stroke: 'transparent',
  });
}

export function getNodeCenterX(node: Konva.Node): number {
  const dimension = realDimension(node);
  return node.x() + dimension.width / 2;
}

export function getNodeCenterY(node: Konva.Node): number {
  const dimension = realDimension(node);
  return node.y() + dimension.height / 2;
}

export function centerPositionY(baseNode: Konva.Node, targetHeight: number): number {
  const centerPoint = getNodeCenterY(baseNode);
  return centerPoint - targetHeight / 2;
}

export function centerPositionX(baseNode: Konva.Node, targetWidth: number): number {
  const centerPoint = getNodeCenterX(baseNode);
  return centerPoint - targetWidth / 2;
}

export function convertDimension(base: IDimension): IDimension {
  return {
    width: base.width * AREA_UNIT,
    height: base.height * AREA_UNIT,
  };
}
