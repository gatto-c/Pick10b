'use strict';

(function() {
  angular

    .module('myPick10')

    .factory("MyHttp", MyHttp);

  MyHttp.$inject = ['$log','$http', '_'];

  function MyHttp($log, $http, _) {

    var HttpRequest = function(arg) {
      $log.debug(_);

      var isArgDefined = !_.isUndefined(arg);

      if(isArgDefined && _.isString(arg)) {
        angular.extend(this, {chunks: [arg], isHttpRequest: true });
      }
      else if(isArgDefined && _.isObject(arg) && arg.isHttpRequest ) {
        angular.extend(this, {chunks: _.cloneDeep(arg.chunks), isHttpRequest: true });
      }
      else {
        angular.extend(this, {chunks: [], isHttpRequest: true });
      }
    };

    HttpRequest.path = function(chunk) {
      return new HttpRequest(chunk)
    };

    HttpRequest.prototype.path = function(chunk) {
      this.chunks.push(chunk);
      return this ;
    };

    HttpRequest.prototype.getUrl = function() {
      return this.chunks.join('/')
    };

    HttpRequest.prototype.put = function(objectToPut) {
      var url = this.getUrl();
      return $http.put(url, objectToPut).
        then(function(response){
          return response.data
        }) ;
    };

    HttpRequest.prototype.post = function(objectToPost) {
      var url = this.getUrl();
      $log.info('Posting: ', url, ', object: ', objectToPost);
      return $http.post(url, objectToPost).
        then(function(response){
          return response.data
        }) ;
    };

    HttpRequest.prototype.get = function() {
      var url = this.getUrl();

      $log.info('Getting: ' + url);

      return $http.get(url).
        then(function(response){
          $log.debug('response: ', response.data);
          return response.data
        }) ;
    };

    return HttpRequest;
  }
})();
