import { Group } from "konva";

export const ASSET_DIR = "assets/circuit/";
export const CIRCUIT_MESH = ASSET_DIR + "mesh.svg";
export const CIRCUIT_COLOR = "black";
export const AREA_UNIT = 20;

export interface IDimensions {
  width: number;
  height: number;
}

export function calcGroupDimension(group: Group): IDimensions {
  return group
    .getChildren()
    .toArray()
    .map(node => {
      return {
        width: node.width(),
        height: node.height(),
      } as IDimensions;
    })
    .reduce((old, current) => {
      return {
        width: Math.max(old.width, current.width),
        height: Math.max(old.height, current.height),
      };
    });
}

export function correctPosition(param: number, bound: number): number {
  const position = Math.max(param, Math.min(param, bound));
  let gridDistance = position % AREA_UNIT;
  if (gridDistance > AREA_UNIT / 2) {
    gridDistance = gridDistance - AREA_UNIT; // move to next border
  }
  return position - gridDistance;
}

export function calculateCenter(dimension: number, position: number): number {
  return position - dimension / 2;
}
