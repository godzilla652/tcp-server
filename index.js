var net = require('net');

const { exec } = require("child_process");

var server = net.createServer();
server.on('connection', handleConnection);

server.listen(9000, function() {
  console.log('server listening to %j', server.address());
});


function handleConnection(conn) {
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('connected');

  conn.setEncoding('utf8');

	conn.on('data', onConnData);
	conn.once('close', onConnClose);
	conn.on('error', onConnError);

	function onConnData(data) {
		// name@gmail.com-::-subject-::-text
		exec("ls -la", (error, stdout, stderr) => {
			if (error) {
					console.log(`error: ${error.message}`);
					return;
			}
			if (stderr) {
					console.log(`stderr: ${stderr}`);
					return;
			}
			console.log(`stdout: ${stdout}`);
	});
		// asnswer client
	 	// conn.write(d.toUpperCase());
	}
	 function onConnClose() {
	    console.log('connection from %s closed', remoteAddress);
  	}
		function onConnError(err) {
			console.log('Connection %s error: %s', remoteAddress, err.message);
	}

}
