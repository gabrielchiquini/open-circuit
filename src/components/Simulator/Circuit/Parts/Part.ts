import uuid from 'uuid/v4';
import Konva from 'konva';
import { partRect, centerPositionY } from './PartUtil';

export default abstract class Part {
  _node: Promise<Konva.Group>;
  protected uids: string[];
  private _id: string;

  constructor(public poles = 1) {
    if (poles < 1) {
      throw new RangeError('All parts must have at least one pole');
    }
    this.uids = [];
    this._id = uuid();
    for (let i = 0; i < poles; i++) {
      this.uids.push(uuid());
    }
    this._node = this.createNode();
  }
  hasPole(pole: string) {
    return this.uids.includes(pole);
  }

  protected abstract getImage(): Promise<HTMLImageElement>;
  protected abstract definePoles(shape: Konva.Rect, group: Konva.Group): void;

  private async createNode(): Promise<Konva.Group> {
    const group = new Konva.Group();
    const image = await this.getImage();
    const shape = partRect(image.width, group, this.id);
    const imageNode = new Konva.Image({
      image,
      x: group.x(),
      y: centerPositionY(shape, image.height),
    });
    group.add(shape, imageNode);
    this.definePoles(shape, group);
    return group;
  }

  get id() {
    return this._id;
  }

  get konvaNode(): Promise<Konva.Group> {
    return this._node;
  }
}
