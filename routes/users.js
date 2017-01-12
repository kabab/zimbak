var express = require('express');
var router = express.Router();

var userCtrl = require('../controllers/userController');

/* GET users listing. */
router.get('/login', userCtrl.login_view);
router.post('/login', userCtrl.login);
router.post('/', userCtrl.register);


router.use(function(req, res, next) {
  if (!req.session)
    return res.redirect('/users/login');
  next();
});

router.post('/', userCtrl.logout);

module.exports = router;
