(function() {
  'use strict';

  angular

    .module("myPick10")

    .controller('appHeaderController', appHeaderController);

  appHeaderController.$inject = ['$log', 'appTitle', 'AuthService'];

    function appHeaderController($log, appTitle, AuthService) {
      var vm = this;
      vm.appTitle = appTitle;
      vm.loggedIn = AuthService.isLoggedIn();
      vm.player = AuthService.currentUser();
    }
})();
