'use strict';

var fs = require('fs'),
	watch = require('watch'),
	csv = require('csv'),
	watchDir = null,
	watchFile = 'output.csv',
	getAll = 0;

var parser = csv.parse({
	columns: ['pumpID',
			  'datetime',
			  'hz',
			  'displacement',
			  'flow',
			  'sedimentppm',
			  'psi',
			  'flowppm']
	});

parser.on('readable', function(data){
	var record;
	while(record = parser.read()){
		totalRecords.push(record);
		console.log(record);
	}
	console.log("Got " + totalRecords.length + " records.");
});

parser.on('error', function(err){
	console.log(err);
});

function setWatchDir(dirname) {
	fs.exists(dirname, function(exists){
		if (!exists){
			throw ("Directory " + dirname + " doesn't exist!");
		}
		watchDir = dirname;
	});
}

// reset the counter to get all 
// records from the csv file.
function getAll() {
	getAll = 0;
}

function getParser() {
	return parser;
}

function startWatching () {
	return;
}

function stopWatching () {
	return;
}

var pumps = {
	setWatchDir: setWatchDir,
	getAll: getAll,
	startWatching: startWatching,
	stopWatching: stopWatching,
	getParser: getParser
};

exports = module.exports = pumps;