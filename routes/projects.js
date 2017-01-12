var express = require('express');
var router = express.Router();

var projectCtrl = require('../controllers/projectController');

/* GET users listing. */
router.post('/', projectCtrl.create);
router.get('/list', projectCtrl.list);
router.get('/', projectCtrl.list_view);

router.get('/:id/pages_view', projectCtrl.pages_view);
router.get('/:id/tags_view', projectCtrl.tags_view);

router.get('/:id', projectCtrl.pages_view);

router.get('/:id/pages_list', projectCtrl.pages_list);
router.get('/:id/tags_list', projectCtrl.tags_list);

router.post('/:id/pages', projectCtrl.create_page);
router.post('/:id/tags', projectCtrl.create_tag);

router.get('/:id/page/:page_id', projectCtrl.page_view);
// router.get('/:id/tag/:page_id', projectCtrl.tag_view);

router.get('/:id/tags/:tag_id/plot', projectCtrl.tag_plot);
router.get('/:id/tags/:tag_id/log', projectCtrl.tag_log);

module.exports = router;
