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
          $scope['visible'] = false;
          $scope['click_hello'] = (visible: boolean)=>{
            $scope['visible'] = !visible;
            $scope['response_status'] = "";
            $http.get("/index.html").then(function (response: any) {
              $scope['response_status'] = response.status;
            });
          };
      }
    }
  }
}