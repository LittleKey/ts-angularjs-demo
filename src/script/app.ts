/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="controller/Home.ts" />



function routeConfig($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix("!");
    $routeProvider.when('/', {
        controller: App.Ctrl.Home,
        templateUrl: "home.html"
    })
    .when('/:roomId', {
        controller: App.Ctrl.Home,
        templateUrl: "home.html"
    })
    .otherwise({
        redirectTo: '/'
    });
};
routeConfig.$inject = ['$routeProvider', '$locationProvider'];

let app = angular.module("app", ['ngRoute', 'ngAnimate', 'ngResource']);
app.service("utils", App.Utils.Utils);
app.config(routeConfig);
