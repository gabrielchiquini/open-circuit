import Part from "./Part";
import * as Konva from "konva";
import IPartProperties from "../IPartProperties";
import IDimension from "../../../util/IDimension";
import _image from '../../../assets/images/Ground.svg';
import {realDimension} from "../Circuit/util";

export default class Ground extends Part {
  constructor() {
    super(1);
  }

  static get imageSrc() {
    return _image;
  }

  get image(): string {
    return _image;
  }

  get mainProperty(): string {
    return "";
  }

  get type(): string {
    return "Ground";
  }

  protected get imageSrc() {
    return Ground.imageSrc;
  }

  protected get dimension(): IDimension {
    return {
      height: 2,
      width: 2,
    };
  }


  protected definePoles(shape: Konva.Rect, group: Konva.Group<Konva.Node>, poleShapes: Konva.Circle[]): void {
    const pole = poleShapes[0];
    const groupDimension = realDimension(shape);
    pole.y(0);
    console.log(groupDimension.width)
    pole.x(groupDimension.width / 2 - 0.5);

    group.add(pole);
  }

  protected defineProperties(): IPartProperties {
    return {};
  }

}
