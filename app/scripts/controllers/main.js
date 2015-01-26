'use strict';

/**
 * @ngdoc function
 * @name stpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the stpApp
 */
angular.module('stpApp')
  .controller('SplashCtrl', ['$scope', function($scope){
    $scope.showNav = false;
  }])
  .controller('MainCtrl', ['$scope', '$window', '$timeout', 'tabletopService',
    function ($scope, $window, $timeout, tabletopService) {
  	$scope.test = 'test';
    $scope.$parent.showNav = true;

    /*$window.loading_screen = window.pleaseWait({
      logo: 'stp_logo_small.png',
      backgroundColor: '#023c72',
      loadingHtml: ''
    });*/

  	tabletopService.query(function(data){
      //$window.loading_screen.finish();
  		$scope.timelineData = data;
  		$scope.timelineKeys = _.keys(data);
  		console.log(data);
  	});
  }]);
