/* eslint-disable */
angular

  //http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.VocdH3UrJ7g

.module("myPick10")

.config(['$routeProvider',

function($routeProvider) {
  $routeProvider
  .when('/', {
      templateUrl: '/client/my-ng-files/welcome/welcome.ng.template.html',
      controller: 'WelcomeController',
      controllerAs: 'ctrl'
  })
  .when('/login', {
    templateUrl: '/client/my-ng-files/welcome/login.ng.template.html',
    controller: 'loginController',
    controllerAs: 'ctrl'
  })
  .when('/logout', {
      controller: 'logoutController'
  })
  .when('/register', {
      templateUrl: '/client/my-ng-files/welcome/register.ng.template.html',
      controller: 'registerController',
      controllerAs: 'ctrl'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);
/* eslint-enable */
