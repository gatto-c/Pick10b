(function() {
  'use strict';

  angular

    .module("myPick10")

    .controller('appFooterController', appFooterController);

  appFooterController.$inject = [];

  function appFooterController() {
    var vm = this;
    vm.placeholderText = "...";
  }
})();
