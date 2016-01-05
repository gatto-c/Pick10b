(function() {
  'use strict';

  angular

    .module('myPick10')

    .controller('RegisterController', RegisterController);

  //inject dependencies
  RegisterController.$inject = ['$scope', '$location', '$log', 'AuthService', 'appTitle'];

  function RegisterController($scope, $location, AuthService) {
    var vm = this;
    vm.title = appTitle;

    $log.debug('Registration - current user status: ', AuthService.getUserStatus());

    vm.register = function () {
      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });
    };
  }
})();
