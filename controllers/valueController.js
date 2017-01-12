var Value = require('../models/value');
var mongoose = require('mongoose');
var valueCtrl = {};

valueCtrl.create = function(req, res) {
	var value = new Value(req.body);

	value.save(function(err, tag) {
		console.log(err);
		res.send(200);
	});
};

valueCtrl.list_by_tag = function (req, res) {
	Value.find({tag: req.params.id}, function(err, values) {
		if (!err) {
			res.json(values);
		} else {
			res.sendStatus(404);
		}
	});
};


valueCtrl.groupby = function (req, res) {

	var page = req.query.page || 0;
	console.log(page);

	var filters = [
		{year: {$year: "$createdAt"}},
		{month: {$month: "$createdAt"}},
		{day: {$dayOfMonth: "$createdAt"}},
		{hour: {$hour: "$createdAt"}},
		{minute: {$minute: "$createdAt"}}
	];

	var filter = req.params.filter;
	var agg = req.params.agg;
	var group_value = {}
	group_value['$' + agg] = "$value";
	var keys = Object.keys(filters);
	var group_options = {};

	var startDate = parseInt(req.params.startDate) || 0;
	var endDate = parseInt(req.params.endDate) || 0;

	var match_options = {tag:  mongoose.Types.ObjectId(req.params.id)};

	if (startDate != 0 && endDate != 0) {
		match_options['createdAt'] = {$gte: new Date(startDate), $lte: new Date(endDate)};
	}

	for(var i = 0; i < filters.length; i++) {
		var key = Object.keys(filters[i])[0];
		group_options[key] = filters[i][key];
		if (key == filter)
			break;
	}

	Value.aggregate({$match: match_options},
				{$group: {_id: group_options, value: group_value}},
				{$sort: {"_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1, "_id.minute": 1}})
		.exec(function (err, data) {
			return res.json(data);
		});
};

valueCtrl.max_date = function (req, res) {
	Value.aggregate({$match: {tag:  mongoose.Types.ObjectId(req.params.id)}},
				{$group: {_id: null, max_date: {$max: "$createdAt"}}})
		.exec(function (err, data) {
			return res.json(data);
	});
};

valueCtrl.min_date = function (req, res) {
	Value.aggregate({$match: {tag:  mongoose.Types.ObjectId(req.params.id)}},
				{$group: {_id: null, min_date: {$min: "$createdAt"}}})
		.exec(function (err, data) {
			return res.json(data);
	});
};

module.exports = valueCtrl;
