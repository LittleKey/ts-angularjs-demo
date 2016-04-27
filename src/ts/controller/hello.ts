/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angularjs/angular-route.d.ts" />

module App {
  export module Ctrl {
    export class Hello {
      static $inject = ['$scope', '$routeParams'];
      constructor(
          private $scope: ng.IScope,
          private $routeParams: ng.route.IRouteParamsService
      ) {
          let name = $routeParams['name'];
          $scope['name'] = name ? name : 'world (default)';
      }
    }
  }
}