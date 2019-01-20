import Konva, { Circle, Group, Rect } from 'konva';
import PartName from './PartName';
import {
  CIRCUIT_COLOR,
  ASSET_DIR,
  calcGroupDimension,
} from '../../Circuit/util';
import { getImage } from '../../../../util/imageUtil';
import IDimension from '../../../../util/IDimension';
import { AREA_UNIT as UNIT } from '../../Circuit/util';

export const AREA_UNIT = UNIT;
const POLE_RADIUS = 5.7;

export function getPoleShapes(ids: string[]): Konva.Group[] {
  return ids.map(uid => {
    const group = new Konva.Group({
      name: PartName.PoleGroup,
    });
    const { width, height } = convertDimension({ width: 2, height: 2 });
    const rect = new Konva.Rect({
      width,
      height,
      stroke: CIRCUIT_COLOR,
    });
    const circle = new Circle({
      radius: POLE_RADIUS,
      fill: CIRCUIT_COLOR,
      name: PartName.Pole,
      x: rect.width() / 2,
      y: rect.height() / 2,
    });
    group.add(rect, circle);
    return group;
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

export function getAsset(name: string): Promise<HTMLImageElement> {
  return getImage(ASSET_DIR + name + '.svg');
}

export function getNodeCenterX(node: Konva.Node): number {
  const dimension = getDimension(node);
  return node.x() + dimension.width / 2;
}

export function getNodeCenterY(node: Konva.Node): number {
  const dimension = getDimension(node);
  return node.y() + dimension.height / 2;
}

export function centerPositionY(
  baseNode: Konva.Node,
  targetHeight: number,
): number {
  const centerPoint = getNodeCenterY(baseNode);
  return centerPoint - targetHeight / 2;
}

export function centerPositionX(
  baseNode: Konva.Node,
  targetWidth: number,
): number {
  const centerPoint = getNodeCenterX(baseNode);
  return centerPoint - targetWidth / 2;
}

function getDimension(node: Konva.Node) {
  let dimension: IDimension;
  if (node instanceof Konva.Group) {
    dimension = calcGroupDimension(node);
  } else {
    dimension = {
      width: node.width(),
      height: node.height(),
    };
  }
  return dimension;
}

export function convertDimension(base: IDimension): IDimension {
  return {
    width: base.width * AREA_UNIT,
    height: base.height * AREA_UNIT,
  };
}
