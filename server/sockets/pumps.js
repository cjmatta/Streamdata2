'use strict';

var pumpdata = require('../models/Pumpdata'),
	csv = require('ya-csv'),
	fs = require('fs'),
	dataFile = __dirname + '/../data/pumpdata.csv',
	fetchInterval = 5000;

var reader = csv.createCsvStreamReader(dataFile, {
    'separator': ',',
    'quote': '"',
    'escape': '"',       
    'comment': '',
});

reader.setColumnNames([
	'PumpId',
	'date',
	'time',
	'HZ',
	'Displacement',
	'Flow',
	'SedimentPPM',
	'PSI',
	'ChlorinepPM'
]);


reader.addListener('error', function(err){
	console.log(err);
});

function _startWriting () {
	pumpdata.startWriting();
}

function _stopWriting () {
	pumpdata.stopWriting();
}

function register (socket) {
	socket.on('pumps:open', function () {
		_startWriting();
		reader.addListener('data', function(data){
			console.log(data);
			socket.emit('pumps:data', data);
		});
	});

	socket.on('pumps:close', function () {
		_stopWriting();
	});
}

exports.register = register