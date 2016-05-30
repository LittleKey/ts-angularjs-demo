/// <reference path="../../typings/angularjs/angular.d.ts" />

module App {
  export module Utils {
    export class Utils {
      static $inject = ['$filter']
      constructor(private $filter: ng.IFilterService) {

      }
      
      formatDate(millis: number): string {
        return this.$filter('date')(millis, "yyyy:MM:dd");
      }
      
      formatTime(millis: number): string {
        return this.$filter('date')(millis, "HH:mm:ss");
      }
    }
  }
}