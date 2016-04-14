(function(module) {
try {
  module = angular.module('mlHistogramNgDemo.Tpls');
} catch (e) {
  module = angular.module('mlHistogramNgDemo.Tpls', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/home.html',
    '<h1 class="page-header" itemprop="name">MarkLogic Histogram for Angular</h1><div class="home row"><h4>Key features</h4><ul><li>Show buckets for years, year-months, and dates easily in a chart</li><li>Show multiple facets in one histogram</li><li>Click to drill-down from year to year-month, and from year-month to date (in combination with the <a href="https://github.com/grtjn/ml-constraints#dynamic-buckets-constraint" rel="external">dynamic-buckets-constraint</a> on any date facet)</li><li>Leverages Highcharts and Highcharts-ng</li></ul><h4>Example</h4><div class="row"><div class="col-md-8 col-md-offset-1"><ml-histogram facets="ctrl.histogramFacets" toggle="ctrl.toggleFacet(facet, value)" title="Period1 vs Period2" type="line"></ml-histogram></div></div><div style="display:none">{{ctrl.histogramFacets}}</div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('mlHistogramNgDemo.Tpls');
} catch (e) {
  module = angular.module('mlHistogramNgDemo.Tpls', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/quickstart.html',
    '<h1 class="page-header">Quickstart</h1><div class="row"><div class="col-md-12"><p>To start using MarkLogic Histograms for Angular, follow these simple steps to get started.</p><ol class="steps"><li><p>Download <a href="https://raw.github.com/grtjn/ml-histogram-ng/master/dist/ml-histogram-ng.js" rel="external">ml-histogram-ng.js</a> (<a href="https://raw.github.com/grtjn/ml-histogram-ng/master/dist/ml-histogram-ng.min.js" rel="external">minified version</a>) and put it with your other scripts. Alternatively, you can use Bower to install it automatically:</p><div hljs="" no-escape="" language="bash">bower install [--save] ml-histogram-ng</div><p>Or if you prefer bleeding edge:</p><div hljs="" no-escape="" language="bash">bower install [--save] git@github.com:grtjn/ml-histogram-ng.git</div><p>If not using Bower, you\'ll also need to fetch <a href="https://github.com/highcharts/highcharts-dist/blob/master/highcharts.js" rel="external">highcharts.js</a>, <a href="https://github.com/highcharts/highcharts-dist/blob/master/highcharts-more.js" rel="external">highcharts-more.js</a>, <a href="https://github.com/highcharts/highcharts-dist/blob/master/modules/exporting.js" rel="external">exporting.js</a>, and <a href="https://github.com/pablojim/highcharts-ng/blob/master/dist/highcharts-ng.js" rel="external">highcharts-ng[.min].js</a> yourself.</p></li><li><p>Load highcharts.js, highcharts-more.js, exporting.js, highcharts-ng[.min].js, and ml-histogram-ng[.min].js into your HTML page (typically in the end of the <em>BODY</em> of your HTML):</p><pre hljs="" no-escape="" language="html">\n' +
    '&lt;script src=\'/bower_components/highcharts/highcharts.js\'>&lt;/script>\n' +
    '&lt;script src=\'/bower_components/highcharts/highcharts-more.js\'>&lt;/script>\n' +
    '&lt;script src=\'/bower_components/highcharts/modules/exporting.js\'>&lt;/script>\n' +
    '&lt;script src=\'/bower_components/highcharts-ng/dist/highcharts-ng[.min].js\'>&lt;/script>\n' +
    '&lt;script src=\'/bower_components/ml-histogram-ng/dist/ml-histogram-ng[.min].js\'>&lt;/script></pre><p class="text-muted">Note: You can simplify this by making use of <a href="https://www.npmjs.com/package/wiredep" rel="external">wiredep</a>, optionally together with <a href="https://www.npmjs.com/package/gulp-useref" rel="external">gulp-useref</a>.</p></li><li><p>Load ml-histogram-ng.css into your HTML page (typically in the end of the <em>HEAD</em> of your HTML):</p><pre hljs="" no-escape="" language="html">\n' +
    '&lt;link rel="stylesheet" href="/bower_components/ml-histogram-ng/dist/ml-histogram-ng[.min].css"></pre><p class="text-muted">Note: You can simplify this by making use of <a href="https://www.npmjs.com/package/wiredep" rel="external">wiredep</a>, optionally together with <a href="https://www.npmjs.com/package/gulp-useref" rel="external">gulp-useref</a>.</p></li><li><p>Make your application module depend on the <code>ml-histogram-ng</code> module:</p><div hljs="" no-escape="" language="js">angular.module(\'myApplicationModule\', [\'ml.histogram\']);</div></li><li><p>Expose objects and call-back functions in your Angular controller:</p><pre hljs="" no-escape="" language="js">\n' +
    'SearchCtrl.$inject = [\'$scope\', \'$location\', \'userService\', \'MLSearchFactory\'];\n' +
    '\n' +
    '// inherit from MLSearchController\n' +
    'var superCtrl = MLSearchController.prototype;\n' +
    'SearchCtrl.prototype = Object.create(superCtrl);\n' +
    '\n' +
    'function SearchCtrl($scope, $location, userService, searchFactory) {\n' +
    '  var ctrl = this;\n' +
    '  var mlSearch = searchFactory.newContext();\n' +
    '\n' +
    '  superCtrl.constructor.call(ctrl, $scope, $location, mlSearch);\n' +
    '\n' +
    '  ctrl.init();\n' +
    '\n' +
    '  ctrl.histogramFacets = {};\n' +
    '\n' +
    '  // override the updateSearchResults function from superCtrl to append a call to updateCloud..\n' +
    '  ctrl.updateSearchResults = function updateSearchResults(data) {\n' +
    '    superCtrl.updateSearchResults.apply(ctrl, arguments);\n' +
    '    ctrl.histogramFacets = {};\n' +
    '    ctrl.histogramFacets.Period1 = data.facets.Period1;\n' +
    '    ctrl.histogramFacets.Period2 = data.facets.Period2;\n' +
    '    return ctrl;\n' +
    '  };\n' +
    '\n' +
    '}\n' +
    '</pre></li><li><p>Add a <code>&lt;ml-histogram&gt;</code> element in your template like so:</p><pre hljs="" no-escape="" language="html">\n' +
    '&lt;ml-histogram facets="ctrl.histogramFacets" toggle="ctrl.toggleFacet(facet, value)" title="Period1 vs Period2" type="line">&lt;/ml-histogram></pre></li></ol></div></div>');
}]);
})();
