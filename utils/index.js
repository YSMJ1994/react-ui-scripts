const nodePath = require('path')
const delayTagMap = new Map();

const executeDelay = (function() {
  return function(task, timeout) {
    clearTimeout(delayTagMap[task]);
    delayTagMap[task] = setTimeout(task, timeout);
  };
})();

function path2GulpPath(path) {
    if(!path || typeof path !== 'string') {
        throw new Error(`invalid argument: path[ ${path} ]`);
    }
    return path.split(nodePath.sep).join('/');
}

module.exports = {
  executeDelay,
    path2GulpPath
};
