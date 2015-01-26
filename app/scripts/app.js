'use strict';

/**
 * @ngdoc overview
 * @name stpApp
 * @description
 * # stpApp
 *
 * Main module of the application.
 */
angular
  .module('stpApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'btford.markdown'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/splash.html'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/description', {
        template: '<div class="container"><btf-markdown ng-include="\'views/description.md\'"></btf-markdown></div>'
      })
      .when('/protocols', {
        template: '<div class="container"><btf-markdown ng-include="\'views/protocol.md\'"></btf-markdown></div>'
      })
      .when('/schedule', {
        template: '<div class="container"><btf-markdown ng-include="\'views/schedule.md\'"></btf-markdown></div>'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
