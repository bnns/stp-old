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

    $window.loading_screen = window.pleaseWait({
      logo: 'stp_logo_small.png',
      backgroundColor: '#023c72',
      loadingHtml: '<div style="margin: 0 auto; float: none; width: 40%; color: #fff;">' +
      'Each of the parts of philosophy is a philosophical whole, a circle rounded and complete in itself. In each of these parts, however, the philosophical Idea is found in a particular specificality or medium. The single circle, because it is a real totality, bursts through the limits imposed by its special medium, and gives rise to a wider circle. The whole of philosophy in this way resembles a circle of circles. The Idea appears in each single circle, but, at the same time, the whole Idea is constituted by the system of these peculiar phases, and each is a necessary member of the organisation. - Hegel, Encyclopaedia of the Philosophical Sciences (1830)</div>'
    });

/*    $window.loading_screen = window.pleaseWait({
      logo: 'stp_logo_small.png',
      backgroundColor: '#023c72',
      loadingHtml: '<div style="margin: 0 auto; float: none; width: 40%; color: #fff;">' +
      '<btf-markdown ng-include="\'views/hegelsl.md\'"></btf-markdown></div>'
    });*/

  	tabletopService.query(function(data){
        $timeout(function(){
            $window.loading_screen.finish();
        }, 8000);
  		$scope.timelineData = data;
  		$scope.timelineKeys = _.keys(data);
  		//console.log(data);
  	});
  }]);
