import Konva from 'konva';
import Part from './Part';
import IDimension from '../../../util/IDimension';
import _image from '../../../assets/images/Resistor.svg';
import { realDimension } from '../Circuit/util';
import IPartProperties from '../IPartProperties';

const defaultResistance = 1e3;

export default class Resistor extends Part {
  readonly mainProperty = 'resistance';
  static get imageSrc() {
    return _image;
  }

  protected get dimension(): IDimension {
    return {
      width: 5,
      height: 2,
    };
  }

  protected get imageSrc() {
    return Resistor.imageSrc;
  }

  protected get image() {
    return _image;
  }
  resistance: number;

  constructor() {
    super(2);
    this.resistance = defaultResistance;
  }
  protected defineProperties(): IPartProperties {
    return {
      resistance: {
        label: 'Resistance',
        value: 1000,
        unit: '\u2126',
      },
    };
  }

  protected definePoles(shape: Konva.Rect, group: Konva.Group, poleShapes: Konva.Circle[]) {
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
