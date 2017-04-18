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
var g_channel;
client.on("message", function( channel, message ){
	console.log("sub channel " + channel + "->" + message);	    	
	if( channel === 'http://localhost') {
		var msg = message.split("|");
		if( msg[0] === 'crte') {
			//redis subscribe chat room
			g_channel = msg[1];
			client.subscribe( g_channel );
		}
	} else {  // room channel
		
		console.log ( g_channel );
		if( g_channel === channel ) {	
			console.log( message );
			io.emit(channel, message);		
		}
					
	}
	
	/*
    sub.unsubscribe();
    sub.quit();
    pub.quit();
    */	    
});		

http.listen(port, function() {
	console.log('listening on *:' + port);
});

//<->rest server manage channel
client.subscribe("http://localhost");


//client.unsubscribe();
//client.quit();