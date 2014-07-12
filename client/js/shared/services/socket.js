/*
 * client/js/shared/services/socket.js
 */

'use strict';

var socketio = require('socketio');

var retryInterval = 5000,
    retryTimer,
    _o;

var socket = global.socket = socketio.connect('', {
  'force new connection': true,
  'max reconnection attempts': Infinity,
  'reconnection limit': 10 * 1000
});

function connect() {
	clearInterval(retryTimer);

    socket.on('connect', function () {
      socket.emit('info', {
        // modernizr: Modernizr,
        navigator: _.transform(navigator, function (result, val, key) {
          if (_.isString(val)) {
            result[key] = val;
          }
        })
      });
    });

    socket.on('test', function (data) {
      socket.emit('test', { hello: 'from browser world' });
    });

    retryTimer = setInterval(function () {
      if (!socket.socket.connected &&
          !socket.socket.connecting &&
          !socket.socket.reconnecting) {
        connect();
      }
    }, retryInterval);
}

function isConnected() {
	return socket.socket.connected;
}

function on(eventName, callback) {
  socket.on(eventName, function () {  
    var args = arguments;
    _o.$rootScope.$apply(function () {
      callback.apply(socket, args);
    });
  });
}

function emit(eventName, data, callback) {
  socket.emit(eventName, data, function () {
    var args = arguments;
    _o.$rootScope.$apply(function () {
      if (callback) {
        callback.apply(socket, args);
      }
    });
  })
}

// Public API
exports = module.exports = function (ngModule) {
	ngModule.factory('socket', function($rootScope) {
		_o = {
			$rootScope: $rootScope
		}

		return { 
			connect: connect,
			isConnected: isConnected,
			on: on,
			emit: emit
		};
	});
};

