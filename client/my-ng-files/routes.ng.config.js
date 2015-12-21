/* eslint-disable */
angular

.module("myPick10")

.config(['$routeProvider',

function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: '/client/my-ng-files/routes/sample.html'
  })
  .otherwise({
    redirectTo: '/home'
  });
}]);
/* eslint-enable */
