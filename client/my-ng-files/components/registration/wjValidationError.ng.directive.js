angular

  .module("myPick10")

  .directive('wjValidationError', function() {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctl) {
        scope.$watch(attrs['wjValidationError'], function (errorMsg) {
          console.log('>>>>>>>>>HERE!!!');
          elm[0].setCustomValidity(errorMsg);
          ctl.$setValidity('wjValidationError', errorMsg ? false : true);
        });
      }
    };
  });
