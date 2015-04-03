angular.module('app', [])
  .controller('MainCtrl', function($scope) {
    $scope.chart = {
      chartType: 'BarChart',
      dataTable:
 {
        cols: [{id: 'task', label: 'Task', type: 'string'},
               {id: 'hours', label: 'Hours per Day', type: 'number'}],
        rows: [{c:[{v: 'Work'}, {v: 11}]},
               {c:[{v: 'Eat'}, {v: 2}]},
               {c:[{v: 'Commute'}, {v: 2}]},
               {c:[{v: 'Watch TV'}, {v:2}]},
               {c:[{v: 'Sleep'}, {v:7, f:'7.000'}]}
              ]

      },

        options: {
          'title': 'Countries',
          chartArea:{left:10,top:20,width:"100%",height:"100%"}

        },
    };

    $scope.$watch('chart', function(chart) {
      $scope.imgSrc = 'http://192.168.59.103/chart?json=';
      $scope.imgSrc += JSON.stringify(chart);
    }, true);
  });

angular.bootstrap(document, ['app']);
