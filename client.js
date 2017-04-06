// CLIENT

const io = require('socket.io-client');
const socket = io('http://localhost:3000');

var counter = 0;
var start = new Date();

socket.on('tweet', function(data){
	counter += data.length;
});

socket.on('stop', function(data){
	var end = new Date() - start;
	console.info('Execution-time: \t', end, 'ms ~', (end/1000).toFixed(1), 's');
	console.log('Recieved-count: \t', counter);
	console.log('Frequency: \t\t', (counter/(end/1000)).toFixed(0), 't/s');
});
