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
      controllerAs: 'vm',
      access: {restricted: true}
  })
  .when('/login', {
    templateUrl: '/client/my-ng-files/welcome/login.ng.template.html',
    controller: 'LoginController',
    controllerAs: 'vm',
    access: {restricted: false}
  })
  .when('/logout', {
      controller: 'LogoutController',
      controllerAs: 'vm',
      access: {restricted: true}
  })
  .when('/register', {
      templateUrl: '/client/my-ng-files/welcome/register.ng.template.html',
      controller: 'registerController',
      controllerAs: 'vm',
      access: {restricted: true}
  })
  .otherwise({
    redirectTo: '/login'
  });
}]);
/* eslint-enable */
