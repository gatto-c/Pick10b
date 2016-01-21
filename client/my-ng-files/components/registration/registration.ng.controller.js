(function() {
  'use strict';

  angular

    .module('myPick10')

    .controller('RegistrationController', RegistrationController);

  //inject dependencies
  RegistrationController.$inject = ['$scope', '$location', '$log', 'AuthService', 'appTitle'];

  function RegistrationController($scope, $location, $log, AuthService, appTitle) {
    var vm = this;
    vm.title = appTitle;
    vm.registerForm = {};
  }
})();
