'use strict';

/**
 * @ngdoc directive
 * @name stpApp.directive:timeline
 * @description
 * # timeline
 */
angular.module('stpApp')
  .directive('timeline', ['$compile', 'd3Service', function ($compile, d3Service) {
    return {
	  template: '<div class=\'stp-timeline\'></div>',
      restrict: 'EA',
      scope: {
      	name: '=stpName',
      	points: '=points'
      },
      link: function (scope, element) {

      	var template = '<div id="' + scope.name + '"></div>';

		element.html(template).show();

        $compile(element.contents())(scope);

	    d3Service.d3().then(function(d3){
	    	var data = [1,9,4,2,6,2,5,0,5,9,7,2].map(function(d,i) {
	    		console.log([i,d]);
		    	return [i, d];
			});

			var w = 300,
			h = 100;

			var x = d3.scale.linear()
				.domain([0, data.length-1])
				.range([0, w]);

			var y = d3.scale.linear()
				.domain([0, 10])
				.range([h, 0]);

			var line = d3.svg.line()
				.x(function(d) { return x(d[0]); })
				.y(function(d) { return y(d[1]); });

			var svg = d3.select('.stp-timeline').append('svg')
				.attr('w', w)
				.attr('h', h);

			// add element and transition in
			var path = svg.append('path')
			    .attr('class', 'line')
			    .attr('d', line(data[0]))
				.transition()
			    .duration(1000)
			    .attrTween('d', pathTween);

		    function pathTween() {
		        var interpolate = d3.scale.quantile()
		                .domain([0,1])
		                .range(d3.range(1, data.length + 1));

		        return function(t) {
		            return line(data.slice(0, interpolate(t)));
		        };
		    }
        });
      }
    };
  }]);
