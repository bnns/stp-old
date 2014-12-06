'use strict';

/**
 * @ngdoc directive
 * @name stpApp.directive:forceGraph
 * @Displays a force graph layout of the STP website
 * # forceGraph
 */
angular.module('stpApp')
  .directive('forceGraph', ['d3Service', function (d3Service) {
    return {
      restrict: 'E',
      template: '<div id=\'menu\'></div>',
      link: function () {
      	d3Service.d3().then(function(d3){
			var links = [
			  {source: 'concept', target: 'form', type: 'red'},
			  {source: 'concept', target: 'material', type: 'red'},
			  {source: 'form', target: 'material', type: 'red'},
			  {source: 'form', target: 'concept', type: 'red'},
			  {source: 'material', target: 'concept', type: 'red'},
			  {source: 'material', target: 'form', type: 'red'},
			  {target: 'lines of research', source: 'concept', type: 'dotted'},
			  {target: 'updates', source: 'concept', type: 'dotted'},
			  {target: 'productions', source: 'concept', type: 'dotted'},
			  {target: 'protocols', source: 'form', type: 'dotted'},
			  {target: 'schedule', source: 'form', type: 'dotted'},
			  {target: 'definition', source: 'form', type: 'dotted'},
			  {target: 'recordings', source: 'material', type: 'dotted'},
			  {target: 'presentations', source: 'material', type: 'dotted'},
			  {target: 'bibliography', source: 'material', type: 'dotted'}
			];

			var nodes = {};

			var linkArc = function(d) {
			  var dx = d.target.x - d.source.x,
			      dy = d.target.y - d.source.y,
			      dr = Math.sqrt(dx * dx + dy * dy);
			  return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y;
			};

			var transform = function(d) {
			  return 'translate(' + d.x + ',' + d.y + ')';
			};

			// Use elliptical arc path segments to doubly-encode directionality.
			var tick = function() {
			  path.attr('d', linkArc);
			  circle.attr('transform', transform);
			  text.attr('transform', transform);
			};

			// Compute the distinct nodes from the links.
			links.forEach(function(link) {
			  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
			  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
			});

			var width = '1280',
			    height = '600';

			var force = d3.layout.force()
			    .nodes(d3.values(nodes))
			    .links(links)
			    .size([width, height])
			    .linkDistance(160)
			    .charge(-1500)
			    .on('tick', tick)
			    .start();

			var svg = d3.select('#menu').append('svg')
			    .attr('width', width)
			    .attr('height', height);

			// Per-type markers, as they don't inherit styles.
			svg.append('defs').selectAll('marker')
			    .data(['dotted', 'red', 'solid'])
			    .enter().append('marker')
			    .attr('id', function(d) { return d; })
			    .attr('viewBox', '0 -5 10 10')
			    .attr('refX', 15)
			    .attr('refY', -1.5)
			    .attr('markerWidth', 10)
			    .attr('markerHeight', 10)
			    .attr('orient', 'auto')
			    .append('path')
			    .attr('d', 'M0,-5L10,0L0,5');

			var path = svg.append('g').selectAll('path')
			    .data(force.links())
			    .enter().append('path')
			    .attr('class', function(d) { return 'link ' + d.type; })
			    .attr('marker-end', function(d) { return 'url(#' + d.type + ')'; });

			var circle = svg.append('g').selectAll('circle')
			    .data(force.nodes())
			    .enter().append('circle')
			    .attr('r', 15)
			    .call(force.drag);

			var text = svg.append('g').selectAll('text')
			    .data(force.nodes())
			    .enter().append('text')
			    .attr('x', 25)
			    .attr('y', '.35em')
			    .text(function(d) { return d.name; })
			    .attr('class', 'nodeText');
      	});
       
      }
    };
  }]);
