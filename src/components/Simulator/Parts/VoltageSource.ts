import Part from './Part';
import IDimension from '../../../util/IDimension';
import Konva from 'konva';
import { getNodeCenterX } from './util/PartUtil';
import _image from '../../../assets/images/VoltageSource.svg';
import IPartProperties from '../IPartProperties';

const DEFAULT_VOLTAGE = 5;

export default class VoltageSource extends Part {
  readonly mainProperty = 'voltage';
  static get imageSrc() {
    return _image;
  }

  get image(): string {
    return _image;
  }

  protected get dimension(): IDimension {
    return {
      width: 2,
      height: 5,
    };
  }

  protected get imageSrc() {
    return VoltageSource.imageSrc;
  }

  voltage = DEFAULT_VOLTAGE;
  constructor() {
    super(2);
  }
  protected defineProperties(): IPartProperties {
    return {
      voltage: {
        label: 'Voltage',
        value: DEFAULT_VOLTAGE,
        unit: 'V',
      },
    };
  }

  protected definePoles(shape: Konva.Rect, group: Konva.Group, poleShapes: Konva.Group[]): void {
    const upperPole = poleShapes[0];
    const lowerPole = poleShapes[1];
    const center = getNodeCenterX(shape);
    upperPole.y(group.y() - center);
    lowerPole.y(group.y() + shape.height() - center);
    group.add(lowerPole, upperPole);
  }
}
