/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../typings/angularjs/angular-resource.d.ts" />


module App {
  export module Ctrl {
    export class Hello {
      static $inject = ['$scope', '$routeParams', '$resource'];
      constructor(
          private $scope: ng.IScope,
          private $routeParams: ng.route.IRouteParamsService,
          private $resource: ng.resource.IResourceService) {
          let name = $routeParams['name'];
          $scope['name'] = name ? name : 'world (default)';
          $scope['visible'] = false;
          $scope['click_hello'] = (visible: boolean)=>{
            $scope['visible'] = !visible;
            $resource("/asset/data.json").get().$get().then((response: any) => {
              $scope['response'] = response;
            });
          };
      }
    }
  }
}