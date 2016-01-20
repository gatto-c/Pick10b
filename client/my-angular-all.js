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

      // listen for route changes and determine if authorization needs to be provided
      /*eslint-disable no-unused-vars*/
      var onRouteChangeStartBroadcast = $rootScope.$on('$routeChangeStart', function (event, next, current) {
        $log.debug('User logged in: ', AuthService.isLoggedIn());

        if (next.access.restricted && AuthService.isLoggedIn() === false) {
          $log.debug('Auth route check - access not granted: ', {'restricted': next.access.restricted, 'user logged in': AuthService.isLoggedIn()});
          $location.path('/login');
          $route.reload();
        } else {
          $log.debug('Auth route check - access granted: ', {'restricted': next.access.restricted, 'user logged in': AuthService.isLoggedIn()});
        }
      });
      /*eslint-enable no-unused-vars*/

      //remove the broadcast subscription when scope is destroyed
      $rootScope.$on('$destroy', function() {
        $log.debug('onRouteChangeStartBroadcast destroyed');
        onRouteChangeStartBroadcast();
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
  .constant("appTitle", "F1 QuickPick")
  .constant("lsTokenName", "f1-quickpick-token") ;
})();
}());

;(function() {
"use strict";

/* eslint-disable */
angular

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
  .when('/login/:username?', {
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
      controller: 'RegisterController',
      controllerAs: 'vm',
      access: {restricted: false}
  })
  .when('/registrationConfirmation/:username', {
      templateUrl: '/client/my-ng-files/welcome/registrationConfirmation.ng.template.html',
      controller: 'RegistrationConfirmationController',
      controllerAs: 'vm',
      access: {restricted: false}
    })
  .when('/one', {
      template: '<h1>This is page one!</h1>',
      access: {restricted: true}
   })
  .when('/two', {
      template: '<h1>This is page two!</h1>',
      access: {restricted: true}
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

    /**
     * perform http post operation
     * @param objectToPost
     * @param dataOnly - will return only the data object of the response object if true
     * @returns {*|{get}}
     */
    HttpRequest.prototype.post = function(objectToPost, dataOnly) {
      dataOnly = dataOnly !== false; //defaults to true

      var url = this.getUrl();
      $log.debug('Post response0');

      return $http.post(url, objectToPost).
        then(function(response){
          if(dataOnly) {
            return response.data;
          } else {
            return response;
          }
        }, function(response) {
          $log.debug('Post response error condition: ', response);
          return response;
        });

    };

    /**
     * perform http get operation
     * @param dataOnly - will return only the data object of the response object if true
     * @returns {*|{get}}
     */
    HttpRequest.prototype.get = function(dataOnly) {
      dataOnly = dataOnly !== false; //defaults to true

      var url = this.getUrl();
      return $http.get(url).
        then(function(response){
          if(dataOnly) {
            return response.data;
          } else {
            return response;
          }
        }) ;
    };

    return HttpRequest;
  }
})();
}());

;(function() {
"use strict";

//http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.VocdH3UrJ7g
//https://thinkster.io/mean-stack-tutorial#adding-authentication-via-passport


(function() {
  'use strict';

  angular

    .module('myPick10')

    .service('AuthService', AuthService);

    // inject dependencies
    AuthService.$inject = ['$q', '$log', '$window', 'MyHttp', 'lsTokenName'];


    /**
     * Standard authorization/registration functionality
     * @param $q - support promises
     * @param $log - used for console logging
     * @param MyHttp - proxy to rest calls
     * @param lsTokenName - the name of the token to use from local storage
     * @returns {{isLoggedIn: isLoggedIn, currentUser: currentUser, saveToken: saveToken, getToken: getToken, login: login, logout: logout, register: register}}
     * @constructor
     */
    function AuthService($q, $log, $window, MyHttp, lsTokenName) {
      $log.debug('AuthService Initializing...');

      function isLoggedIn() {
        var token = getToken();

        $log.debug('isLoggedIn called, token is:', token);

        if(token){
          //var payload = JSON.parse($window.atob(token.split('.')[1]));
          var payload = angular.fromJson($window.atob(token.split('.')[1]));
          return payload.exp > Date.now() / 1000;
        } else {
          return false;
        }
      }

      function currentUser() {
        if(isLoggedIn()){
          var token = getToken();
          //var payload = JSON.parse($window.atob(token.split('.')[1]));
          var payload = angular.fromJson($window.atob(token.split('.')[1]));
          return payload.username;
        }
      }

      function saveToken(token) {
        $window.localStorage[lsTokenName] = token;
      }

      function getToken() {
        return $window.localStorage[lsTokenName];
      }

      /**
       * login user by passing username/password to rest proxy and ultimately rest api
       * @param username
       * @param password
       * @returns {*}
       */
      function login(username, password) {
        $log.debug('AuthService: attempting login....');

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        var myPromise = MyHttp
          .path('/login')
          .post({username: username, password: password})
          .catch(function (err) {
            $log.error(err.message);
            myPromise = null
          }
        );

        myPromise.then(function(data) {
          if(data && data.success) {
            $log.debug('AuthService: user authenticated: data: ', data);
            saveToken(data.token);
            deferred.resolve();
          } else {
            $log.debug('AuthService: user NOT authenticated, data: ', data);
            deferred.reject();
          }
        });

        // return promise object
        return deferred.promise;
      }

      /**
       * register a new user
       * @param username
       * @param password
       * @returns {*}
       */
      function register(username, password) {
        $log.debug('AuthService: register....');

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        var myPromise = MyHttp
          .path('/register')
          .post({username: username, password: password}, false)
          .catch(function (err) {
            $log.error(err);
            myPromise = null
          }
        );

        myPromise.then(function(response) {
          $log.debug('registration response: ', response);

          if(response && response.status == 200) {
            $log.debug('AuthService: user registered: response: ', response);
            $log.debug('AuthService: response.status: ', response.status);
            $log.debug('AuthService: response.data: ', response.data);
            $log.debug('AuthService: response.data.token: ', response.data.token);
            saveToken(response.data.token);
            deferred.resolve();
          } else {
            $log.debug('AuthService: user NOT registered(1), response: ', response);
            deferred.reject(response);
          }
        });

        // return promise object
        return deferred.promise;
      }


      /**
       * logout the currently logged in user
       * @returns {*}
       */
      function logout() {
        // create a new instance of deferred
        var deferred = $q.defer();

        var myPromise = MyHttp
          .path('/logout')
          .get(false)
          .catch(function () {
            myPromise = null
          }
        );

        myPromise.then(function(data) {
          $log.debug('AuthService: data: ', data.status);
          if(data && data.status == 200) {
            $log.debug('Successfully logged out');
            $window.localStorage.removeItem(lsTokenName);
            deferred.resolve();
          } else {
            $log.error('Logout error: ', data);
            deferred.reject();
          }
        });

        // return promise object
        return deferred.promise;
      }

      // return available functions for use in controllers
      return ({
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        saveToken: saveToken,
        getToken: getToken,
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
    LoginController.$inject = ['$scope', '$location', '$routeParams', '$log', 'AuthService', 'appTitle'];

    function LoginController($scope, $location, $routeParams, $log, AuthService, appTitle) {
      var vm = this;
      vm.title = appTitle;

      if ($routeParams.username) {
        vm.loginForm = {username: $routeParams.username};
      } else {
        vm.loginForm = {};
      }
      //vm.loginForm = {username: 'user1', password: 'abc123'};

      $log.debug('Login Controller: getUserStatus: ', AuthService.currentUser());


      vm.login = function () {
        $log.debug('Attempting Login: ', vm.loginForm);

        // initial values
        vm.error = false;
        vm.disabled = true;

        // call login from service
        AuthService.login(vm.loginForm.username, vm.loginForm.password)
          // handle success
          .then(function () {
            $log.debug('loginCtrl: user logged in');
            $location.path('/');
            vm.disabled = false;
            vm.loginForm = {};
          })
          // handle error
          .catch(function () {
            $log.debug('loginCtrl: login error: Invalid username and/or password');
            vm.error = true;
            vm.errorMessage = "Invalid username and/or password";
            vm.disabled = false;
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
      $log.debug('Logging out user -  current status: ', AuthService.currentUser());

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

(function() {
  'use strict';

  angular

    .module('myPick10')

    .controller('RegisterController', RegisterController);

  //inject dependencies
  RegisterController.$inject = ['$scope', '$location', '$log', 'AuthService', 'appTitle'];

  function RegisterController($scope, $location, $log, AuthService, appTitle) {
    var vm = this;
    vm.title = appTitle;

    vm.registerForm = {};
    //vm.registerForm.username = 'user1';
    //vm.registerForm.password = 'abc123';

    $log.debug('Registration - current user status: ', AuthService.currentUser());

    vm.register = function () {
      $log.debug('Registering new player: vm: ', vm.registerForm.username);

      // initial values
      vm.error = false;
      vm.disabled = true;

      // call register from service
      AuthService.register(vm.registerForm.username, vm.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/registrationConfirmation/' + vm.registerForm.username); //$location.path('/login');
          vm.disabled = false;
          vm.registerForm = {};
        })
        // handle error
        .catch(function (err) {
          $log.debug('err: ', err);
          vm.error = true;
          vm.errorMessage = (err.status == 409) ? "Username " + vm.registerForm.username + " already exists. Please use another." : "We're sorry, we are unable to register you at this time. Please try again later.";
          vm.disabled = false;
          vm.registerForm = {};
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

    .controller('RegistrationConfirmationController', RegistrationConfirmationController);

  //inject dependencies
  RegistrationConfirmationController.$inject = ['$scope', '$routeParams'];

  function RegistrationConfirmationController($scope, $routeParams) {
    var vm = this;
    vm.username = $routeParams.username;
  }
})();
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

(function() {
  'use strict';

  angular

    .module("myPick10")

    .controller('myHeaderController', myHeaderController);

    myHeaderController.$inject = ['$log', 'appTitle', 'AuthService'];

    function myHeaderController($log, appTitle, AuthService) {
      var vm = this;
      vm.appTitle = appTitle;
      vm.loggedIn = AuthService.isLoggedIn();
      vm.player = AuthService.currentUser();

      $log.debug('HeaderController.vm.player: ', vm.player);
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
$templateCache.put("welcome/login.ng.template.html","<my-header></my-header>\n\n\n<div class=\"col-md-6 col-md-offset-3\">\n  <h1>Welcome - {{ vm.title }}</h1>\n  <h2>Login</h2>\n  <div ng-show=\"vm.error\" class=\"alert alert-danger\">{{vm.errorMessage}}</div>\n  <form name=\"form\" ng-submit=\"vm.login()\" role=\"form\">\n    <div class=\"form-group\" ng-class=\"{ \'has-error\': form.username.$dirty && form.username.$error.required }\">\n      <label for=\"username\">Username</label>\n      <input type=\"text\" name=\"username\" id=\"username\" class=\"form-control\" ng-model=\"vm.loginForm.username\" required />\n      <span ng-show=\"form.username.$dirty && form.username.$error.required\" class=\"help-block\">Username is required</span>\n    </div>\n    <div class=\"form-group\" ng-class=\"{ \'has-error\': form.password.$dirty && form.password.$error.required }\">\n      <label for=\"password\">Password</label>\n      <input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" ng-model=\"vm.loginForm.password\" required />\n      <span ng-show=\"form.password.$dirty && form.password.$error.required\" class=\"help-block\">Password is required</span>\n    </div>\n    <div class=\"form-actions\">\n      <button type=\"submit\" ng-disabled=\"form.$invalid || vm.disabled\" class=\"btn btn-primary\">Login</button>\n      <img ng-if=\"vm.dataLoading\" src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />\n      <a href=\"#/register\" class=\"btn btn-link\">Register</a>\n    </div>\n  </form>\n</div>\n\n<!--<div class=\"alert alert-success\">-->\n  <!--<strong>Success!</strong> Indicates a successful or positive action.-->\n<!--</div>-->\n");
$templateCache.put("welcome/register.ng.template.html","<my-header></my-header>\n\n<div class=\"col-md-6 col-md-offset-3\">\n  <h2>Register for {{vm.title}}</h2>\n    <div ng-show=\"vm.error\" class=\"alert alert-danger\">{{vm.errorMessage}}</div>\n    <form class=\"form\" ng-submit=\"vm.register()\">\n      <div class=\"form-group\">\n        <label>Username</label>\n        <input type=\"text\" class=\"form-control\" name=\"username\" ng-model=\"vm.registerForm.username\" required>\n      </div>\n      <div class=\"form-group\">\n        <label>Password</label>\n        <input type=\"password\" class=\"form-control\" name=\"password\" ng-model=\"vm.registerForm.password\" required>\n      </div>\n      <div>\n        <button type=\"submit\" class=\"btn btn-default\" ng-disabled=\"vm.disabled\">Register</button>\n      </div>\n    </form>\n</div>\n");
$templateCache.put("welcome/registrationConfirmation.ng.template.html","<my-header></my-header>\n\n<div class=\"col-md-6 col-md-offset-3\">\n  <h2>Welcome {{vm.username}}</h2>\n  <h2>Thanks for joining F1 QuickPick!</h2>\n  <h3><a ng-href=\"#/login/{{vm.username}}\">Login</a> to get started!</h3>\n</div>\n");
$templateCache.put("welcome/welcome.ng.template.html","<my-header></my-header>\n\n<div class=\"col-md-6 col-md-offset-3\">\n  <h1>Welcome - {{ vm.title }}</h1>\n\n  <div ng-controller=\"LogoutController as vm\">\n    <a ng-click=\'vm.logout()\' class=\"btn btn-default\">Logout</a>\n  </div>\n\n  <!--<h2>Login</h2>-->\n  <!--<form name=\"form\" ng-submit=\"vm.login()\" role=\"form\">-->\n    <!--<div class=\"form-group\" ng-class=\"{ \'has-error\': form.username.$dirty && form.username.$error.required }\">-->\n      <!--<label for=\"username\">Username</label>-->\n      <!--<input type=\"text\" name=\"username\" id=\"username\" class=\"form-control\" ng-model=\"vm.username\" required />-->\n      <!--<span ng-show=\"form.username.$dirty && form.username.$error.required\" class=\"help-block\">Username is required</span>-->\n    <!--</div>-->\n    <!--<div class=\"form-group\" ng-class=\"{ \'has-error\': form.password.$dirty && form.password.$error.required }\">-->\n      <!--<label for=\"password\">Password</label>-->\n      <!--<input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" ng-model=\"vm.password\" required />-->\n      <!--<span ng-show=\"form.password.$dirty && form.password.$error.required\" class=\"help-block\">Password is required</span>-->\n    <!--</div>-->\n    <!--<div class=\"form-actions\">-->\n      <!--<button type=\"submit\" ng-disabled=\"form.$invalid || vm.dataLoading\" class=\"btn btn-primary\">Login</button>-->\n      <!--<img ng-if=\"vm.dataLoading\" src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />-->\n      <!--<a href=\"#/register\" class=\"btn btn-link\">Register</a>-->\n    <!--</div>-->\n  <!--</form>-->\n</div>\n");
$templateCache.put("components/header/header.ng.template.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-xs-8 f1-title\">\n      {{vm.appTitle}}\n    </div>\n    <div class=\"col-xs-4 f1-title\" ng-if=\"vm.loggedIn\">\n      <div style=\"float: left\"><a href=\"/profile/{{ vm.player }}\">My Profile</a></div>\n      <div class=\"divider\"  style=\"float: right\"></div>\n      <div style=\"float: right\"><a href=\"/logout\">Logout</a></div>\n    </div>\n    <div class=\"col-xs-4 f1-title\" ng-if=\"!vm.loggedIn\">\n      User Is NOT Logged In\n    </div>\n  </div>\n</div>\n");
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

  .directive('myHeader', function() {
    return {
      restrict: 'E'
      , transclude: true
      , replace: true
      , scope: true
      , controller: 'myHeaderController'
      , controllerAs: 'vm'
      , templateUrl: 'components/header/header.ng.template.html'
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
