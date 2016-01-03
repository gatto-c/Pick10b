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
