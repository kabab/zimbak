var Tag = require('../models/tag');

var tagCtrl = {};

tagCtrl.create = function(req, res) {
	var tag = new Tag(req.body);
	tag.save(function(err, tag) {
		res.send(200);
	});
}

tagCtrl.delete = function(req, res) {

}

tagCtrl.update = function(req, res) {

}

module.exports = tagCtrl;
