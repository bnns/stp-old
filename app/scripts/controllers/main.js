'use strict';

/**
 * @ngdoc function
 * @name stpApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the stpApp
 */
angular.module('stpApp')
  .controller('MainCtrl', ['$scope', 'tabletopService', function ($scope, tabletopService) {
  	$scope.test = 'test';

  	tabletopService.query(function(data){
  		$scope.timelineData = data;
  		$scope.timelineKeys = _.keys(data);
  		//console.log(data);
  	});
  }]);
