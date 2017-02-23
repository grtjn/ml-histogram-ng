(function () {

  'use strict';

  angular.module('ml.histogram')
    .directive('mlHistogram', HistogramDirective)
    .controller('HistogramController', HistogramController);

  function HistogramDirective() {
    return {
      restrict: 'E',
      controller: 'HistogramController',
      controllerAs: 'ctrl',
      replace: true,
      scope: {
        facets: '=',
        toggle: '&',
        title: '@',
        type: '@',
        colors: '=',
        legend: '@'
      },
      templateUrl: '/ml-histogram-ng/ml-histogram.html'
    };
  }

  HistogramController.$inject = ['$scope', '$timeout'];

  function HistogramController($scope, $timeout) {
    var ctrl = this;

    ctrl.toggleFacet = function(facet, value) {
      $scope.toggle({facet: facet, value: value});
    };

    $scope.$watch('facets', function(newFacets) {
      ctrl.updateChart(newFacets);
    });

    ctrl.histogram = {
      options: {
        chart: {
          type: $scope.type || 'column',
          zoomType: 'x',
          marginTop: 40,
          events: {
            selection: function (event) {
              if (event.xAxis) {
                var min = event.xAxis[0].min;
                var max = event.xAxis[0].max;
                
                if (event.xAxis[0].axis.categories) {
                  min = event.xAxis[0].axis.categories[Math.round(min)];
                  max = event.xAxis[0].axis.categories[Math.round(max)];
                }

                var hasYear = ctrl.histogram.series.filter(function(s){
                  return s.hasYear;
                }).length > 0;
                var hasYearMonth = ctrl.histogram.series.filter(function(s){
                  return s.hasYearMonth;
                }).length > 0;

                if (hasYear) {
                  ctrl.toggleFacet(ctrl.histogram.series[0].name, min + '-' + max);
                } else if (hasYearMonth) {
                  min = new Date(min).toISOString().substr(0,7);
                  max = new Date(max).toISOString().substr(0,7);
                  ctrl.toggleFacet(ctrl.histogram.series[0].name, min + '-' + max);
                } else {
                  min = new Date(min).toISOString().substr(0,10);
                  max = new Date(max).toISOString().substr(0,10);
                  ctrl.toggleFacet(ctrl.histogram.series[0].name, min + '-' + max);
                }
              }
              return false;
            }
          }
        },
        legend: {
          enabled: ($scope.legend+'') === 'true'
        },
        colors: $scope.colors || ['black', '#337ab7'],
        plotOptions: {
          line: {
            dataLabels: {
              enabled: false,
              format: '{y}'
            }
          },
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: function (e) {
                  // var posx = e.pageX || e.clientX;
                  // var posy = e.pageY || e.clientY;
                  var facet = this.series.name;
                  var series = ctrl.histogram.series.filter(function(s){
                    return s.name === facet;
                  })[0];
                  var x = this.category || this.x;
                  if ((x+'').match(/^[≤≥]/)) {
                    x = +(x+'').substr(1);
                  }
                  // var y = this.y;
                  if (series.hasYear) {
                    ctrl.toggleFacet(facet, x);
                  } else if (series.hasYearMonth) {
                    ctrl.toggleFacet(facet, new Date(x).toISOString().substr(0,7));
                  } else {
                    ctrl.toggleFacet(facet, new Date(x).toISOString().substr(0,10));
                  }
                }
              }
            }
          }
        },

        tooltip: {
          shared: true,
          crosshairs: true,
          headerFormat: '<b>{point.key}</b><br/>',
          pointFormat: '{series.name}: <b>{point.y:.0f}</b><br/>'
        }
      },

      series: [],

      title: {
        text: $scope.title || 'Histogram'
      },

      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date'
        },
        labels: {},
        dateTimeLabelFormats: {
          /*millisecond: '%e %b %H:%M:%S,%L',
          second: '%e %b %H:%M:%S',
          minute: '%e %b %H:%M',
          hour: '%e %b %H:%M',
          day: '%e %b %H:%M',*/
          day: '%e %b',
          week: '%e %b',
          month: '%b \'%y',
          year: '%Y'
        }
      },
      yAxis: [{
        title: {
          text: 'Frequency'
        }
      },{
        linkedTo: 0,
        opposite: true,
        title: {
          text: null
        }
      }]
    };

    ctrl.updateChart = function(facets) {
      if (facets) {
        var series = [];
        var xCategories = [];
        var globalHasYear = false;
        var globalHasYearMonth = false;
        var facetTypes = {};

        // check for mixtures of year, year-month, and date facets
        angular.forEach(facets, function(facet, facetName) {
          var hasYear = false;
          var hasYearMonth = false;

          angular.forEach(facet.facetValues, function(value, index) {
            if (value.value.match(/^[≤≥]?\d\d\d\d$/)) {
              hasYear = globalHasYear = true;
            } else if (value.value.match(/^\d\d\d\d-\d\d$/)) {
              hasYearMonth = globalHasYearMonth = true;
            }
          });

          facetTypes[facetName] = {
            hasYear: hasYear,
            hasYearMonth: hasYearMonth
          };
        });

        facets = angular.copy(facets);

        // normalize all facets to same datatype
        // year is strongest, year-month second
        angular.forEach(facets, function(facet, facetName) {
          var newKeys = {};
          var newValues = [];

          if (globalHasYear) {
            if (facetTypes[facetName].hasYear) {
              // nothing to do
            } else if (facetTypes[facetName].hasYearMonth) {
              // strip month from year-month, and aggregate
              angular.forEach(facet.facetValues, function(value, index) {
                var key = value.value.substring(0,4);
                newKeys[key] = (newKeys[key] || 0) + value.count;
              });
            } else {
              // strip month-day from date, and aggregate
              angular.forEach(facet.facetValues, function(value, index) {
                var key = value.value.substring(0,4);
                newKeys[key] = (newKeys[key] || 0) + value.count;
              });
            }
          } else if (globalHasYearMonth) {
            if (facetTypes[facetName].hasYear) {
              // should not be reached!
              throw 'ml-histogram-ng execution error';
            } else if (facetTypes[facetName].hasYearMonth) {
              // nothing to do
            } else {
              // strip day from date, and aggregate
              angular.forEach(facet.facetValues, function(value, index) {
                var key = value.value.substring(0,7);
                newKeys[key] = (newKeys[key] || 0) + value.count;
              });
            }
          }

          // convert aggregated counts to facetValues
          if (Object.keys(newKeys).length > 0) {
            angular.forEach(newKeys, function(count, key) {
              newValues.push({
                name: key,
                count: count,
                value: key
              });
            });
            facet.facetValues = newValues;
          }
        });

        angular.forEach(facets, function(facet, facetName) {
          var data = [];

          angular.forEach(facet.facetValues, function(value, index) {
            var val = value.value;
            var pos;

            if (globalHasYear) {
              // use categories for year to support ≤≥

              // prefer ≤≥jjjj for display of years
              if (val.match(/^[≤≥]/)) {
                pos = xCategories.indexOf(val.substr(1));
                if (pos >= 0) {
                  xCategories[pos] = val;
                }
              }

              // build categories list for years
              pos = xCategories.indexOf(val);
              if (pos < 0) {
                pos = xCategories.indexOf('≤'+val);
                if (pos < 0) {
                  pos = xCategories.indexOf('≥'+val);
                  if (pos < 0) {
                    pos = xCategories.length;
                    xCategories.push(val);
                  }
                }
              }

              val = pos;
            } else if (globalHasYearMonth) {
              // let highcharts generate labels, highcharts works with timestamp
              val = new Date(value.value + '-01').getTime();
            } else {
              // let highcharts generate labels, highcharts works with timestamp
              val = new Date(value.value).getTime();
            }
            data.push([val, value.count]);
          });

          series.push({
            name: facetName,
            data: data,
            hasYear: globalHasYear,
            hasYearMonth: globalHasYearMonth
          });
        });

        if (globalHasYear) {

          // sort the labels by year, while ignoring ≤≥
          var sortedXCategories = xCategories.slice().sort(function(l, r) {
            l = Number((l+'').replace(/[≤≥]/, ''));
            r = Number((r+'').replace(/[≤≥]/, ''));
            return l - r;
          });
          angular.forEach(series, function(serie, index) {
            angular.forEach(serie.data, function(point, index) {
              var x = point[0];
              var newX = sortedXCategories.indexOf(xCategories[x]);
              point[0] = newX;
            });
          });
          ctrl.histogram.xAxis.categories = sortedXCategories;

        } else {

          // flush categories to not confuse Highcharts
          delete ctrl.histogram.xAxis.categories;

        }

        // make sure highcharts responds to xAxis type changes
        if (globalHasYear) {
          ctrl.histogram.xAxis.isDirty = ctrl.histogram.xAxis.type !== 'category';
          ctrl.histogram.xAxis.type = 'category';
        } else {
          ctrl.histogram.xAxis.isDirty = ctrl.histogram.xAxis.type !== 'datetime';
          ctrl.histogram.xAxis.type = 'datetime';
        }

        // Last but not least, update histogram series data
        ctrl.histogram.series = series;

        $timeout(redrawChart, 0);
      }

      // workaround for change from number to datetime not propagated properly to chart object
      function redrawChart() {
        var chart = ctrl.histogram.getHighcharts && ctrl.histogram.getHighcharts();
        if (chart) {
          chart.xAxis[0].type = ctrl.histogram.xAxis.type;
          chart.xAxis[0].isDirty = true;
          if (ctrl.histogram.xAxis.type === 'datetime') {
            chart.xAxis[0].isDatetimeAxis = true;
          } else {
            chart.xAxis[0].isDatetimeAxis = false;
          }
          if (globalHasYear) {
            chart.xAxis[0].categories = ctrl.histogram.xAxis.categories;
          } else {
            delete chart.xAxis[0].categories;
          }
          chart.redraw();
        } else {
          console.log('Histogram chart not initialized. Is Highcharts enabled?');
        }
      }
    };

  }

}());
