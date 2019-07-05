import Part from '../Parts/Part';
import IPartProperties from '../IPartProperties';
import _ from 'lodash';
import { ICircuitRepresentation, IPartRepresentation } from './ICircuitRepresentation';

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
    const properties = this.findPart(id).properties;
    return _.cloneDeep(properties);
  }

  setPartProperties(id: string, properties: IPartProperties): void {
    this.parts.find(part => part.id === id).properties = properties;
  }

  getPartMainProperty(id: string): string {
    return this.findPart(id).mainProperty;
  }

  getPartPoleIds(id: string): string[] {
    return this.findPart(id).getPoleIds();
  }

  getRepresentation(): ICircuitRepresentation {
    return {
      nodes: this.nodes.map(item => Array.from(item)),
      parts: this.parts.map(item => this.getPartRepresentation(item)),
    };
  }
  private getPartRepresentation(item: Part): IPartRepresentation {
    const properties: any = {};
    Object.keys(item.properties).forEach(key => {
      properties[key] = item.properties[key].value;
    });
    return {
      poles: item.uids,
      properties,
      type: item.type,
    };
  }

  private findPart(id: string) {
    return this.parts.find(part => part.id === id);
  }

  deletePart(selectedPartId: string) {
    const partIndex = this.parts.findIndex(part => part.id === selectedPartId);
    this.parts.splice(partIndex, 1);
    const ids = this.getPartPoleIds(selectedPartId);
    ids.forEach(poleId => {
      this.nodes.forEach(node => node.delete(poleId));
    });
    this.nodes = this.nodes.filter(node => node.size > 1);
  }
}
