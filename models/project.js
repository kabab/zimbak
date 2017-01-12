var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
  title:  String,
  description: String
});

var PlotSchema = new Schema({
  title: String,
  description: String,
  tag: {type: Schema.Types.ObjectId, ref: 'Tag'}
});

var PageSchema = new Schema({
  title:  String,
  description: String,
  plots: [PlotSchema]
});

var ProjectSchema = new Schema({
  title:  {type: String, required: true},
  description: String,
  admin: {type: Schema.Types.ObjectId, ref: 'User'},
  view: [{type: Schema.Types.ObjectId, ref: 'User'}],
  edit: [{type: Schema.Types.ObjectId, ref: 'User'}],
  tags: [TagSchema],
  pages: [PageSchema]
});

module.exports = mongoose.model('Project', ProjectSchema);
