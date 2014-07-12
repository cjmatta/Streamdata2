var pump = require('./server/models/Pump.js');

pump.setTable('streamdata_user2')
pump.getRow('THERMALITO_3/10/14 1:21',
	['cf1:resID', 'cf1:psi'], function(err, result){ 
		if(err) { 
			console.log(err);
			process.exit(1);
		}

		kvs = result.raw();

		foreach(kvs, function(kv){
			console.log('key: `%s`, value: `%s`', kv.toString(), kv.getValue().toString());
		})
	});