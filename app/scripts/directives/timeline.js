'use strict';

/**
 * @ngdoc directive
 * @name stpApp.directive:timeline
 * @description
 * # timeline
 */
angular.module('stpApp')
  .directive('timeline', ['$compile', 'd3Service', function ($compile, d3Service) {

    var wrap = function(text) {
      console.log(text);
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 12, // px
            y = text.attr('y'),
            x = text.attr('x'),
            dy = text.attr('text_y'),
            dx = text.attr('text_x'),
            tspan = text.text(null).append("tspan").attr('x', x).attr('y', y).attr('dx', dx).attr('dy', dy);
            console.log('x', x, 'y', y, 'dx', dx, 'dy', dy)
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > 20) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dx', dx)
            .attr('dy', lineNumber++ * lineHeight + 'px').text(word);
          }
        }
      });
    }

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
		var lineStart = (scope.points.length > 0) ? 50 : 0;
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
                            text_x: -75,
                            text_y: 5,
	    					text: entry.filename,
                            date: moment(entry.date).format('MM/DD/YYYY'),
	    					link: entry.filelocation
	    				});
	    			}
	    			if (entry.update.length){
		    			pathDescription += 'M ' + center + ' ' + prevDiff + ',';
		    			pathDescription += 'L ' + rightCenter + ' ' + prevDiff + ',';
		    			endPoints.push({
		    				x: rightCenter,
		    				y: prevDiff,
                            text_x: 20,
                            text_y: 5,
		    				text: entry.update,
                            date: moment(entry.date).format('MM/DD/YYYY'),
		    				link: null
		    			});
	    			}
	    			prevDate = moment(entry.date, 'MM/DD/YYYY');
	    		});

				if(d.length){
					endPoints.push({
						x: center,
						y: lineStart,
                        text_x: -20,
                        text_y: -20,
						text: 'Abstract',
						link: null
					},
					{
						x: center,
						y: height,
                        text_x: -30,
                        text_y: 30,
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

			var text = svg.selectAll('text')
                .data(endPoints)
	    		.enter()
                .append('text')
	    		.text(function(d){
                    return d.date ? d.text + ' (' + d.date + ')' : d.text;
                })
                .call(wrap)
	    		.attr('x', function(d){ return d.x + d.text_x })
	    		.attr('y', function(d){ return d.y + d.text_y })
	    		.attr('class', 'nodeText');
        });
      }
    };
  }]);
