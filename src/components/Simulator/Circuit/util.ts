import { Group } from "konva";

export const ASSET_DIR = 'assets/circuit/';
export const CIRCUIT_MESH = ASSET_DIR + 'mesh.svg';
export const CIRCUIT_COLOR = 'black';

export interface IDimensions {
  width: number;
  height: number;
}

export function calcGroupDimension(group: Group): IDimensions {
  return group.getChildren().toArray().map(node => {
    return {
      width: node.width(),
      height: node.height(),
    } as IDimensions;
  }).reduce((old, current) => {
    return {
      width: Math.max(old.width, current.width),
      height: Math.max(old.height, current.height),
    };
  });
}

export function ensureInside(param: number, bound: number): number {
  return Math.max(param, Math.min(param, bound));
}

export function calculateCenter(dimension: number, position: number): number {
  return position - dimension / 2;
}
