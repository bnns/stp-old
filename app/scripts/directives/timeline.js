'use strict';

/**
 * @ngdoc directive
 * @name stpApp.directive:timeline
 * @description
 * # timeline
 */
angular.module('stpApp')
  .directive('timeline', ['$compile', 'd3Service', function($compile, d3Service) {

    var wrap = function(text) {
      //console.log(text);
      text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word = words.pop(),
          line = [],
          lineNumber = 0,
          lineHeight = 1.2, // em
          x = text.attr('x'),
          y = text.attr('y'),
          dx = parseFloat(text.attr('dx')),
          dy = parseFloat(text.attr('dy')),
          tspan = text.text(null).append("tspan").attr('x', x).attr('y', y).attr('dx', dx).attr('dy', dy + 'em');
        while (word) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > 50) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan')
              .attr('x', x)
              .attr('y', y)
              .attr('dx', dx + 'px')
              .attr('dy', lineNumber++ * lineHeight + 'em').text(word);
          }
          word = words.pop();
        }
      });
    };

    var link = function(scope, element) {

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
        .map(function(d) {
          return d ? moment(d, 'DD/MM/YYYY').toDate() : moment().toDate();
        })
        .max()
        .value();

      //var latestTime = new Date('12/01/2015').getTime(); //hard coded final date of the timeline
      var startDate = moment('01/01/2015', 'DD/MM/YYYY');
      var lineStart = (scope.points.length > 0) ? 50 : 0;
      var lineHeightOffset = 50;
      var height = (scope.points.length > 0) ?
        (moment(latestTime).diff(startDate, 'days') * 8) + lineHeightOffset : lineHeightOffset;
      var endPoints = [];

      var describePath = function(d) {
        var pathDescription = 'M ' + center + ' 0,',
          prevDate = startDate,
          prevDiff = 0;

        _.map(d, function(entry) {
          prevDiff = moment(entry.date, 'DD/MM/YYYY').diff(prevDate, 'days') * 10 + prevDiff;
          //console.log('previous difference', prevDiff);
          pathDescription += 'M ' + center + ' ' + prevDiff + ',';
          if (entry.update === 'abstract') {
            endPoints.push({
              x: center,
              y: lineStart,
              xText: 15,
              yText: -25,
              text: 'abstract',
              link: entry.filelocation
            });
          } else if (entry.update === 'bibliography') {
            endPoints.push({
              x: center,
              y: height,
              xText: 15,
              yText: 35,
              text: 'bibliography',
              link: entry.filelocation
            });
          } else {
            if (entry.type === 'audio') {
              pathDescription += 'L ' + leftCenter + ' ' + prevDiff + ',';
              endPoints.push({
                x: leftCenter,
                y: prevDiff,
                xText: -75,
                yText: 5,
                text: entry.filename,
                date: moment(entry.date, 'DD/MM/YYYY').format('DD/MM/YYYY'),
                link: entry.filelocation
              });
            } else if (entry.type === 'text') {
              pathDescription += 'M ' + center + ' ' + prevDiff + ',';
              pathDescription += 'L ' + rightCenter + ' ' + prevDiff + ',';
              endPoints.push({
                x: rightCenter,
                y: prevDiff,
                xText: 20,
                yText: 5,
                text: entry.update,
                date: moment(entry.date, 'DD/MM/YYYY').format('DD/MM/YYYY'),
                link: entry.filelocation
              });
            }
          }
          prevDate = moment(entry.date, 'DD/MM/YYYY');
        });

        //console.log(pathDescription);
        return pathDescription;
      };

      d3Service.d3().then(function(d3) {

        var svg = d3.select('#' + _id)
          .append('svg')
          .attr('width', width)
          .attr('height', height + lineStart + lineHeightOffset);

        var line = svg.append('line')
          .attr('x1', center)
          .attr('y1', lineStart)
          .attr('x2', center)
          .attr('y2', height)
          .attr('stroke-width', 2)
          .attr('stroke', '#fff')
          .attr("stroke-dasharray", height + " " + height)
          .attr("stroke-dashoffset", height)
          .transition()
          .delay(1000)
          .duration(8000)
          .ease("linear")
          .attr("stroke-dashoffset", 0);

        var path = svg.append('path')
          .attr('d', describePath(scope.points));

        var totalLength = path.node().getTotalLength();

        path
          .attr('stroke-width', 2)
          .attr('stroke', '#fff')
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(2000)
          .delay(3000)
          .ease("linear")
          .attr("stroke-dashoffset", 0);

        svg.selectAll('text')
          .data(endPoints)
          .enter()
          .append('svg:a')
          .each(function(d, i) {
            var header = d3.select(this);
            if (d.link) {
              header.attr('xlink:href', d.link);
            } else
              header.attr('class', 'pointer-cancel');
          })
          .append('text')
          .text(function(d) {
            return d.date ? d.text + ' (' + d.date + ')' : d.text;
          })
          .attr('x', function(d) {
            return d.x;
          })
          .attr('y', function(d) {
            return d.y;
          })
          .attr('dx', function(d) {
            return d.xText;
          })
          .attr('dy', function(d) {
            return d.yText;
          })
          .call(wrap)
          .attr('class', 'nodeText');

        var circle = svg.selectAll('circle')
          .data(endPoints)
          .enter()
          .append('circle')
          .attr('cx', function(d) {
            return d.x;
          })
          .attr('cy', function(d) {
            return d.y;
          })
          .attr('class', 'circle');

        [0, 2, 3, 4, 5].forEach(function(d, i) {
          circle.transition().duration(1000).delay(i * 200)
            .attr("r", d);
        });

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
