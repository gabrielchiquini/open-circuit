export interface ICircuitRepresentation {
  nodes: string[][];
  parts: IPartRepresentation[];
}

export interface IPartRepresentation {
  type: string;
  properties: { [key: string]: number };
  poles: string[];
}
