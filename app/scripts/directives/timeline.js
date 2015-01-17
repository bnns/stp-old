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
      //console.log(text);
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 14, // px
            x = text.attr('x'),
            y = text.attr('y'),
            dx = text.attr('dx'),
            dy = text.attr('dy'),
            tspan = text.text(null).append("tspan").attr('x', x).attr('y', y).attr('dx', dx).attr('dy', dy);
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
            .attr('dx', dx + 'px')
            .attr('dy', lineNumber++ * lineHeight + 'px').text(word);
          }
        }
      });
    };

    var link = function (scope, element) {

        var _id = scope.name.replace(/, /g, '').replace(' and ', '').replace(' ', '');
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
        var height = (scope.points.length > 0) ? moment(latestTime).diff(startDate, 'weeks') * 50 : 0;
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
                    if (entry.update === 'abstract'){
                        endPoints.push({
                            x: center,
                            y: lineStart,
                            text_x: 15,
                            text_y: -25,
                            text: 'abstract',
                            link: entry.filelocation
                        });
                    }
                    else if (entry.update === 'bibliography'){
                        endPoints.push({
                            x: center,
                            y: height,
                            text_x: 15,
                            text_y: 35,
                            text: 'bibliography',
                            link: entry.filelocation
                        });
                    }
                    else {
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
                    }
                    prevDate = moment(entry.date, 'MM/DD/YYYY');
                });

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
                .attr('r', 5)
                .attr('class', 'circle');

            var text = svg.selectAll('text')
                .data(endPoints)
                .enter()
                .append('svg:a')
                .each(function(d) {
                    var header = d3.select(this);
                    if (d.link)
                        header.attr('xlink:href', d.link);
                    else
                        header.attr('class', 'pointer-cancel');
                })
                .append('text')
                .text(function(d){
                    return d.date ? d.text + ' (' + d.date + ')' : d.text;
                })
                .attr('x', function(d){ return d.x })
                .attr('y', function(d){ return d.y })
                .attr('dx', function(d){ return d.text_x })
                .attr('dy', function(d){ return d.text_y })
                .call(wrap)
                .attr('class', 'nodeText');
        });
      };

    return {
	  template: '<div class=\'stp-timeline\'></div>',
      restrict: 'EA',
      scope: {
      	name: '=researchName',
      	points: '=researchPoints'
      },
      link: link
    };
  }]);
