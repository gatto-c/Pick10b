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

