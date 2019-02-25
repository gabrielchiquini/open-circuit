import Part from './Part';
import IDimension from '../../../util/IDimension';
import Konva from 'konva';
import _image from '../../../assets/images/VoltageSource.svg';
import IPartProperties from '../IPartProperties';
import { realDimension } from '../Circuit/util';

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
      width: 5,
      height: 2,
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
    const leftPole = poleShapes[0];
    const rightPole = poleShapes[1];
    const leftDimension = realDimension(leftPole);
    const correction = leftDimension.width / 2;
    leftPole.x(-correction);
    rightPole.x(shape.width() - correction);

    group.add(leftPole, rightPole);
  }
}
