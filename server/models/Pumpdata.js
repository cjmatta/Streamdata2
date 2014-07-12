// Returns simulated data designed to look like:
// "PumpID":"LAGNAPPE",
// "date":"3/10/14",
// "time":"10:01",
// "HZ":"9.72",
// "Displacement":"2.549",
// "Flow":"1237",
// "SedimentPPM":"1.59",
// "PSI":"99",
// "ChlorinepPM":"1.69"
'use strict';
var moment = require('moment'),
	_ = require('lodash'),
	csv = require('ya-csv'),
	fs = require('fs'),
	writingData = null,
	outputFile = './server/data/pumpdata.csv';

var pumpids = [ 'ANDOUILLE',
				  'BBKING',
				  'BUTTE',
				  'CARGO',
				  'CHER',
				  'COHUTTA',
				  'LAGNAPPE',
				  'MOJO',
				  'NANTAHALLA',
				  'THERMALITO' ];

// return a random integer inclusive between low and high
var randomInt = function( low, high ) {
	return Math.floor(Math.random() * (high - low) + low);
}

// return a random float inclusive between low and high
// round to 'decimals'
var randomFloat = function (low, high, decimals ) {
	decimals = typeof decimals !== 'undefined' ? decimals : 2;
	var number = Math.random() * (high - low) + low;
	return number.toFixed(decimals)
}

var getHZ = function() {
	return randomFloat(9.5, 10.5);
};

var getDisplacement = function() {
	return randomFloat(1, 3.5, 3);
}

var getFlow = function() {
	return randomInt(1200, 1450);
}

var getSedimentPPM = function () {
	return randomFloat(0.05, 2);


var getPSI = function () {
	return randomInt(75, 100);
}

var getChlorinepPM = function () {
	return randomFloat(0.5, 2);
}

// returns an object containing simlated data for the 
// specified pumpid
var generateData = function(pumpid) {
	return {
		"PumpID": pumpid,
		"date": moment().format('MM/DD/YYYY'),
		"time": moment().format('HH:mm:ss'),
		"HZ": getHZ(),
		"Displacement": getDisplacement(),
		"Flow": getFlow(),
		"SedimentPPM": getSedimentPPM(),
		"PSI": getPSI(),
		"ChlorinepPM": getChlorinepPM()
	}
}

function getData() {
	var return_data = [];
	pumpids.forEach(function(pumpid) {
		return_data.push(generateData(pumpid));
	});

	return return_data;
}

function startWriting() {
	if(writingData){
		return;
	}

	var writableStream = fs.createWriteStream(outputFile),
		csvWriter = csv.createCsvStreamWriter(writableStream);

	writingData = setInterval(function() {
		console.log("writing data...");
		_.each(getData(), function(pump){
			csvWriter.writeRecord(_.values(pump));
		});
	}, 5000);


}

function stopWriting() {
	clearInterval(writingData);
	writingData = null;
}

var pumpdata = {
	getData: getData,
	startWriting: startWriting,
	stopWriting: stopWriting
}


exports = module.exports = pumpdata;
