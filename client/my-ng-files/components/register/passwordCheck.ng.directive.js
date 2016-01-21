angular

  .module("myPick10")

  .directive('compareTo', function($log) {

    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
          $log.debug('>>>>>compareTo: modelValue:', modelValue, ', scope.otherModelValue:', scope.otherModelValue);
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
          $log.debug('>>>>>compareTo(2)....');
          ngModel.$validate();
        });
      }
    };

  });
