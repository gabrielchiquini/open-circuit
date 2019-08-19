import Part from './Part';
import IDimension from '../../../util/IDimension';
import Konva from 'konva';
import _image from '../../../assets/images/VoltageSource.svg';
import IPartProperties from '../IPartProperties';
import {realDimension} from '../Circuit/util';

const DEFAULT_VOLTAGE = 5;

export default class VoltageSource extends Part {

  static get imageSrc() {
    return _image;
  }

  get image(): string {
    return _image;
  }

  protected get dimension(): IDimension {
    return {
      width: 3,
      height: 2,
    };
  }

  protected get imageSrc() {
    return VoltageSource.imageSrc;
  }
  readonly mainProperty = 'voltage';
  voltage = DEFAULT_VOLTAGE;
  readonly type = 'VoltageSource';

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

  protected definePoles(shape: Konva.Rect, group: Konva.Group, poleShapes: Konva.Circle[]): void {
    const leftPole = poleShapes[0];
    const rightPole = poleShapes[1];
    const groupDimension = realDimension(shape);
    const y = groupDimension.height / 2;
    rightPole.x(shape.width());
    leftPole.y(y);
    rightPole.y(y);

    group.add(leftPole, rightPole);
  }
}
