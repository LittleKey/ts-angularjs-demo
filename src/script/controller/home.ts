/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../typings/angularjs/angular-resource.d.ts" />
/// <reference path="../utils.ts" />


module App {
  export module Ctrl {
    export class Home {
      static $inject = ['$scope', '$routeParams', '$resource', '$location', 'utils'];
      constructor(
          private $scope: ng.IScope,
          private $routeParams: ng.route.IRouteParamsService,
          private $resource: ng.resource.IResourceService,
          private $location: ng.ILocationService,
          private utils: App.Utils.Utils) {
          let roomId = $routeParams['roomId'];
          $scope['room_name'] = roomId ? roomId : '0';
          $scope['visible'] = false;
          $scope['messages'] = [];
          $scope['quantity'] = -10;
          $scope['click_hello'] = (visible: boolean)=> {
            this.clickHello(visible);
          };
          $scope['arrayFilter'] = (item: any)=> {
            return item.age >= 18;
          };
          $scope['enter'] = (room_name: string)=> {
            this.$scope['socket'] = this.connectWebSocket(`ws://${$location.host()}/chat/${$scope['room_name']}`);
          };
      }
      
      private connectWebSocket(url: string): WebSocket {
          let socket = new WebSocket(url); 
          socket.onopen = (ev: Event)=> {
            this.onOpen(ev);
          };
          socket.onmessage = (ev: MessageEvent)=> {
            this.onMessage(ev);
          };
          socket.onerror = (ev: Event)=> {
            this.onError(ev);
          };
          socket.onclose = (ev: CloseEvent)=> {
            this.onClose(ev);
          }
          this.$scope['send'] = (message: string)=> {
            this.$scope['messages'].push(message);
            socket.send(message);
            this.$scope['message'] = "";
          };
          return socket;
      }
      
      private onOpen(ev: Event) {
        console.log("onOpen");
        this.$scope.$apply();
      }
      
      private onMessage(ev: MessageEvent) {
        console.log("onMessage: " + ev.data);
        this.$scope['messages'].push(ev.data);
        this.$scope.$apply();
      }
      
      private onError(ev: Event) {
        console.log("onError");
        this.$scope.$apply();
      }
      
      private onClose(ev: CloseEvent) {
        console.log("onClose");
        this.$scope['messages'].push("close.");
        this.$scope.$apply();
      }
      
      private clickHello(visible: boolean) {
        this.$scope['visible'] = !visible;
        this.$scope['array_response'] = [];
        this.$scope['object_response'] = {};
        if (this.$scope['visible']) {
          this.$resource("/asset/array_data.json").query().$promise.then((response: any)=> {
            this.$scope['array_response'] = response;
          });
          this.$resource("/asset/object_data.json").get().$get().then((response)=> {
            var resp = {};
            resp['obj_title'] = response['title'];
            resp['format_time'] = this.utils.formatTime(response['time']);
            resp['date'] = response['time'];
            this.$scope['object_response'] = resp;
          });
        }
      }
    }
  }
}