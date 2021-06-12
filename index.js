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
		let parsed = data.match(/(.*)-::-(.*)-::-(.*)/)

		let to = parsed[1]
		let subject = parsed[2]
		let body = parsed[3]

		// system action from terminal
		exec(`echo ${body} | mail -s '${subject}' ${to}`, (error, stdout, stderr) => {
			if (error) {
					console.log(`error: ${error.message}`);
					return;
			}
			if (stderr) {
					console.log(`stderr: ${stderr}`);
					return;
			}
		// show output of system handler after
		// console.log(`stdout: ${stdout}`);
	})
		// asnswer client
	 	conn.write(`mail sent...`);


	}
	function onConnClose() {
		 console.log('connection from %s closed', remoteAddress);
	 }
	 function onConnError(err) {
		 console.log('Connection %s error: %s', remoteAddress, err.message);
	 }
}
