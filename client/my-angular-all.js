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

.service('ErgastCalls', ['$log', 'MyHttp',

  /**
   * wrapper for all ergast based calls to ergast api
   * @param $log
   * @param MyHttp
   * @returns {{}}
   */
  function($log, MyHttp){
    var ErgastCalls = {};

    ErgastCalls.getRaceSchedule = function(year) {
      var myPromise;

      $log.info('ergastCalls.getRaceSchedule: ', year);

      //api call format: http://ergast.com/api/f1/year
      myPromise = MyHttp
        .path('http://ergast.com/api/f1')
        .path(year)
        .path('results.json?limit=500')
        .get()
        .catch(function () {
          myPromise = null
        });

      return myPromise;
    };

    /**
     * returns race results for the specified race identified by year (xxxx) and race number (1-xx)
     * @param year
     * @param race
     * @returns {*}
     */
    ErgastCalls.getRaceResults = function(year, race) {
      var myPromise;

      $log.info('ergastCalls.getRaceResults: ', year, '/', race);

      //api call format: http://ergast.com/api/f1/year/race/results.json
      myPromise = MyHttp
        .path('http://ergast.com/api/f1')
        .path(year)
        .path(race)
        .path('results.json?limit=30')
        .get()
        .catch(function () {
          myPromise = null
        });

      return myPromise;
    };

    return ErgastCalls;
  }]);
}());

;(function() {
"use strict";

angular

.module("myPick10")

.controller('raceResultsController',

['$scope', 'SampleProxy', '$log','MyHttp', 'ErgastCalls',

function($scope, samples, $log, MyHttp, ErgastCalls){

    $log.debug('>>>>>Here2!!!!');

    getRaceResults();

    function getRaceResults() {
        $log.debug('>>>>>Here3!!!!');


        var year = 2015,
            race = 16;

        ErgastCalls.getRaceSchedule(year).then(function(results) {
          $log.debug('race schedule results for ', year, ': ', results);
        });

        //ergastCalls.getRaceResults(vm.year, vm.race).then(function(results) {
        //  $log.debug('race results for ', vm.year, '/', vm.race, ': ', results);
        //});

    }
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

angular.module("myPick10").run(["$templateCache", function($templateCache) {$templateCache.put("raceResults/raceResults.ng.template.html","<div>\n  <b>Race Results for</b>\n  <!--<form>-->\n    <!--Year1:<input type=\"number\" ng-model=\"rr.year\" name=\"year\" min=\"1950\" max=\"2015\"/>-->\n    <!--Race1:<input type=\"number\" ng-model=\"rr.race\" name=\"race\" min=\"1\" max=\"20\"/>-->\n  <!--</form>-->\n</div>\n");
$templateCache.put("components/sample/sample.ng.template.html","<div>\n    Try a number here: <input type=\"number\" name=\"input\" ng-model=\"sample\" ng-change=\"calculate()\"><br/>\n    After calling to the server, the value is now: <span>{{calculated}}</span>\n</div>\n");}]);
}());

;(function() {
"use strict";

angular

.module("myPick10")

.directive('raceResults', function() {
    return {
      restrict: 'E'
      , transclude: true
      , replace: true
      , scope: true
      , controller: 'raceResultsController'
      , templateUrl: 'raceResults/raceResults.ng.template.html'
    };
  });
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
