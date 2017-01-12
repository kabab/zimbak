var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var config = require('../config/config');
var validator = require('validator');

var emailValidator = {
  validator: validator.isEmail,
  message: '{VALUE} is not a valid email'
}

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: {type: String, required: true, index: {unique: true}, validate: emailValidator},
  password: {type: String, required: true, maxlength: 32, minlength: 6}

});

UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(config.USER_PASS_HASH_ROUNDS, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});


UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
