//'use strict';
var Twitter = require('twitter');

var http = require('http');
var url = require('url');
var fs = require('fs');
var server;

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var watson = require('watson-developer-cloud');

var all_personal_content = "";
var s_all_tweets = "";
var s_screen_name = "";


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
                //console.log("key:"+myKey+", value:"+tweets[myKey]['text']);
        }

        console.log(s_all_tweets);

  	}
	});

	//Get content from links
	var arr = _content.split(",");
	for (var item in arr) {
 		console.log(item); 
	}
}

app.use(bodyParser.urlencoded({extended: false}));

app.get('/dashboard.html', function(req,res) {

	res.sendfile("dashboard.html");

});

/****************************
 ALL TOGETHER 
***************************/
app.get('/all', function (req, res) {

	//All personal content
	all_personal_content = get_personal_content(req.param("name"), req.param("samples")); 
});

/****************************
  Word Cloud 
***************************/
app.get('/wordcloud', function (req, res) {

	//All personal content
	all_personal_content = get_personal_content(req.param("name"), req.param("samples")); 
});

/****************************
  News
***************************/
app.get('/news', function (req, res) {

	    console.log(">" + req.param("name") );
});

/****************************
  Personality Index
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
      		//console.log('success : ' + JSON.stringify(response, null, 2));

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
