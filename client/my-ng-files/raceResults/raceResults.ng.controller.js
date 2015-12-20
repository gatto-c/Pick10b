angular

.module("myPick10")

.controller('raceResultsController',

['$scope', 'SampleProxy', '$log','MyHttp', 'ErgastCalls',

function($scope, samples, $log, MyHttp, ErgastCalls){

    $log.debug('>>>>>Here2!!!!');

    getRaceResults();

    function getRaceResults() {
        $log.debug('>>>>>Here3!!!!');


        var year = 2015,
            race = 16;

        ErgastCalls.getRaceSchedule(year).then(function(results) {
          $log.debug('race schedule results for ', year, ': ', results);
        });

        //ergastCalls.getRaceResults(vm.year, vm.race).then(function(results) {
        //  $log.debug('race results for ', vm.year, '/', vm.race, ': ', results);
        //});

    }
}]);