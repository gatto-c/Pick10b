;(function() {
"use strict";

angular.module("myPick10", [
  'ui.bootstrap'
  , 'ngCookies'
  , 'ui.grid'
  , 'ui.grid.grouping'
  , 'ui.grid.autoResize'
  , 'ui.grid.resizeColumns'
  , 'ngRoute'
]);
}());

;(function() {
"use strict";

angular

.module("myPick10")

.constant("_",window._);
}());

;(function() {
"use strict";

angular

.module("myPick10")

.constant("moment",moment);
}());

;(function() {
"use strict";

angular

.module("myPick10")

.config(['$routeProvider',

function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: '/client/my-ng-files/routes/sample.html'
  })
  .otherwise({
    redirectTo: '/home'
  });
}]);
}());

;(function() {
"use strict";

angular

.module("myPick10")

.factory('MyHttp',

['$log','$http','_',

function ($log, $http, _) {

  var HttpRequest = function(arg) {

    var isArgDefined = !_.isUndefined(arg)

    if(isArgDefined && _.isString(arg)) {
      angular.extend(this, {chunks: [arg], isHttpRequest: true });
    }
    else if(isArgDefined && _.isObject(arg) && arg.isHttpRequest ) {
      angular.extend(this, {chunks: _.cloneDeep(arg.chunks), isHttpRequest: true });
    }
    else {
      angular.extend(this, {chunks: [], isHttpRequest: true });
    }

  };

  HttpRequest.path = function(chunk) {
    return new HttpRequest(chunk)
  };

  HttpRequest.prototype.path = function(chunk) {
    this.chunks.push(chunk);
    return this ;
  };

  HttpRequest.prototype.getUrl = function() {
    return this.chunks.join('/')
  };

  HttpRequest.prototype.put = function(objectToPut) {
    var url = this.getUrl();
    return $http.put(url, objectToPut).
      then(function(response){
        return response.data
      }) ;
  };


  HttpRequest.prototype.post = function(objectToPost) {
    var url = this.getUrl();
    $log.info('Posting: ' + url);
    return $http.post(url, objectToPost).
      then(function(response){
        return response.data
      }) ;
  };

  HttpRequest.prototype.get = function() {
    var url = this.getUrl();

    $log.info('Getting: ' + url);

    return $http.get(url).
      then(function(response){
        return response.data
      }) ;
  };

  return HttpRequest;

}]);
}());

;(function() {
"use strict";

angular

.module("myPick10")

.service('SampleProxy',

['$log', 'MyHttp',

function($log, MyHttp) {
  var SampleProxy = {};

  var samplePromise;

  SampleProxy.getSample = function(id) {
    $log.info('SampleProxy.getSample');

    samplePromise = MyHttp
      .path('rest')
      .path('samples')
      .path(id)
      .get()
      .catch(function () {
        samplePromise = null
      });

    return samplePromise;
  };

  return SampleProxy;
}]);
}());

;(function() {
"use strict";

angular

.module("myPick10")

.controller('sampleCtrl',

['$scope','SampleProxy',

function($scope,samples){

  $scope.calculate = function(){
    samples.getSample($scope.sample)
      .then(function(sample){
        $scope.calculated=sample;
      });
  }

}]);
}());

;(function() {
"use strict";

angular.module("myPick10").run(["$templateCache", function($templateCache) {$templateCache.put("components/sample/sample.ng.template.html","<div>\n    Try a number here: <input type=\"number\" name=\"input\" ng-model=\"sample\" ng-change=\"calculate()\"><br/>\n    After calling to the server, the value is now: <span>{{calculated}}</span>\n</div>\n");}]);
}());

;(function() {
"use strict";

angular

.module("myPick10")

.directive('frtSample', function () {
  return {
    restrict: 'E'
    , transclude: true
    , replace: true
    , scope: true
    , controller: 'sampleCtrl'
    , templateUrl: 'components/sample/sample.ng.template.html'
  };
});
}());
