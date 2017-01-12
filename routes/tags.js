var express = require('express');
var router = express.Router();

var tagCtrl = require('../controllers/tagController');

/* GET users listing. */
router.post('/', tagCtrl.create);

module.exports = router;
