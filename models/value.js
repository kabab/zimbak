var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ValueSchema = new Schema({
  value:  Number,
  createdAt: {type: Date, default: Date.now},
  tag: {type: Schema.Types.ObjectId, ref: 'Tag'}
});

module.exports = mongoose.model('Value', ValueSchema);
