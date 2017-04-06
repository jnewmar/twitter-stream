// SERVER

const io = require('socket.io')();
const nanoTimer = require('nanotimer');
const readline = require('readline');
const fs = require('fs');
const process = require('process');

// CONFIG
const TPS = 5000; // int
const REPEAT = false; // true | false
const CUTOFF = null; // int | null
const BUFFER_THRESHOLD = 10; // int
const DATAFILE = 'sample.txt';

var counter = 0;
var timer = new nanoTimer();
var startTime;
var buffer = [];
var loadCount = 0;
var endOfFile = false;
var stream;

console.log('Starting server with following paramters:');
console.log('Tweets/s: \t', TPS);
console.log('Repeat: \t', REPEAT);
console.log('Cutoff: \t', CUTOFF);
console.log('Buffer thrs.: \t', BUFFER_THRESHOLD);

function createNewInputStream() {
	process.stdout.write("|");

	stream = readline.createInterface({
		input: fs.createReadStream(DATAFILE, 'utf8')
	});

	stream.on('line', function(line) {
		buffer.push(line);
		loadCount++;
		if (loadCount % (TPS*BUFFER_THRESHOLD) == 0) {
			stream.pause();
		}
	});

	stream.on('close', () => {
		if (REPEAT) {
			createNewInputStream()
			endOfFile = false;
		} else {
			endOfFile = true;
		}
	});
}

createNewInputStream();

io.sockets.on('connection', function (socket) {
	console.log('\nClient connected - starting stream');
	console.log('Start-memory: \t', (process.memoryUsage().rss/(1024*1024)).toFixed(1), 'MB');
	startTime = new Date();

	process.stdout.write("Buffer: ");

	timer.setInterval(function() {
		if (buffer.length < TPS && endOfFile) {
			emit(buffer); // emit rest of buffer
			stop();
		} else {
			if (buffer.length < (TPS*BUFFER_THRESHOLD) && !endOfFile) {
				stream.resume();
				process.stdout.write("#");
			}
			emit(buffer.splice(0,TPS));
		}
	}, [timer], '1s');


});

function emit(data) {
	if (CUTOFF && counter >= CUTOFF) {
		stop();
	} else {
		io.sockets.emit('tweet', data);
		counter += data.length;
	}
}

function stop() {
	timer.clearInterval();
	io.sockets.emit('stop', counter);
	stream.close();
	var endTime = new Date() - startTime;
	console.log("\n|");
	console.log('End-memory: \t', (process.memoryUsage().rss/(1024*1024)).toFixed(1), 'MB');
	console.log('Exec.-time: \t', endTime, 'ms ~', (endTime/1000).toFixed(1), 's');
	console.log('End-count: \t', counter);
	console.log('Frequency: \t', (counter/(endTime/1000)).toFixed(0), 't/s')
}

io.listen(3000);
