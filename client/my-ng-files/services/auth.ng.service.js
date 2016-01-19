//http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.VocdH3UrJ7g
//https://thinkster.io/mean-stack-tutorial#adding-authentication-via-passport


(function() {
  'use strict';

  angular

    .module('myPick10')

    .service('AuthService', AuthService);

    // inject dependencies
    AuthService.$inject = ['$q', '$log', 'MyHttp'];

    /**
     * Standard authorization/registration functionality
     * @param $q - support promises
     * @param $log - used for console logging
     * @param MyHttp - proxy to rest calls
     * @returns {{isLoggedIn: isLoggedIn, getUserStatus: getUserStatus, getUserData: getUserData, login: login, logout: logout, register: register}}
     * @constructor
     */
    function AuthService($q, $log, MyHttp) {
      $log.debug('AuthService Initializing...');

      // create user variable
      var user = null;
      var userName = null;

      /**
       * returns true if user evaluates to true - a user is logged in - otherwise it returns false
       * @returns {boolean}
       */
      function isLoggedIn() {
        if(user) {
          return true;
        } else {
          return false;
        }
      }

      /**
       * returns user object (thus status)
       * @returns {boolean}
       */
      function getUserStatus() {
        return user;
      }

      function getUserData() {
        return {username: userName};
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
            user = true;
            userName = username;
            deferred.resolve();
          } else {
            $log.debug('AuthService: user NOT authenticated, data: ', data);
            user = false;
            userName = null;
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
            user = true;
            deferred.resolve();
          } else {
            $log.debug('AuthService: user NOT registered(1), response: ', response);
            user = false;
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
            user = false;
            deferred.resolve();
          } else {
            $log.error('Logout error: ', data);
            user = true;
            deferred.reject();
          }
        });

        // return promise object
        return deferred.promise;
      }

      // return available functions for use in controllers
      return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        getUserData: getUserData,
        login: login,
        logout: logout,
        register: register
      });
    }
})();
