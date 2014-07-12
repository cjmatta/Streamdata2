/*
 * client/js/pumpdata/controllers/summary.js
 */

'use strict';

var _ = require('lodash');
var _o;

function startData() {
	console.log("start");
	socket.emit('pumps:open');

	_o.$scope.pumpdata = []; 	
	socket.on('pumps:data', function(data){
      console.log(data);
  		_o.$scope.pumpdata.push(data);
      _o.$scope.$apply(function(){
        _o.$scope.latestData = data;
      });
  	});
}

function stopData() {
	console.log("stop");
	socket.emit('pumps:close');
}

exports = module.exports = function (ngModule) {
  ngModule.controller('PumpDashboardCtrl', function ($scope, socket) {
  	_o = {
  		$scope: $scope
  	};

    var latestData;

  	_.assign($scope, {
      latestData: latestData,
  		startData: startData,
  		stopData: stopData
  	});
  });
};
