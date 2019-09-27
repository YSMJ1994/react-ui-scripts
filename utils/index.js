

const executeDelay = (function () {
	let executeDelayTag;
	return function(task, timeout) {
		clearTimeout(executeDelayTag);
		executeDelayTag = setTimeout(task, timeout);
	}
})()

module.exports = {
	executeDelay
}
