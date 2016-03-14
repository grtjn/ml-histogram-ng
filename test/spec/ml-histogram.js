/* global describe, beforeEach, module, it, expect, inject */

describe('MLHistogram', function () {
  'use strict';

  var $httpBackend, $q, $location;

  beforeEach(module('ml.histogram'));

  beforeEach(inject(function ($injector) {
    $q = $injector.get('$q');
    $httpBackend = $injector.get('$httpBackend');
    $location = $injector.get('$location');
  }));

});
