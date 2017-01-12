var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
  title:  {type: String, required: true, index: {unique: true}},
  description: String
});

module.exports = mongoose.model('Tag', TagSchema);
