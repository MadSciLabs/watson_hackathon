//'use strict';
var Twitter = require('twitter');

var http = require('http');
var url = require('url');
var fs = require('fs');
var server;

var express = require("express");
//var consolidate = require("consolidate");

var app = express();
var bodyParser = require("body-parser");

//Create the AlchemyAPI object
var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();

var watson = require('watson-developer-cloud');

var all_personal_content = "";
var s_all_tweets = "";
var s_screen_name = "";

var demo_text = 'Yesterday dumb Bob destroyed my fancy iPhone in beautiful Denver, Colorado. I guess I will have to head over to the Apple Store and buy a new one.';
var demo_url = 'http://www.npr.org/2013/11/26/247336038/dont-stuff-the-turkey-and-other-tips-from-americas-test-kitchen';
var demo_html = '<html><head><title>Node.js Demo | AlchemyAPI</title></head><body><h1>Did you know that AlchemyAPI works on HTML?</h1><p>Well, you do now.</p></body></html>';


//Get Keywords from Alchemy
function keywords(_txt) {

	console.log("Keywords");
	var _out;

        alchemyapi.keywords('text', _txt, { 'sentiment':1 }, function(response) {

		_out = JSON.stringify(response,null,4);
		console.log("this is out");
		console.log(_out);

                //output['keywords'] = { text:demo_text, response:JSON.stringify(response,null,4), results:response['keywords'] };
                //concepts(req, res, output);
	
		console.log("out");
		console.log(_out);
        });

	return _out;
}


//Get Personal Content
function get_personal_content(_twitter, _content)
{
	var client = new Twitter({
  consumer_key: '25cStyNZOD4ei7j52dQ',
  consumer_secret: 'Gl9XSYO7MfojGQ9jT10eJsXvlnKkeSMjFut8ttXh1s',
  access_token_key: '256132595-AhuH9v5fEIe3UHyGfFcSuqoqd14swpuajiSStmL4',
  access_token_secret: 'jnOSW7VFGgXEN6HNBjUY9vTbgdPY4neas2Qk4zUcZY'
	});

	var params = {screen_name: _twitter};
	client.get('statuses/user_timeline', params, function(error, tweets, response){

  if (!error) {

    //var jsonObj = JSON.parse(tweets);

        for(var myKey in tweets) {
                s_all_tweets += tweets[myKey]['text'] + "\n";
                console.log("key:"+myKey+", value:"+tweets[myKey]['text']);
        }

        //console.log(s_all_tweets);

  	}

	});

	//Get content from links
	/*
	var arr = _content.split(",");
	for (var item in arr) {
 		console.log(item); 
	}
	*/

	  return s_all_tweets;
}

app.use(bodyParser.urlencoded({extended: false}));

app.get('/dashboard.html', function(req,res) {

	res.sendfile("dashboard.html");

});

/****************************
 PERSONALITY INSIGHTS
***************************/
app.get('/pi', function (req, res) {

	console.log("name>" + req.param("u_name") );
	console.log("twitter>" + req.param("u_twitter") );
	console.log("samples>" + req.param("u_samples") );

	//All personal content
	all_personal_content = get_personal_content(req.param("u_twitter"), req.param("u_samples")); 
	
	console.log("Tweets" + all_personal_content);
	//CREDENTIALS FOR PERSONALITY
	var personality_insights = watson.personality_insights({
  		username: '677aab8a-a949-4784-a47a-702c9c8563bc',
  		password: 'TudtUp7MxQyN',
  		version: 'v2'
	});


	    personality_insights.profile(
  		{text: all_personal_content},

  		function (err, response) {
    		if (err) {
      			console.log('error:', err);
    		}	
                
      		console.log('success : ');
      		console.log('success : ' + JSON.stringify(response, null, 2));

		res.writeHead('Content-Type', 'application/json');
		res.write(JSON.stringify(response, null, 2));
		res.end();
	});

});

/****************************
  Word Cloud 
***************************/
app.get('/wordcloud', function (req, res) {

	console.log(req.param("u_twitter"));
	console.log(req.param("u_samples"));

	var _twitter = req.param("u_twitter"); 
	var _samples = req.param("u_samples"); 

	//All personal content
        var client = new Twitter({
  consumer_key: '25cStyNZOD4ei7j52dQ',
  consumer_secret: 'Gl9XSYO7MfojGQ9jT10eJsXvlnKkeSMjFut8ttXh1s',
  access_token_key: '256132595-AhuH9v5fEIe3UHyGfFcSuqoqd14swpuajiSStmL4',
  access_token_secret: 'jnOSW7VFGgXEN6HNBjUY9vTbgdPY4neas2Qk4zUcZY'
        });

        var params = {screen_name: _twitter};
        client.get('statuses/user_timeline', params, function(error, tweets, response){

  if (!error) {

    //var jsonObj = JSON.parse(tweets);

        for(var myKey in tweets) {
                s_all_tweets += tweets[myKey]['text'] + "\n";
                console.log("key:"+myKey+", value:"+tweets[myKey]['text']);
        }

        //console.log(s_all_tweets);
		console.log("al.l personal");
		console.log(s_all_tweets);

        console.log("Keywords");
        var _out;

        alchemyapi.keywords('text', s_all_tweets, { 'sentiment':1 }, function(response) {

                _out = JSON.stringify(response,null,4);
                console.log("this is out");
                console.log(_out);

                console.log("out");
                console.log(_out);

		res.writeHead('Content-Type', 'application/json');
		res.write(_out);
		res.end();
        });


        
		}
        });
});

/****************************
  News
***************************/
app.get('/news', function (req, res) {

	    console.log(">" + req.param("name") );
});

/****************************
  OLD ... IGNORE Personality Index
***************************/
app.get('/pi', function (req, res) {

	//All personal content
	all_personal_content = get_personal_content(req.param("name"), req.param("samples")); 

	//CREDENTIALS FOR PERSONALITY
	var personality_insights = watson.personality_insights({
  		username: '677aab8a-a949-4784-a47a-702c9c8563bc',
  		password: 'TudtUp7MxQyN',
  		version: 'v2'
	});
	    console.log(">" + req.param("name") );

	    personality_insights.profile(
  		{text: all_personal_content},

  		function (err, response) {
    		if (err) {
      			console.log('error:', err);
    		}	
                
      		console.log('success : ');
      		console.log('success : ' + JSON.stringify(response, null, 2));

		res.writeHead('Content-Type', 'application/json');
		res.write(JSON.stringify(response, null, 2));
		res.end();
	});

});


app.listen(3000,function () {
	console.log("started on port 3000");
});

/*
LISTEN FOR SOCKET REUQESTS ... CAN IGNORE
*/
