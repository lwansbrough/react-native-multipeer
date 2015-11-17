import { EventEmitter } from 'events';

export default class Peer extends EventEmitter {
  constructor(id, name) {
    super();
    this.id = id;
    this.name = name;
  }
}
