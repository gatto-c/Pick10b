angular

.module("myPick10")

.controller('raceResultsController',

['$scope', 'SampleProxy', '$log','MyHttp', 'ErgastCalls',

function($scope, samples, $log, MyHttp, ErgastCalls){

    $scope.year = 2015;
    $scope.race = 16;

    getRaceResults();

    function getRaceResults() {
        ErgastCalls.getRaceSchedule($scope.year).then(function(results) {
          $log.debug('race schedule results for ', $scope.year, ': ', results);
        });

        //ergastCalls.getRaceResults(vm.year, vm.race).then(function(results) {
        //  $log.debug('race results for ', vm.year, '/', vm.race, ': ', results);
        //});

    }
}]);