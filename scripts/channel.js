const EventEmitter = require("events");

class MyEmitter extends EventEmitter {
  constructor() {
      super()
      this.docs = [];
      this.components = [];
  }
}

const myEmitter = new MyEmitter();

myEmitter.on("error", err => {
  console.error("错误信息", err);
});

module.exports = {
  on(fn) {
    myEmitter.on("event", () => {
      fn(myEmitter.docs, myEmitter.components);
    });
  },
  emit(docs, components) {
    if (docs) {
      myEmitter.docs = docs;
    }
    if (components) {
      myEmitter.components = components;
    }
    myEmitter.emit("event");
  }
};
