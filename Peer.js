var EventEmitter = require('events').EventEmitter;

class Peer extends EventEmitter {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

module.exports = Peer;