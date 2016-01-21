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
  }

})();
