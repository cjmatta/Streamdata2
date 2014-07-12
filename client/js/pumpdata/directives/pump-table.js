'use strict';
var rhtml = require('rhtml');

exports = module.exports = function(ngModule) {
	ngModule.directive('pumpTable', function() {
		return {
			restrict: 'A',
			template: rhtml('../templates/pump-table.html')
		};
	});
}