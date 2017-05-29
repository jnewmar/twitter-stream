// CLIENT

const net = require('net');
const socket = net.Socket();

// CONFIG
const CONFIG = require('./config.js');

socket.connect(CONFIG.PORT, CONFIG.HOST, function() {
	console.log('Connected');
});

var counter = 0;
var start = new Date();

socket.on('data', function(data){
	var items = data.toString().split('\r\n');
	while (items.indexOf('') !== -1) {
		items.splice(items.indexOf(''), 1);
	}
	counter += items.length;
	console.log(items);
});

socket.on('end', function(data){
	var end = new Date() - start;
	console.info('Execution-time: \t', end, 'ms ~', (end/1000).toFixed(1), 's');
	console.log('Recieved-count: \t', counter);
	console.log('Frequency: \t\t', (counter/(end/1000)).toFixed(0), 't/s');
});

socket.on('error', function(err){
	console.log(err);
});
