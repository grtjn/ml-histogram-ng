(function(){
  'use strict';
  
  angular
    .module('mlHistogramNgDemo', [
      'ui.router',
      'ui.bootstrap',
      'ml.histogram',
      'hljs',
      'mlHistogramNgDemo.Tpls'
    ])
    
    .config([
      '$locationProvider',
      '$urlRouterProvider',
      '$stateProvider',
      App
    ]);

  function App($locationProvider, $urlRouterProvider, $stateProvider) {

    //$locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        controller: 'mlHistogramNgDemo.HomeCtrl',
        controllerAs: 'ctrl',
        templateUrl: '/home.html',
        resolve: {
        }
      })
      .state('quickstart', {
        url: '/quickstart',
        controller: 'mlHistogramNgDemo.HomeCtrl',
        controllerAs: 'ctrl',
        templateUrl: '/quickstart.html',
        resolve: {
        }
      })
    ;
      
  }
})();

(function () {
  'use strict';

  angular.module('mlHistogramNgDemo')

    .controller('mlHistogramNgDemo.HomeCtrl', [
      '$scope',
      '$http',
      '$location',
      '$window',
      HomeCtrl
    ]);

  function HomeCtrl($scope, $http, $location, $window) {
    var ctrl = this;
    $scope.ctrl = ctrl;

    ctrl.words = [];

    ctrl.noRotate = function(word) {
      return 0;
    };

    var yearsResponse;
    var monthsResponse;
    var daysResponse;

    $http
      .get('data/Period-facets_years.json')
      .success(function(response) {
        yearsResponse = response;
      });
    $http
      .get('data/Period-facets_months.json')
      .success(function(response) {
        monthsResponse = response;
      });
    $http
      .get('data/Period-facets_days.json')
      .success(function(response) {
        daysResponse = response;
      });

    ctrl.toggleFacet = function() {
      if (ctrl.histogramFacets.Period1.facetValues[1].value === '1996') {
        ctrl.histogramFacets = {
          Period1: monthsResponse.facets.Period1,
          Period2: monthsResponse.facets.Period2
        };
      } else if (ctrl.histogramFacets.Period1.facetValues[0].value === '2014-01') {
        ctrl.histogramFacets = {
          Period1: daysResponse.facets.Period1,
          Period2: daysResponse.facets.Period2
        };
      } else {
        ctrl.histogramFacets = {
          Period1: yearsResponse.facets.Period1,
          Period2: yearsResponse.facets.Period2
        };
      }
    };

    ctrl.toggleFacet();

  }

}());
