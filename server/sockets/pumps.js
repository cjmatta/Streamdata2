'use strict';

var fs = require('fs'),
	csv = require('csv'),
	watch = require('watch'),
	watchDir = null,
	watchFile = 'output.csv',
	getAll = 1;

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

function _fileFilter (f, stat) {
	if (f.indexOf(watchFile) > -1) {
		console.log("Yay! " + f);
		return true;
	}
	console.log("Boo! " + f);
	return false;
}

function _setWatchDir (dirname) {
	fs.exists(dirname, function(exists){
		if (!exists){
			throw ("Directory " + dirname + " doesn't exist!");
		}
		watchDir = dirname;
	});
}

function _onCreate (f, stats) {
	if (!filter(f, stats)) return;
	console.log(f + " created");
}

function _onChanged (f, stats, prev) {
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
		parser.write(chunk.toString());
	});

	getAll = 0;
}

function _onRemoved (f, stats) {
	if (!filter(f, stats)) return;
	console.log(f + " removed");
}

function _getWatcher(callback) {
	watch.createMonitor(watchDir, {filter: filter}, function(monitor){
		monitor.on("created", _onCreate);
		monitor.on("removed", _onRemoved);
		callback(monitor);
	});
}


function register (socket) {
	socket.on('pumps:open', function () {
		_getWatcher(function(monitor){
			monitor.on("changed", _onChanged);
		});

		socket.on('pumps:close', function () {
			monitor.stop(); // Stop Watching
		});
	});
	
	// Set a readable listener to emit the data
	parser.on('readable', function(){
		while(record = parser.read()){
			socket.emit('pumps:data', record);
		}
	});
}

exports.register = register