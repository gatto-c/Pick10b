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

angular
  .module("myPick10")

  .run(['$rootScope', '$log', '$location', '$route', 'AuthService',
    function($rootScope, $log, $location, $route, AuthService) {
      $log.debug('Running pre-code');

      $rootScope.$on('$routeChangeStart', function (event, next, current) {
        $log.debug('User logged in: ', AuthService.isLoggedIn());

        if (next.access.restricted && AuthService.isLoggedIn() === false) {
          $log.debug('route-check - user NOT logged in: redirecting to login ui');
          $location.path('/login');
        } else {
          $log.debug('route-check - access granted: ', {'restricted': next.access.restricted, 'user logged in': AuthService.isLoggedIn()});
        }
      });
    }
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
      controllerAs: 'vm',
      access: {restricted: true}
  })
  .when('/login', {
    templateUrl: '/client/my-ng-files/welcome/login.ng.template.html',
    controller: 'LoginController',
    controllerAs: 'vm',
    access: {restricted: false}
  })
  .when('/logout', {
      controller: 'LogoutController',
      controllerAs: 'vm',
      access: {restricted: true}
  })
  .when('/register', {
      templateUrl: '/client/my-ng-files/welcome/register.ng.template.html',
      controller: 'registerController',
      controllerAs: 'vm',
      access: {restricted: true}
  })
  .otherwise({
    redirectTo: '/login'
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
          $log.debug('response: ', response.data);
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

    .module('myPick10')

    .service('AuthService', AuthService);

    // inject dependencies
    AuthService.$inject = ['$q', '$timeout', '$http', '$log'];

    function AuthService($q, $timeout, $http, $log) {

      // create user variable
      var user = null;

      function isLoggedIn() {
        if(user) {
          return true;
        } else {
          return false;
        }
      }

      function getUserStatus() {
        return user;
      }

      function login(username, password) {
        $log.debug('AuthService: attempting login....');

        // create a new instance of deferred
        var deferred = $q.defer();

        //MyHttp
        //  .path('/user/login')
        //  .path('username/' + username)
        //  .path('password/' + password)
        //  .post()
        //  .catch(function () {
        //    myPromise = null
        //});

        // send a post request to the server
        $http.post('/login', {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.success){
            $log.debug('AuthService: user authenticated: data: ', data);
            user = true;
            deferred.resolve();
          } else {
            $log.debug('AuthService: user NOT authenticated, data: ', data, ', status: ', status);
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          $log.error('Login error: ', data);
          user = false;
          deferred.reject();
        });

        // return promise object
        return deferred.promise;
      }

      function register(username, password) {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/user/register', {username: username, password: password})
          // handle success
          .success(function (data, status) {
            if(status === 200 && data.status){
              deferred.resolve();
            } else {
              deferred.reject();
            }
          })
          // handle error
          .error(function (data) {
            $log.log('error', 'Registration error: ', data);
            deferred.reject();
          });

        // return promise object
        return deferred.promise;
      }

      function logout() {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a get request to the server
        $http.get('/logout')
          // handle success
          .success(function (data) {
            $log.info('Successfully logged out');
            user = false;
            deferred.resolve();
          })
          // handle error
          .error(function (data) {
            $log.error('Logout error: ', data);
            user = false;
            deferred.reject();
          });

        // return promise object
        return deferred.promise;
      }

      // return available functions for use in controllers
      return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        login: login,
        logout: logout,
        register: register
      });
    }
})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

  .module("myPick10")

  .service('ergastCalls', ergastCalls);

7
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

(function() {
  'use strict';

  angular

    .module('myPick10')

    .controller('LoginController', LoginController);

    //inject dependencies
    LoginController.$inject = ['$scope', '$location', '$log', 'AuthService', 'appTitle'];

    function LoginController($scope, $location, $log, AuthService, appTitle) {
      var vm = this;
      vm.title = appTitle;
      vm.loginForm = {username: 'user1', password: 'abc123'};

      $log.log('debug', 'GetUserStatus: ', AuthService.getUserStatus());


      vm.login = function () {
        $log.debug('Attempting Login: ', vm.loginForm);

        // initial values
        vm.error = false;
        vm.disabled = true;

        // call login from service
        AuthService.login(vm.loginForm.username, vm.loginForm.password)
          // handle success
          .then(function () {
            $location.path('/');
            vm.disabled = false;
            vm.loginForm = {};
          })
          // handle error
          .catch(function () {
            vm.error = true;
            vm.errorMessage = "Invalid username and/or password";
            vm.disabled = false;
            vm.loginForm = {};
          });
      };
    }
})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module('myPick10')

    .controller('LogoutController', LogoutController);

  //inject dependencies
  LogoutController.$inject = ['$scope', '$location', '$log', 'AuthService', 'appTitle'];

  function LogoutController($scope, $location, $log, AuthService, appTitle) {
    var vm = this;
    vm.title = appTitle;

    vm.logout = function() {
      $log.debug('Logging out user -  current status: ', AuthService.getUserStatus());

      AuthService.logout()
      .then( function() {
        $location.path('/login');
      })
    }
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
$templateCache.put("welcome/login.ng.template.html","<div class=\"col-md-6 col-md-offset-3\">\n  <h1>Welcome - {{ vm.title }}</h1>\n  <h2>Login</h2>\n  <form name=\"form\" ng-submit=\"vm.login()\" role=\"form\">\n    <div class=\"form-group\" ng-class=\"{ \'has-error\': form.username.$dirty && form.username.$error.required }\">\n      <label for=\"username\">Username</label>\n      <input type=\"text\" name=\"username\" id=\"username\" class=\"form-control\" ng-model=\"vm.loginForm.username\" required />\n      <span ng-show=\"form.username.$dirty && form.username.$error.required\" class=\"help-block\">Username is required</span>\n    </div>\n    <div class=\"form-group\" ng-class=\"{ \'has-error\': form.password.$dirty && form.password.$error.required }\">\n      <label for=\"password\">Password</label>\n      <input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" ng-model=\"vm.loginForm.password\" required />\n      <span ng-show=\"form.password.$dirty && form.password.$error.required\" class=\"help-block\">Password is required</span>\n    </div>\n    <div class=\"form-actions\">\n      <button type=\"submit\" ng-disabled=\"form.$invalid || ctrl.dataLoading\" class=\"btn btn-primary\">Login</button>\n      <img ng-if=\"ctrl.dataLoading\" src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />\n      <a href=\"#/register\" class=\"btn btn-link\">Register</a>\n    </div>\n  </form>\n</div>\n");
$templateCache.put("welcome/register.ng.template.html","<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title></title>\n</head>\n<body>\n\n</body>\n</html>\n");
$templateCache.put("welcome/welcome.ng.template.html","<script src=\"../services/auth.ng.service.js\"></script>\n\n<div class=\"col-md-6 col-md-offset-3\">\n  <h1>Welcome - {{ vm.title }}</h1>\n\n  <div ng-controller=\"LogoutController as vm\">\n    <a ng-click=\'vm.logout()\' class=\"btn btn-default\">Logout</a>\n  </div>\n\n  <!--<h2>Login</h2>-->\n  <!--<form name=\"form\" ng-submit=\"vm.login()\" role=\"form\">-->\n    <!--<div class=\"form-group\" ng-class=\"{ \'has-error\': form.username.$dirty && form.username.$error.required }\">-->\n      <!--<label for=\"username\">Username</label>-->\n      <!--<input type=\"text\" name=\"username\" id=\"username\" class=\"form-control\" ng-model=\"vm.username\" required />-->\n      <!--<span ng-show=\"form.username.$dirty && form.username.$error.required\" class=\"help-block\">Username is required</span>-->\n    <!--</div>-->\n    <!--<div class=\"form-group\" ng-class=\"{ \'has-error\': form.password.$dirty && form.password.$error.required }\">-->\n      <!--<label for=\"password\">Password</label>-->\n      <!--<input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" ng-model=\"vm.password\" required />-->\n      <!--<span ng-show=\"form.password.$dirty && form.password.$error.required\" class=\"help-block\">Password is required</span>-->\n    <!--</div>-->\n    <!--<div class=\"form-actions\">-->\n      <!--<button type=\"submit\" ng-disabled=\"form.$invalid || vm.dataLoading\" class=\"btn btn-primary\">Login</button>-->\n      <!--<img ng-if=\"vm.dataLoading\" src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />-->\n      <!--<a href=\"#/register\" class=\"btn btn-link\">Register</a>-->\n    <!--</div>-->\n  <!--</form>-->\n</div>\n");
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
