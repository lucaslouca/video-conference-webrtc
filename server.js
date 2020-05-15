/**
 * Server module.
 *
 *
 */

'use strict';

var environment = process.env.RTC_ENV || 'local';

var express = require('express');
var cors = require('cors');
const http = require('http');
var logger = require('./logger').logger(environment);

var serverPort = process.env.RTC_PORT || 1337
var serverIpAddress = process.env.RTC_IP || 'localhost'
var socketIoServer = '127.0.0.1' + ':' + serverPort;

////////////////////////////////////////////////
// SETUP SERVER
////////////////////////////////////////////////
var app = express();

function redirectSec(req, res, next) {
	if (req.headers['x-forwarded-proto'] == 'http') {
		var redirect = 'https://' + req.headers.host + req.path;
		console.log('Redirect to:' + redirect);
		res.redirect(redirect);
	} else {
		return next();
	}
}

app.use(redirectSec);

require('./router')(app, socketIoServer, environment);

// Static content (css, js, .png, etc) is placed in /public
app.use(express.static(__dirname + '/public'));

app.use(cors());

// Location of our views
app.set('views', __dirname + '/views');

// Use ejs as our rendering engine
app.set('view engine', 'ejs');

// Tell Server that we are actually rendering HTML files through EJS.
app.engine('html', require('ejs').renderFile);

const server = http.createServer(app);
server.listen(serverPort, () => {
	logger.info('Server running on port ' + serverPort);
	logger.info("Server IP Address:" + serverIpAddress);
	logger.info("Socket IO Address:" + socketIoServer);
});

var io = require('socket.io').listen(server, { log: false, origins: '*:*' });

////////////////////////////////////////////////
// EVENT HANDLERS
////////////////////////////////////////////////

io.sockets.on('connection', function (socket) {

	function log() {
		var array = [">>> Message from server: "];
		for (var i = 0; i < arguments.length; i++) {
			array.push(arguments[i]);
		}
		socket.emit('log', array);
	}

	socket.on('message', function (message) {
		log('Got message: ', message);
		logger.info("message: ", message);
		socket.broadcast.to(socket.room).emit('message', message);
	});

	socket.on('create or join', function (message) {
		var room = message.room;
		socket.room = room;
		var participantID = message.from;
		configNameSpaceChannel(participantID);

		io.of('/').in(room).clients(function (error, clients) {
			var numClients = clients.length;

			log('Room ' + room + ' has ' + numClients + ' client(s)');
			log('Request to create or join room', room);

			if (numClients == 0) {
				logger.info(participantID + " joined first. Creates room " + room);
				socket.join(room);
				socket.emit('created', room);
			} else {
				logger.info(participantID + " joins room " + room);
				io.sockets.in(room).emit('join', room);
				socket.join(room);
				socket.emit('joined', room);
			}
		})
	});

	// Setup a communication channel (namespace) to communicate with a given participant (participantID)
	function configNameSpaceChannel(room) {
		var nsp = '/' + room;
		var socketNamespace = io.of(nsp);

		logger.info('ConfigNameSpaceChannel:' + nsp);

		socketNamespace.on('connection', function (socket) {
			socket.on('message', function (message) {
				// Send message to everyone BUT sender
				socket.broadcast.emit('message', message);
			});

		});

		return socketNamespace;
	}

});
