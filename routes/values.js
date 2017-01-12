var express = require('express');
var router = express.Router();

valueCtrl = require('../controllers/valueController');
/* GET users listing. */
router.post('/', valueCtrl.create);
router.get('/tag/:id', valueCtrl.list_by_tag);
router.get('/tag/:id/min_date', valueCtrl.min_date);
router.get('/tag/:id/max_date', valueCtrl.max_date);
router.get('/tag/:id/:filter/:agg/:startDate/:endDate', valueCtrl.groupby);

module.exports = router;
