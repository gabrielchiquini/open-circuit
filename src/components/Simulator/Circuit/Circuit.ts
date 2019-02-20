import Part from '../Parts/Part';
import IPartProperties from '../IProperty';
import _ from 'lodash';

export default class Circuit {
  private parts: Part[];
  private nodes: Array<Set<string>>;

  constructor() {
    this.parts = [];
    this.nodes = [];
  }

  addPart(part: Part) {
    this.parts.push(part);
  }

  addConnection(pole1: string, pole2: string) {
    let node = this.nodes.find(set => set.has(pole1) || set.has(pole2));
    if (!node) {
      node = new Set();
      this.nodes.push(node);
    }
    node.add(pole1).add(pole2);
  }

  removePart(pole: string) {
    const index = this.parts.findIndex(part => part.hasPole(pole));
    this.parts.splice(index, 1);
    this.nodes = this.nodes.filter(node => {
      node.delete(pole);
      return pole.length > 1;
    });
  }

  getPartProperties(id: string): IPartProperties {
    const properties = this.parts.find(part => part.id === id).properties;
    return _.cloneDeep(properties);
  }

  setPartProperties(id: string, properties: IPartProperties): void {
    this.parts.find(part => part.id === id).properties = properties;
  }
}
