'use strict';

var fs = require('fs'),
	filename = './test.txt',
	readSize = 0;

function start() {
	var writeStream = fs.createWriteStream(filename);
	var x = 0;
	var limit = 1000;
	while (x <= 1000){
		setTimeout(function(){
			writeStream.write(x + '\n');
			x += 1;
		}, 500);

	}
	
	writeStream.write("Done");
}

function watchFile(filename) {
	fs.exists(filename, function(exists) {
		console.log(exists)
		return fs.watch(filename);

	});
}


start();
var watcher = watchFile(filename);
watcher.on('change', function(e, f){
	console.log(e);
	console.log(f);
	console.log("File changed....");
});

