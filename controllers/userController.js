var User = require('../models/user');

var userCtrl = {};

userCtrl.login_view = function (req, res) {
  return res.render('login');
};

userCtrl.logout = function (req, res) {
  if (req.session.user) {
    req.session.user = undefined;
  }
  res.redirect('/users/login');
}

userCtrl.register = function (req, res) {
  var user = new User(req.body);
  var errors = [];

  if (req.body.password != req.body.passwordConfirm)
    return res.render('login', {errors: ['Password confirmation is invalid'], email : req.body.email});

  user.save(function (err, user) {
    if (err) {
      if (err.name == 'MongoError') {
        errors.push('Email is already used');
      } else {
        Object.keys(err.errors).forEach(function(error) {
          var k = error.substr(0, 1).toUpperCase() + error.substr(1);
          errors.push(k + " is invalid");
        });
      }
      return res.render('login', {errors: errors, email : req.body.email});
    } else
      return res.redirect('/projects');
  });
}

userCtrl.login = function (req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (user) {
      user.comparePassword(req.body.password, function (err, match) {
        if (!match) {
          res.render('login', {errors: ['Invalid password']});
        } else {
          req.session.user = user;
          res.redirect('/projects');
        }
      });
    } else {
      res.render('login', {errors: ['Invalid email']});
    }
  });
};

module.exports = userCtrl;
