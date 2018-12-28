import uuid from 'uuid/v4';
export default abstract class Part {
  private uids: string[];

  constructor(public poles = 1) {
    if (poles < 1) {
      throw new RangeError('All parts must have at least one pole');
    }
    this.uids = [];
    for (let i = 0; i < poles; i++) {
      this.uids.push(uuid());
    }
  }

  hasPole(pole: string) {
    return this.uids.includes(pole);
  }

  get id() {
    return this.uids[0];
  }
}
