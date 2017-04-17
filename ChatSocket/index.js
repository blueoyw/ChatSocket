var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis')
var port = process.env.PORT || 3001;

/*
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');	
});
*/

//redis
var client = redis.createClient(6379, "119.194.139.163", {
	password : "redis!"
});

io.on('connection', function(socket) { //conneted call back
	console.log('connected');
		
	socket.on('disconnect', function() {
		console.log('disconnected');		
	});
	
	/*
	socket.on('chat message', function(msg) { //chat message call back
		console.log(msg);
		io.emit('chat message', msg);
	});
	*/	
});

//redis message
client.on("message", function( channel, message ){
	console.log("sub channel " + channel + ": " + message);	    	
	io.emit('chat message', message);
	/*
    sub.unsubscribe();
    sub.quit();
    pub.quit();
    */	    
});		

http.listen(port, function() {
	console.log('listening on *:' + port);
});

//redis subscribe
client.subscribe("chat");
//client.unsubscribe();
//client.quit();