'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.on('unhandledRejection', err => {
	throw err;
});
const compileDoc = require('./compileDoc')
const devServer = require('./devServer')

async function start() {
	await compileDoc.start();
	devServer.start()
}
module.exports = start
