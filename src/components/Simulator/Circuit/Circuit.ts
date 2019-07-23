import Part from '../Parts/Part';
import IPartProperties from '../IPartProperties';
import {cloneDeep} from 'lodash';
import {ICircuitRepresentation, IPartRepresentation} from './ICircuitRepresentation';

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

  getPartProperties(id: string): IPartProperties {
    const properties = this.findPart(id).properties;
    return cloneDeep(properties);
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

  deletePart(selectedPartId: string) {
    const partIndex = this.findPartIndex(selectedPartId);
    const part = this.parts[partIndex];
    const ids = part.getPoleIds();
    this.parts.splice(partIndex, 1);
    this.nodes.forEach(node => {
      ids.forEach(id => node.delete(id));
    });
    this.nodes = this.nodes.filter(node => node.size > 1);
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

  private findPart(id: string): Part {
    return this.parts.find(part => part.id === id);
  }

  private findPartIndex(id: string): number {
    return this.parts.findIndex(part => part.id === id);
  }
}
