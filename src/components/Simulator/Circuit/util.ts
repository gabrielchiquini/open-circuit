import { Group, Line, Stage, Node, Vector2d, Util } from 'konva';
import IDimension from '../../../util/IDimension';

export const ASSET_DIR = 'assets/circuit/';
export const CIRCUIT_MESH = ASSET_DIR + 'mesh.svg';
export const CIRCUIT_COLOR = 'black';
export const BACKGROUND_COLOR = 'lightgrey';
export const SELECTION_COLOR = '#eee';
export const AREA_UNIT = 20;
export const STROKE_WIDTH = 1;
const MARGIN = AREA_UNIT;

interface IBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function correctPosition(
  position: number,
  dimension: number,
  upperBound: number,
): number {
  const center = position - dimension / 2;
  position = Math.max(MARGIN, Math.min(center, upperBound - dimension));
  let gridDistance = position % AREA_UNIT;
  if (gridDistance > AREA_UNIT / 2) {
    gridDistance = gridDistance - AREA_UNIT; // move to next border
  }
  return position - gridDistance;
}

export function calculateCenter(dimension: number, position: number): number {
  return position - dimension / 2;
}

export function getHorizontalLine(offset: number, stage: Stage) {
  return getBackgroundLine([stage.height(), offset, 0, offset]);
}

export function getVerticalLine(offset: number, stage: Stage) {
  return getBackgroundLine([offset, stage.height(), offset, 0]);
}

function getBackgroundLine(points: number[]) {
  return new Line({
    points,
    stroke: BACKGROUND_COLOR,
    strokeWidth: 1,
    tension: 1,
  });
}

export function realDimension(node: Node): IDimension {
  if (node instanceof Group) {
    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;
    node.getChildren().each((child: Node) => {
      const childDimension = realDimension(child);
      minX = Math.min(child.x(), minX);
      minY = Math.min(child.y(), minY);
      maxX = Math.max(childDimension.width, maxX);
      maxY = Math.max(childDimension.height, maxY);
    });
    return {
      height: maxY - minY,
      width: maxX - minX,
    };
  } else {
    return node.getSize();
  }
}

export function realBounds(node: Node): IBounds {
  const dimension = realDimension(node);
  const minX = node.x();
  const minY = node.y();
  return {
    minX,
    minY,
    maxX: minX + dimension.width,
    maxY: minY + dimension.height,
  };
}

export function hasIntersection(p1: Node, p2: Node) {
  const boundsP1 = realBounds(p1);
  const boundsP2 = realBounds(p2);
  const rect1 = rectFromBounds(boundsP1);
  const rect2 = rectFromBounds(boundsP2);
  return (Util as any).haveIntersection(rect1, rect2);
  // return (
  //   inside(boundsP1, boundsP2.minX, boundsP2.minY) ||
  //   inside(boundsP1, boundsP2.minX, boundsP2.maxY) ||
  //   inside(boundsP1, boundsP2.maxX, boundsP2.minY) ||
  //   inside(boundsP1, boundsP2.maxX, boundsP2.maxY)
  // );
}

function rectFromBounds(bounds: IBounds) {
  return {
    x: bounds.minX,
    y: bounds.minY,
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
  };
}

function inside(bounds: IBounds, x: number, y: number) {
  return (
    between(x, bounds.minX, bounds.maxX) && between(y, bounds.minY, bounds.maxY)
  );
}

function between(target: number, lower: number, upper: number): boolean {
  return target >= lower && target <= upper;
}
