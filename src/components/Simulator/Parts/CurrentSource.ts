import Part from './Part';
import IDimension from '../../../util/IDimension';
import Konva from 'konva';
import _image from '../../../assets/images/CurrentSource.svg';
import IPartProperties from '../IPartProperties';
import {realDimension} from '../Circuit/util';

const DEFAULT_CURRENT = 1;

export default class CurrentSource extends Part {

  readonly mainProperty = 'current';
  current = DEFAULT_CURRENT;
  readonly type = 'CurrentSource';

  constructor() {
    super(2);
  }

  static get imageSrc() {
    return _image;
  }

  get image(): string {
    return _image;
  }

  protected get dimension(): IDimension {
    return {
      width: 4,
      height: 2,
    };
  }

  protected get imageSrc() {
    return CurrentSource.imageSrc;
  }

  protected defineProperties(): IPartProperties {
    return {
      current: {
        label: 'Current',
        value: DEFAULT_CURRENT,
        unit: 'A',
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
