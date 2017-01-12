var mongoose = require('mongoose');
var logger = require('./logger')

var host = process.env.NODE_MONGO_HOST || 'mongodb://172.16.1.10';
var db = process.env.NODE_MONGO_HOST || 'test';

mongoose.connect(host + '/' + db, function(err) {
	var now = new Date();
	if (err) {
		logger.error('Connection error ' + err);
	} else {
		logger.info('Connection to mongooseongodb');
	}
});
