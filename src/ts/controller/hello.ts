/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angularjs/angular-route.d.ts" />

module App {
  export module Ctrl {
    export class Hello {
      static $inject = ['$scope', '$routeParams', '$http'];
      constructor(
          private $scope: ng.IScope,
          private $routeParams: ng.route.IRouteParamsService,
          private $http: ng.IHttpService) {
          let name = $routeParams['name'];
          $scope['name'] = name ? name : 'world (default)';
          $http.get("/index.html").then(function (response: any) {
            $scope['name'] = response.status;
          });
      }
    }
  }
}