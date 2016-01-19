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

    //vm.login = login;

    //(function initController() {
    //  // reset login status
    //  AuthenticationService.ClearCredentials();
    //})();
    //
    //function login() {
    //  vm.dataLoading = true;
    //  AuthenticationService.Login(vm.username, vm.password, function (response) {
    //    if (response.success) {
    //      AuthenticationService.SetCredentials(vm.username, vm.password);
    //      $location.path('/');
    //    } else {
    //      FlashService.Error(response.message);
    //      vm.dataLoading = false;
    //    }
    //  });
    //}
  }

})();
