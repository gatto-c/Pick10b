angular.module("myPick10", [
  'ui.bootstrap'
  , 'ngCookies'
  , 'ui.grid'
  , 'ui.grid.grouping'
  , 'ui.grid.autoResize'
  , 'ui.grid.resizeColumns'
  , 'ngRoute'
]);

angular
  .module("myPick10")

  .run(['$rootScope', '$log', '$location', '$route', 'AuthService',
    function($rootScope, $log, $location, $route, AuthService) {
      $log.debug('Running pre-code');

      $rootScope.$on('$routeChangeStart', function (event, next, current) {
        $log.debug('User logged in: ', AuthService.isLoggedIn());

        if (next.access.restricted && AuthService.isLoggedIn() === false) {
          $log.debug('route-check - user NOT logged in: redirecting to login ui');
          $location.path('/login');
        } else {
          $log.debug('route-check - access granted: ', {'restricted': next.access.restricted, 'user logged in': AuthService.isLoggedIn()});
        }
      });
    }
  ]);

