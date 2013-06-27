/*********************************************

For more projects, visit https://github.com/fantachip/

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
**********************************************/

var http = require("http");
var fs = require("fs");
var url = require("url"); 
var path = require("path");
var Timers = require("timers"); 
var JSON = require("JSON");
var com = require("serialport");
var child = require("child_process");

var mime_types = {
	'.html': "text/html",
	'.css':  "text/css",
	'.js':   "text/javascript",
	'.jpg': "image/jpeg",
	'.jpeg': "image/jpeg",
	'.png': "image/png"
};

Timers.setInterval(function(){
	child.exec("streamer -c /dev/video0 -b 16 -o frame.jpeg"); 
}, 200); 

var ledstate = 0; 

var serialPort = new com.SerialPort("/dev/ttyUSB0", {
	baudrate: 9600
});

serialPort.on('open',function() {
  console.log('Port open');
});

serialPort.on('data', function(data) {
	console.log("Current led state: "+data.toString());
	if(data.length)
		ledstate = data[0]; 
});

http.createServer(function(req, res){
	var query = url.parse(req.url, true);
	var docpath = "./index.html";
	if(query.pathname != "/")
		docpath = "."+query.pathname.replace("..", ""); 
	
	if(query.query["action"] == "toggle"){
		res.writeHead(200, {"Content-type": "application/json"});
	
		var num = parseInt(query.query["num"]); 
		if(num > 1){
			res.end(JSON.stringify({"error": "There is no led connected to this slot right now!"}));
			return; 
		}
		
		// write the led state to serial port
		console.log("Toggling led: "+JSON.stringify(query.query));
		serialPort.write([num]); 
		
		res.end(JSON.stringify({}));
		return; 
	} else if(query.query["action"] == "status"){
		res.writeHead(200, {"Content-type": "application/json"});
		var status = {
			"0": String(ledstate & 1),
			"1": String(ledstate & 2),
			"2": String(ledstate & 4),
			"3": String(ledstate & 8),
			"4": String(ledstate & 16),
		}; 
		res.end(JSON.stringify(status));
		return; 
	} 
	
	path.exists(docpath, function(exists){
		console.log("Serving file "+docpath);
		if(!exists){
			res.writeHead(404, {"Content-type": "text/plain"});
			res.end();
			return; 
		}
		
		// serve the file
		fs.readFile(docpath, "binary", function(err, data){
			if(err) {
				console.log("Could not load file "+docpath);
				res.writeHead(500, {"Content-type": "text/plain"}); 
				res.end(); 
				return; 
			}
			
			
			var mimetype = mime_types[path.extname(docpath)]; 
			res.writeHead(200, {"Content-Type": mimetype});
			
			
			res.write(data, "binary"); 
			res.end(); 
		});
	});
}).listen(8181);

console.log("Server listening...");

