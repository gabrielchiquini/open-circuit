import Part from './Part';
import IDimension from '../../../util/IDimension';
import Konva from 'konva';
import { getNodeCenterX } from './util/PartUtil';

const DEFAULT_VOLTAGE = 5;

export default class VoltageSource extends Part {
  voltage = DEFAULT_VOLTAGE;
  constructor() {
    super(2);
  }

  get dimension(): IDimension {
    return {
      width: 2,
      height: 5,
    };
  }

  protected definePoles(
    shape: Konva.Rect,
    group: Konva.Group,
    poleShapes: Konva.Group[],
  ): void {
    const upperPole = poleShapes[0];
    const lowerPole = poleShapes[1];
    const center = getNodeCenterX(shape);
    upperPole.y(group.y() - center);
    lowerPole.y(group.y() + shape.height() - center);
    group.add(lowerPole, upperPole);
  }
}
