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

    $log.debug('Registration - current user status: ', AuthService.getUserStatus());

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
