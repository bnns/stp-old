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
      	name: '=researchName',
      	points: '=researchPoints'
      },
      link: function (scope, element) {

      	var _id = scope.name.replace(/, /g, '').replace(' and ', '');
      	var template = '<div id="' + _id + '"></div>';
		element.html(template).show();
        $compile(element.contents())(scope);

        //console.log(scope.points);

		var width = element.parent().width();
		var center = width / 2,
			leftCenter = center - 25,
	    	rightCenter = center + 25;
		var latestTime = _.chain(scope.points)
			.pluck('date')
			.map(function(d){
				return new Date(d).getTime();
			})
			.max()
			.value();
		var startDate = moment('11/01/2014', 'MM/DD/YYYY');
		var lineStart = 50;
		var height = (scope.points.length > 0) ? moment(latestTime).diff(startDate, 'weeks') * 50 + lineStart : 0;
		var endPoints = [];

	    d3Service.d3().then(function(d3){

	    	var svg = d3.select('#' + _id)
	    		.append('svg')
	    		.attr('width', width)
	    		.attr('height', height + 50);

	    	var describePath = function(d){
	    		var pathDescription = 'M ' + center + ' 0,',
	    			prevDate = startDate,
	    			prevDiff = lineStart;

	    		_.map(d, function(entry){
	    			prevDiff = moment(entry.date, 'MM/DD/YYYY').diff(prevDate, 'weeks') * 50 + prevDiff;
	    			//console.log('previous difference', prevDiff);
	    			pathDescription += 'M ' + center + ' ' + prevDiff + ',';
	    			if (entry.filename.length){
	    				pathDescription += 'L ' + leftCenter + ' ' + prevDiff + ',';
	    				endPoints.push({
	    					x: leftCenter,
	    					y: prevDiff,
	    					text: entry.filename,
	    					link: entry.filelocation
	    				});
	    			}
	    			if (entry.update.length){
		    			pathDescription += 'M ' + center + ' ' + prevDiff + ',';
		    			pathDescription += 'L ' + rightCenter + ' ' + prevDiff + ',';
		    			endPoints.push({
		    				x: rightCenter,
		    				y: prevDiff,
		    				text: entry.update,
		    				link: null
		    			});
	    			}
	    			prevDate = moment(entry.date, 'MM/DD/YYYY');
	    		});

				if(d.length){
					endPoints.push({
						x: center,
						y: lineStart,
						text: 'Abstract',
						link: null
					},
					{
						x: center,
						y: height,
						text: 'Bibliography',
						link: null
					});
				}

				//console.log(pathDescription);
	    		return pathDescription;
	    	};

	    	var line = svg.append('line')
	    		.attr('x1', center)
				.attr('y1', lineStart)
				.attr('x2', center)
				.attr('y2', height)
				.attr('stroke-width', 2)
				.attr('stroke', '#fff');

	    	var path = svg.append('path')
	    		.attr('d', describePath(scope.points))
	    		.attr('stroke-width', 2)
	    		.attr('stroke', '#fff');

	    	var circle = svg.selectAll('circle')
	    		.data(endPoints)
	    		.enter()
		    	.append('circle')
	    		.attr('cx', function(d){ return d.x; })
			    .attr('cy', function(d){ return d.y; })
			    .attr('r', 10)
			    .attr('class', 'circle');

			var text = svg.data(endPoints)
	    		.enter()
	    		.text(function(d){ return '(' + d.x + ', ' + d.y + ')'; })
	    		.attr('x', function(d){ return d.x })
	    		.attr('y', function(d){ return d.y })
	    		.attr('class', 'nodeText');
        });
      }
    };
  }]);
