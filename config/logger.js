var dateFormat = require('dateformat');
var colors = require('colors');

var log = function(tag, msg, cl) {
	var now = new Date();
	var datetime = dateFormat(now, "isoDateTime");

	var outstr = '[ ' + datetime + ' ] ' + tag + ' : ' + msg;

	if (cl) console.log(cl(outstr))
	else console.log(outstr);
}

var info = function(msg) {
	log('INFO', msg, colors.green)
}

var error = function(msg) {
	log('ERROR', msg, colors.red);
}

var warn = function(msg) {
	log('WARN', msg, colors.yellow);
}

var debug = function(msg) {
	log('DEBUG', msg, colors.blue);
}

module.exports = {
	'log' : log,
	'info' : info,
	'error' : error,
	'warn' : warn,
	'debug' : debug,
};