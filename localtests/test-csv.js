'use strict';

var fs = require('fs'),
	watchDir = '/mapr/sko1/user/user1/spark/output',
    watchFile = 'output.csv',
    readSize = 0,
   	csv = require('csv'),
   	watch = require('watch');

var totalRecords = [];

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

function filter(f, stat) {
	if (f.indexOf(watchFile) > -1) {
		console.log("Yay! " + f);
		return true;
	}
	console.log("Boo! " + f);
	return false;
}

var getAll = 1;

watch.createMonitor(watchDir, {filter: filter}, function(monitor) {
	monitor.on("created", function(f, stats){
		if (!filter(f, stats)) return;
		totalRecords = [];
		getAll = 1;
		console.log(f + " created");
	});

	monitor.on("changed", function(f, stats, prev){
		// I think the filter option in the createMonitor
		// function is buggy, so I'm re-checking here.
		if (!filter(f, stats)) return;

		if (prev) {
			if (getAll === 1) {
				readSize = 0;
			} else {
				readSize = prev.size;
			}
		} else {
			console.log("New file");
			readSize = 0;
		}

		console.log(f + " changed");
		// if it's smaller, wait half a second
		if (stats.size <= readSize) {
			console.log("No change, come back later.");	
			return;
		}

		// read the stream offset 
		var stream = fs.createReadStream(f, {
			start: readSize,
			end: stats.size
		});
		
		stream.on('error', function (error) {
			console.log("Caught " + error);
		});
		
		stream.on('data', function(chunk){
			console.log("Sending data from " + f);
			parser.write(chunk.toString());
		});

		getAll = 0;
	});

	monitor.on("removed", function(f, stats){
		console.log(f + " removed");
	});
});