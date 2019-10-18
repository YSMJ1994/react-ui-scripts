#!/usr/bin/env node

const command = process.argv[2];

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
  case "build-doc": {
    require("../scripts/build")('doc');
    break;
  }
  case "build-library": {
    require("../scripts/build")('library');
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
