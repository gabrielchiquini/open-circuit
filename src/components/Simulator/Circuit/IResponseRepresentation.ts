export default interface IResponseRepresentation {
  timestamp: Date;
  nodes: INodeVoltage[];
}

export interface INodeVoltage {
  pole: string;
  voltage: string;
}
