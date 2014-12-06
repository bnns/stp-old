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
        templateUrl: 'views/description.html'
      })
      .when('/protocols', {
        templateUrl: 'views/protocols.html'
      })
      .when('/schedule', {
        templateUrl: 'views/schedule.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
