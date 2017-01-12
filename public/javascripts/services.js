var API_URL = 'https://172.16.1.11:3000'

myApp.factory('ValueService', ['$http', function ($http) {
  return {
    values: function (tag_id, filter, agg, startDate, endDate) {
      var agg = agg || 'sum';
      var endDate = endDate || 0;
      var startDate = startDate || 0;
      return $http.get(API_URL + '/values/tag/' + tag_id + '/' + filter + '/' + agg + '/' + startDate + '/' + endDate + window.location.search);
    },
    min_date: function (tag_id) {
      return $http.get(API_URL + '/values/tag/' + tag_id + '/min_date');
    },
    max_date: function (tag_id) {
      return $http.get(API_URL + '/values/tag/' + tag_id + '/max_date');
    }
  };
}]);

myApp.factory('TagService', ['$http', function ($http) {
  return {
    create: function (project_id, tag) {
      return $http.post(API_URL + '/projects/' + project_id + '/tags', tag)
    },
    list: function (project_id) {
      return $http.get(API_URL + '/projects/' + project_id + '/tags_list');
    }
  };
}]);

myApp.factory('ProjectService', ['$http', function ($http) {
  return {
    create: function (project) {
      return $http.post(API_URL + '/projects/' , project);
    },
    list: function () {
      return $http.get(API_URL + '/projects/list')
    }
  };
}]);

myApp.factory('PageService', ['$http', function ($http) {
  return {
    list: function (project_id) {
      return $http.get(API_URL + '/projects/' + project_id + '/pages_list');
    },
    create: function (project_id, page) {
      return $http.post(API_URL + '/projects/' + project_id + '/pages', page);
    }
  };
}]);
