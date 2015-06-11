//'use strict';

var http = require('http');
var url = require('url');
var fs = require('fs');
var server;

var watson = require('watson-developer-cloud');

var test_text = 'He had numerous movie and TV roles beginning in 1948, including more than 150 on film, often as a villain. In one such role, he appeared as James Bonds nemesis Francisco Scaramanga in 1974s "The Man with the Golden Gun."He had numerous movie and TV roles beginning in 1948, including more than 150 on film, often as a villain. In one such role, he appeared as James Bonds nemesis Francisco Scaramanga in 1974s "The Man with the Golden Gun.He had numerous movie and TV roles beginning in 1948, including more than 150 on film, often as a villain. In one such role, he appeared as James Bonds nemesis Francisco Scaramanga in 1974s "The Man with the Golden Gun.';

//CREDENTIALS FOR PERSONALITY
var personality_insights = watson.personality_insights({
  username: '677aab8a-a949-4784-a47a-702c9c8563bc',
  password: 'TudtUp7MxQyN',
  version: 'v2'
});


//OPTIONS FOR INCOMMING
server = http.createServer(function(req, res){
    // your normal server code
    var path = url.parse(req.url).pathname;
    switch (path){
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<h1>Hello! Try the <a href="/test.html">Test page</a></h1>');
            res.end();
            break;
        case '/dashboard.html':
            fs.readFile(__dirname + path, function(err, data){
                if (err){ 
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
                res.write(data, 'utf8');
                res.end();
            });
	    break;

	case '/pi':
	    personality_insights.profile(
  		{text: test_text},

  		function (err, response) {
    		if (err) {
      			console.log('error:', err);
                    	return send404(res);
    		}	
                
      		console.log('success : ' + JSON.stringify(response, null, 2));

		res.writeHead('Content-Type', 'application/json');
		res.write(JSON.stringify(response, null, 2));
		res.end();

		/*
		res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
                res.write(response, 'utf8');
                res.end();
	        */
	
		});

        break;
        default: send404(res);
    }
}),

send404 = function(res){
    res.writeHead(404);
    res.write('404');
    res.end();
};

server.listen(8080);

/**
LISTEN FOR SOCKET REUQESTS ... CAN IGNORE
*/

// use socket.io
var io = require('socket.io').listen(server);

var _client_light = 0;
var dirty = true;

//turn off debug
io.set('log level', 1);

// define interactions with client
io.sockets.on('connection', function(socket){

    //send data to client
    setInterval(function(){
        socket.emit('client_light', {'val': Math.floor((Math.random() * 200) + 1)});
    }, 100);

    //recieve client data
    socket.on('rpi_light', function(data){

	dirty = true;
        //process.stdout.write(data.val + "\n");
	console.log("in " + data.val);
        _client_light = data.val; 

    });

    //SEND OUT
/*
    setInterval(function(){
	if (true) { dirty = false;
        socket.emit('client_light', {'val': _client_light});
        }
    }, 10);
*/

});
