import Konva from 'konva';
import Part from './Part';
import IDimension from '../../../util/IDimension';
import _image from '../../../assets/images/Resistor.svg';
import { realDimension } from '../Circuit/util';

const defaultResistance = 1e3;

export default class Resistor extends Part {
  static get imageSrc() {
    return _image;
  }
  resistance: number;

  constructor() {
    super(2);
    this.resistance = defaultResistance;
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

  protected definePoles(
    shape: Konva.Rect,
    group: Konva.Group,
    poleShapes: Konva.Group[],
  ) {
    const leftPole = poleShapes[0];
    const rightPole = poleShapes[1];
    const leftDimension = realDimension(leftPole);
    const correction = leftDimension.width / 2;
    leftPole.x(-correction);
    rightPole.x(shape.width() - correction);

    group.add(leftPole, rightPole);
  }
}
