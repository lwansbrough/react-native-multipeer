import { EventEmitter } from 'events';

export default class Peer extends EventEmitter {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}