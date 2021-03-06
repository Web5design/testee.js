'use strict';

var socketio = require('socket.io');
var url = require('url');
var winston = require('winston');
var logger = require('../../utils').getLogger();

/**
 * Sets up a SocketIO handler on the given test server using
 * its HTTP server.
 *
 * @param {Server} server The test server to attach to
 */
module.exports = function (server) {
	server.on('listening', function (host) {
		var io = socketio.listen(host, {
			logger: new (winston.Logger)({
				transports: []
			})
		});
		io.configure(function () {
			// Socket.io production-ish configuration
			io.enable('browser client etag');
			io.set('log level', 0);

			io.set('transports', [
				'websocket', 'xhr-polling', 'flashsocket',
				'htmlfile', 'jsonp-polling'
			]);

			io.set('authorization', function (handshakeData, callback) {
				// Try and get a registered emitter from the referer URL token
				var parsed = url.parse(handshakeData.headers.referer || '', true);
				var token = parsed.query[server.config.token];
				if (server.isValid(token) || server.config.debug) {
					logger.debug('Authorized token', token);
					// Store the token in global handshakeData
					handshakeData.token = token;
					callback(null, true);
				} else {
					var err = new Error('No registered emitter found for token: ' + token);
					logger.warn(err.message);
					callback(err);
				}
			});
		});

		io.sockets.on('connection', function (socket) {
			var token = socket.handshake.token;

			if (server.isValid(token)) {
				logger.debug('got valid connection, firing the testing event.', {
					token: token
				});
				server.emitter(token).emit('testing', socket);
			}
		});

		server.on('close', function () {
			io.server.close();
		});
	});
};
