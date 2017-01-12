var express = require('express');
var router = express.Router();;

/* GET home page. */

// router.get('/projects', projectCtrl.list)

router.get('/', function(req, res) {
	res.send("Hello world!");
});

module.exports = router;
