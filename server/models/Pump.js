'use strict';

var HBase = require('hbase-client'),
	_ = require('lodash'),
	table = null;

var client = HBase.create({
	zookeeperHosts: [
		'ip-10-230-4-141.us-west-2.compute.internal:5181',
		'ip-10-227-68-187.us-west-2.compute.internal:5181',
		'ip-10-230-7-91.us-west-2.compute.internal:5181'
	],
	// this is the actual hbase directory where the -ROOT- dir is found
	zookeeperRoot: '/hbase'
});

function setTable(tablename) {
	table = tablename;
}

function getTable() {
	return tablename;
}

function getRow(rowname, columns, callback) {
	var param = new HBase.Get(rowname);
	// Add the columns
	_.each(columns, function(column){
		var cols = column.split(':');
		param.addColumn(cols[0], cols[1]);
	});

	client.get(table, param, function(err, result){
		if(err) {
			return callback(err, null);
		}

		return callback(null, result);
	});
}

var pumps = {
	client: client,
	setTable: setTable,
	getTable: getTable,
	getRow: getRow
};

exports = module.exports = pumps;