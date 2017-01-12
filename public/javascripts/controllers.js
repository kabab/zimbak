
/*
 * Check if the object had a field
 * Otherwise return the default value
 */
function _helper(o, field, d) {
  if (field in o)
    return o[field];
  return d;
}


myApp.controller('PageController', ['$scope', 'ValueService', 'PageService',
  function ($scope, ValueService, PageService) {

  $scope.title = "";
  $scope.pages = [];
  $scope.project_id = null;
  $scope.new_page = {title: '', description: ''};

  $scope.init = function(project_id) {
    PageService.list(project_id).then(function (response) {
        $scope.pages = response.data == '' ? [] : response.data;
    });
    $scope.project_id = project_id;
  };

  $scope.create_page = function() {
    PageService.create($scope.project_id, $scope.new_page).then(function (response) {
      $scope.pages = response.data.pages == '' ? [] : response.data.pages;
      $('#myModal').modal('hide');
      $scope.new_page = {};
    });
  };

}]);

myApp.controller('TagController', ['$scope', 'ProjectService', 'TagService',
  function ($scope, ProjectService, TagService) {
    $scope.title = "";
    $scope.tags = [];
    $scope.project_id = null;
    $scope.new_tag = {title: '', description: ''};

    $scope.init = function(project_id) {
      TagService.list(project_id)
        .then(function (response) {
          $scope.tags = response.data == '' ? [] : response.data;
        });
      $scope.project_id = project_id;
    };

    console.log('Hello, it\'s me you looking for');

    $scope.create_tag = function() {
      TagService.create($scope.project_id, $scope.new_tag).
        then(function (response) {
          if (response.status == 200) {
            $scope.tags = response.data.tags == '' ? [] : response.data.tags;
            $('#tagModal').modal('hide');
            $scope.new_tag = {};
          }
        });
    };
  }
]);

myApp.controller('TagPlotController', ['$scope', 'TagService', 'ValueService',
  function ($scope, TagService, ValueService) {

    $scope.agg = 'avg';
    $scope.startDate = null;
    $scope.endDate = null;
    $scope.tag_id = null;

    $scope.state = 'Loading';

    $scope.init = function (tag_id) {
      $scope.tag_id = tag_id;
      $scope.get_values();
      daterangepicker_dates();
    };

    function draw_chart(d) {
      var labels = d.map(function (v) {
        var args = {};
        var year = _helper(v._id, 'year', (new Date()).getFullYear());
        var month = _helper(v._id, 'month', 0);
        var day = _helper(v._id, 'day', 1);
        var hour = _helper(v._id, 'hour', 12);
        var minute = _helper(v._id, 'mintue', 0);
        var d = new Date(year, month-1, day, hour, minute);
        return d;
      });

      var data = d.map(function(v) {
        return v.value;
      });

      if (main_chart == null) {
        main_chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                  label: 'Value ',
                  data: data,
                  borderWidth: 1,
                  lineTension: 0.1,
              }]
            },
            options: {
              responsive: true,
              scales: {
                  xAxes: [{
                      type: 'time',
                      time: {
                          displayFormats: {
                              quarter: 'MMM YYYY'
                          }
                      }
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              }
            }
        });
      } else {
        main_chart.data.datasets[0].data = data;
        main_chart.data.labels = labels;
        main_chart.update();
      }
      $scope.state = 'plot';
    }

    /*
     * Trigger date picker value changed
     */
    $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
      $scope.startDate = picker.startDate._d.getTime();
      $scope.endDate = picker.endDate._d.getTime();
      $scope.get_values();
    });

    $scope.filter = 'month';
    var filters = ['year', 'month', 'day', 'hour', 'minute'];

    $scope.set_filter = function (filter) {
      $scope.filter = filter;
      $scope.get_values();
    }

    var main_chart = null;
    var ctx = document.getElementById("chart");

    /*
     * Get max and min date for a tag using the _id
     * and setup daterangepicker with the returned values
     */
    function daterangepicker_dates() {
      var min_date = null, max_date = null;
      ValueService.min_date($scope.tag_id).then(function(response) {
        if (response.data.length > 0) {
          min_date = new Date(response.data[0].min_date);
          ValueService.max_date($scope.tag_id).then(function(response) {
            max_date = new Date(response.data[0].max_date);
            setup_datepickup(min_date, max_date);
            $scope.startDate = min_date;
            $scope.endDate = max_date;
          });
        }
      });
    };

    $scope.agg_changed = function () {
      $scope.get_values();
    };

    $scope.get_values = function() {
      ValueService.values($scope.tag_id, $scope.filter, $scope.agg, $scope.startDate, $scope.endDate)
        .then(function(response) {
          if (response.data.length == 0)
            $scope.state = 'No data';
          else
            draw_chart(response.data);
        });
    };
  }
]);

myApp.controller('UserController', ['$scope', '$location', function ($scope, $location) {
  $scope.register = false;
  $scope.welcome = "Sign in";
  $scope.action = "/users/login";

  $scope.register_mode = function (werrors) {
    if (!werrors)
      $("#errors").html("");
    $scope.register = true;
    $scope.welcome = "New account";
    $scope.action = "/users#register";
    return false;
  }

  $scope.login_mode = function (werrors) {
    if (!werrors)
      $("#errors").html("");
    $scope.register = false;
    $scope.welcome = "Sign in";
    $scope.action = "/users/login#login"
    return false;
  }

  if ($location.path() == '/register') {
    $scope.register_mode(true);
  } else {
    $scope.login_mode(true);
  }

}]);

myApp.controller('ProjectController', ['$scope', 'ProjectService', function ($scope, ProjectService) {

  $scope.new_project = {};
  $scope.projects = [];
  console.log('Hello, is me you looking for');
  $scope.create_project = function () {
    ProjectService.create($scope.new_project).then(function (response) {
      $("#projectModal").modal('hide');
      get_projects();
    });
  };

  $scope.select_project = function (project_id) {
    window.location.href = "/projects/" + project_id + "/tags_view";
  }

  var get_projects = function () {
    ProjectService.list().then(function (response) {
      if (response.status == 200) {
        $scope.projects = response.data;
      }
    });
  }

  get_projects();
}]);

myApp.controller('TagLogConroller', ['$scope', '$http', 'TagService', 'ValueService', '$location',
  function ($scope, $http, TagService, ValueService, $location) {

    $scope.agg = 'avg';
    $scope.startDate = null;
    $scope.endDate = null;
    $scope.tag_id = null;

    $scope.currentPage = 1;

    $scope.state = 'Loading';

    $scope.init = function (tag_id) {
      $scope.tag_id = tag_id;
      $scope.get_values();
      daterangepicker_dates();
    };

    /*
     * Trigger date picker value changed
     */
    $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
      $scope.startDate = picker.startDate._d.getTime();
      $scope.endDate = picker.endDate._d.getTime();
      $scope.get_values();
    });

    $scope.filter = 'month';
    var filters = ['year', 'month', 'day', 'hour', 'minute'];

    $scope.set_filter = function (filter) {
      $scope.filter = filter;
      $scope.get_values();
    }

    var main_chart = null;
    var ctx = document.getElementById("chart");

    /*
     * Check if the object had a field
     * Otherwise return the default value
     */
    function _helper(o, field, d) {
      if (field in o)
        return o[field];
      return d;
    }

    /*
     * Get max and min date for a tag using the _id
     * and setup daterangepicker with the returned values
     */
    function daterangepicker_dates() {
      var min_date = null, max_date = null;
      ValueService.min_date($scope.tag_id).then(function(response) {
        if (response.data.length > 0) {
          min_date = new Date(response.data[0].min_date);
          ValueService.max_date($scope.tag_id).then(function(response) {
            max_date = new Date(response.data[0].max_date);
            setup_datepickup(min_date, max_date);
            $scope.startDate = min_date;
            $scope.endDate = max_date;
          });
        }
      });
    };

    $scope.agg_changed = function () {
      $scope.get_values();
    };

    $scope.get_values = function() {

      ValueService.values($scope.tag_id, $scope.filter, $scope.agg, $scope.startDate, $scope.endDate)
        .then(function(response) {
          var i = 0;
          $scope.values = response.data.map(function (v) {
            var args = {};
            var year = _helper(v._id, 'year', (new Date()).getFullYear());
            var month = _helper(v._id, 'month', 0);
            var day = _helper(v._id, 'day', 1);
            var hour = _helper(v._id, 'hour', 12);
            var minute = _helper(v._id, 'mintue', 0);
            var d = new Date(year, month-1, day, hour, minute);
            return {id: i++, createdAt: d, value: v.value};
          });
          console.log($scope.values);
        });
    };
  }
]);
