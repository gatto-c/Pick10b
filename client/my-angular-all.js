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

/* global moment:false */
(function() {
  angular
  .module("myPick10")
  .constant("ergastAPIAddress", "http://ergast.com/api/f1")
  .constant("_", window._)
  .constant("moment", moment)
  .constant("appTitle", "F1 QuickPick");
})();
}());

;(function() {
"use strict";

/* eslint-disable */
angular

  //http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.VocdH3UrJ7g

.module("myPick10")

.config(['$routeProvider',

function($routeProvider) {
  $routeProvider
  .when('/', {
      templateUrl: '/client/my-ng-files/welcome/welcome.ng.template.html',
      controller: 'WelcomeController',
      controllerAs: 'ctrl'
  })
  .when('/login', {
    templateUrl: '/client/my-ng-files/welcome/login.ng.template.html',
    controller: 'loginController',
    controllerAs: 'ctrl'
  })
  .when('/logout', {
      controller: 'logoutController'
  })
  .when('/register', {
      templateUrl: '/client/my-ng-files/welcome/register.ng.template.html',
      controller: 'registerController',
      controllerAs: 'ctrl'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);
/* eslint-enable */
}());

;(function() {
"use strict";

'use strict';

(function() {
  angular

    .module('myPick10')

    .factory("MyHttp", MyHttp);

  MyHttp.$inject = ['$log','$http', '_'];

  function MyHttp($log, $http, _) {

    var HttpRequest = function(arg) {
      $log.debug(_);

      var isArgDefined = !_.isUndefined(arg);

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
          $log.debug('>>>>>response: ', response.data);
          return response.data
        }) ;
    };

    return HttpRequest;
  }
})();
}());

;(function() {
"use strict";

/* eslint-disable angular/di */
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
/* eslint-enable angular/di */
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

  .module("myPick10")

  .service('ergastCalls', ergastCalls);

  // inject dependencies
  ergastCalls.$inject = ['$log', 'MyHttp', 'ergastAPIAddress'];

  /**
   * wrapper for all ergast based calls to ergast api
   * @param $log
   * @param MyHttp
   * @returns {{}}
   */
  function ergastCalls($log, MyHttp, ergastAPIAddress){
    var ErgastCalls = {};

    ErgastCalls.noCall = function() {
      return "";
    };

    ErgastCalls.getRaceSchedule = function(year) {
      var myPromise;

      $log.info('ergastCalls.getRaceSchedule: ', year);

      //api call format: http://ergast.com/api/f1/year
      myPromise = MyHttp
        .path(ergastAPIAddress)
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
        .path(ergastAPIAddress)
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
  }

})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module("myPick10")

    .controller('raceResultsController', raceResultsController);

  raceResultsController.$inject = ['$log','MyHttp', 'ergastCalls'];

  function raceResultsController($log, MyHttp, ergastCalls) {
    var vm = this;
    vm.year = 2015;
    vm.race = 16;

    ergastCalls.noCall();

    //ergastCalls.getRaceSchedule(vm.year).then(function(results) {
    //  $log.debug('race schedule results for ', vm.year, ': ', results);
    //});

    //ergastCalls.getRaceResults(vm.year, vm.race).then(function(results) {
    //  $log.debug('race results for ', vm.year, '/', vm.race, ': ', results);
    //});

  }
})();
}());

;(function() {
"use strict";

/**
 * Created by chris on 01/01/16.
 */
}());

;(function() {
"use strict";

/**
 * Created by chris on 01/01/16.
 */
}());

;(function() {
"use strict";

/**
 * Created by chris on 01/01/16.
 */
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module('myPick10')

    .controller('WelcomeController', WelcomeController);

  //WelcomeController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
  WelcomeController.$inject = ['$log', 'appTitle'];

  function WelcomeController($log, appTitle) {
    var vm = this;

    vm.title = appTitle;

    //vm.login = login;

    //(function initController() {
    //  // reset login status
    //  AuthenticationService.ClearCredentials();
    //})();
    //
    //function login() {
    //  vm.dataLoading = true;
    //  AuthenticationService.Login(vm.username, vm.password, function (response) {
    //    if (response.success) {
    //      AuthenticationService.SetCredentials(vm.username, vm.password);
    //      $location.path('/');
    //    } else {
    //      FlashService.Error(response.message);
    //      vm.dataLoading = false;
    //    }
    //  });
    //}
  }

})();
}());

;(function() {
"use strict";

/* eslint-disable */
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
/* eslint-enable */
}());

;(function() {
"use strict";

angular.module("myPick10").run(["$templateCache", function($templateCache) {$templateCache.put("raceResults/raceResults.ng.template.html","<div>\n  <b>Race Results for {{rr.year}}/Race {{rr.race}}</b>\n  <form>\n    Year1:<input type=\"number\" ng-model=\"rr.year\" name=\"year\" min=\"1950\" max=\"2015\"/>\n    Race1:<input type=\"number\" ng-model=\"rr.race\" name=\"race\" min=\"1\" max=\"20\"/>\n  </form>\n</div>\n");
$templateCache.put("welcome/register.ng.template.html","<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title></title>\n</head>\n<body>\n\n</body>\n</html>\n");
$templateCache.put("welcome/welcome.ng.template.html","<div class=\"col-md-6 col-md-offset-3\">\n  <h1>Welcome - {{ ctrl.title }}</h1>\n  <h2>Login</h2>\n  <form name=\"form\" ng-submit=\"vm.login()\" role=\"form\">\n    <div class=\"form-group\" ng-class=\"{ \'has-error\': form.username.$dirty && form.username.$error.required }\">\n      <label for=\"username\">Username</label>\n      <input type=\"text\" name=\"username\" id=\"username\" class=\"form-control\" ng-model=\"vm.username\" required />\n      <span ng-show=\"form.username.$dirty && form.username.$error.required\" class=\"help-block\">Username is required</span>\n    </div>\n    <div class=\"form-group\" ng-class=\"{ \'has-error\': form.password.$dirty && form.password.$error.required }\">\n      <label for=\"password\">Password</label>\n      <input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" ng-model=\"vm.password\" required />\n      <span ng-show=\"form.password.$dirty && form.password.$error.required\" class=\"help-block\">Password is required</span>\n    </div>\n    <div class=\"form-actions\">\n      <button type=\"submit\" ng-disabled=\"form.$invalid || vm.dataLoading\" class=\"btn btn-primary\">Login</button>\n      <img ng-if=\"vm.dataLoading\" src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />\n      <a href=\"#/register\" class=\"btn btn-link\">Register</a>\n    </div>\n  </form>\n</div>\n");
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
      , controllerAs: 'rr'
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
