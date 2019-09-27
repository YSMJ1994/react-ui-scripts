#!/usr/bin/env node

const command = process.argv[2];
console.log("command", command);

if (!command) {
  console.error("require command start,build,test!");
  process.exit(-1);
}

switch (command) {
  case "start": {
    require("../scripts/start")();
    break;
  }
  case "build": {
    require("../scripts/build")();
    break;
  }
  case "test": {
    // todo
    break;
  }
  default: {
    console.error("unknown command " + command);
    process.exit(-1);
  }
}
