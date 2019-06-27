import uuid from 'uuid/v4';
import Konva from 'konva';
import {centerPositionX, centerPositionY, convertDimension, getPoleShapes, partRect} from './util/PartUtil';
import IDimension from '../../../util/IDimension';
import {getImage, scaleHigherDimension} from '../../../util/imageUtil';
import IPartProperties from '../IPartProperties';
import PartName from './util/PartName';

export default abstract class Part {
  properties: IPartProperties;
  _node: Promise<Konva.Group>;
  protected uids: string[];

  private _id: string;

  protected constructor(public poles: number) {
    if (poles < 1) {
      throw new RangeError('All parts must have at least one pole');
    }
    this.setUids(poles);
    this.properties = this.defineProperties();
    this._node = this.createNode();
  }

  static get imageSrc(): string {
    throw new Error('Method not implemented');
  }

  get id() {
    return this._id;
  }

  abstract get mainProperty(): string;

  protected abstract get imageSrc(): string;

  protected abstract get dimension(): IDimension;

  hasPole(pole: string) {
    return this.uids.includes(pole);
  }

  getNode(): Promise<Konva.Group> {
    return this._node;
  }

  getPoleIds(): string[] {
    return this.uids.filter(id => this._id !== id);
  }

  protected abstract definePoles(shape: Konva.Rect, group: Konva.Group, poleShapes: Konva.Circle[]): void;

  protected abstract defineProperties(): IPartProperties;

  protected async getImage() {
    const image = await getImage(this.imageSrc);
    const realDimension = convertDimension(this.dimension);
    scaleHigherDimension(image, realDimension);
    return image;
  }

  private setUids(poles: number) {
    this.uids = [];
    this._id = uuid();
    for (let i = 0; i < poles; i++) {
      this.uids.push(uuid());
    }
  }

  private async createNode(): Promise<Konva.Group> {
    const group = new Konva.Group({
      id: this.id,
    });
    const image = await this.getImage();
    const shape = partRect(this.dimension, group);
    const imageNode = new Konva.Image({
      image,
      name: PartName.Part,
      x: centerPositionX(shape, image.width),
      y: centerPositionY(shape, image.height),
    });
    const mainProperty = this.properties[this.mainProperty];
    const propertyLabel = new Konva.Text({
      text: `${mainProperty.value} ${mainProperty.unit}`,
      id: this.id + '-label',
    });
    group.add(shape, imageNode, propertyLabel);
    const poleShapes = getPoleShapes(this.uids);
    this.definePoles(shape, group, poleShapes);
    return group;
  }
}
