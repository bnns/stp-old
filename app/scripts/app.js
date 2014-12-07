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
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/description', {
        template: '<btf-markdown ng-include="\'views/description.md\'"></btf-markdown>'
      })
      .when('/protocols', {
        template: '<btf-markdown ng-include="\'views/protocol.md\'"></btf-markdown>'
      })
      .when('/schedule', {
        template: '<btf-markdown ng-include="\'views/schedule.md\'"></btf-markdown>'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
