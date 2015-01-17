'use strict';

/**
 * @ngdoc function
 * @name stpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the stpApp
 */
angular.module('stpApp')
  .controller('MainCtrl', ['$scope', '$window', '$timeout', 'tabletopService',
    function ($scope, $window, $timeout, tabletopService) {
  	$scope.test = 'test';

  	tabletopService.query(function(data){
        $timeout(function(){
            $window.loading_screen.finish();
        }, 10000);
  		$scope.timelineData = data;
  		$scope.timelineKeys = _.keys(data);
  		//console.log(data);
  	});
  }]);
