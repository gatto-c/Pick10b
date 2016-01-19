/* global moment:false */
(function() {
  angular
  .module("myPick10")
  .constant("ergastAPIAddress", "http://ergast.com/api/f1")
  .constant("_", window._)
  .constant("moment", moment)
  .constant("appTitle", "F1 QuickPick");
})();

