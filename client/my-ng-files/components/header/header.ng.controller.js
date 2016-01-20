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
