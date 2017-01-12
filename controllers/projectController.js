var Project = require('../models/project');
var projectCtrl = {};

projectCtrl.create = function(req, res) {
	var project = new Project(req.body);
	project.admin = req.session.user._id;
	project.save(function(err, tag) {
		if (err) {
			res.json(err);
		} else {
			res.sendStatus(200);
		}
	});
};

projectCtrl.list = function(req, res) {
  Project.find({admin: req.session.user._id}, function(err, projects) {
    if (projects) {
      res.json(projects);
    } else {
      res.sendStatus('error');
    }
  });
};

projectCtrl.list_view = function(req, res) {
    res.render('dashboard/projects', {controller: 'ProjectController' });
};

projectCtrl.pages_view = function(req, res) {
	Project.findById(req.params.id, function(err, project) {
		if (project) {
			res.render('dashboard/pages', {project: project, controller: 'PageController'});
		} else {
			res.send(200);
		}
	})
};

projectCtrl.tags_view = function(req, res) {
	Project.findById(req.params.id, function(err, project) {
		if (project) {
			res.render('dashboard/tags', {project: project, controller: 'TagController'});
		} else {
			res.send(200);
		}
	})
};

projectCtrl.pages_list = function(req, res) {
	Project.findById(req.params.id, function(err, project) {
    if (project) {
			if (!project.pages) {
				res.json([]);
			} else {
				res.json(project.pages);
			}
    } else {
      res.json('error')
    }
  });
};

projectCtrl.tags_list = function(req, res) {
	Project.findById(req.params.id, function(err, project) {
	    if (project) {
	    	console.log(project.admin);
			if (!project.tags) {
				res.json([]);
			} else {
				res.json(project.tags);
			}
	    } else {
	      res.json('error')
	    }
  	});
};

projectCtrl.create_page = function(req, res) {
	var update = {'$push': {pages: req.body}};
	Project.findByIdAndUpdate(req.params.id, update, {new: true}, function(err, p) {
		if (err)
			req.sendStatus(402);
		else
			res.json(p);
	});
};

projectCtrl.create_tag = function(req, res) {
	var update = {'$push': {tags: req.body}};

	Project.findByIdAndUpdate(req.params.id, update, {new: true}, function(err, p) {
		if (err)
			req.sendStatus(402);
		else
			res.json(p);
	});
};

projectCtrl.page_view = function(req, res) {
	Project.findById(req.params.id, function(err, project) {
		if (project) {
			var page = project.pages.id(req.params.page_id);
			res.render('dashboard/page', {project: project, page: page, controller: 'PageController'});
		} else {
			res.send(200);
		}
	});
};

projectCtrl.tag_plot = function(req, res) {
	Project.findById(req.params.id, function(err, project) {
		if (project) {
			var tag = project.tags.id(req.params.tag_id);
			res.render('dashboard/tag_plot', {project: project, tag: tag, controller: 'TagController'});
		} else {
			res.send(200);
		}
	})
};

projectCtrl.tag_log = function(req, res) {
	Project.findById(req.params.id, function(err, project) {
		if (project) {
			var tag = project.tags.id(req.params.tag_id);
			res.render('dashboard/tag_log', {project: project, tag: tag, controller: 'TagController'});
		} else {
			res.send(200);
		}
	})
};

projectCtrl.tag_api = function(req, res) {
	Project.findById(req.params.id, function(err, project) {
		if (project) {
			var tag = project.tags.id(req.params.tag_id);
			res.render('dashboard/tag_api', {project: project, tag: tag, controller: 'TagController'});
		} else {
			res.send(200);
		}
	})
};

module.exports = projectCtrl;
