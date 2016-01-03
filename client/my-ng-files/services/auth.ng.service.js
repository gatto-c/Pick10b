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
          .success(function() {
            $log.info('Successfully logged out');
            user = false;
            deferred.resolve();
          })
          // handle error
          .error(function(data) {
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
