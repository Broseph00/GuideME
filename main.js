'use strict';

let https = require ('https');
var express = require('express');
var app = express();


app.use(express.static('HCI Proj 1'));

 app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://guide123.azurewebsites.net');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if ('OPTIONS' == req.method) {
    res.sendStatus(200);
    } else {
      next();
    }
  });

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/script.js', function (req, res) {
   res.sendFile( __dirname + "/" + "script.js" );
})


app.get('/Translate/:text/:to', function(req,res) {
    let subscriptionKey = 'e16e2eb605e041cbb5e86a42c5c91348';

    let host = 'api.microsofttranslator.com';
    let path = '/V2/Http.svc/Translate';
    let target = req.params.to;
    let text = req.params.text;
    let params = '?to=' + target + '&text=' + encodeURI(text);

    let response_handler = function (response) {
    let body = '';
        response.on ('data', function (d) {
            body += d;
            res.send(body);
        });
        response.on ('error', function (e) {
            console.log ('Error: ' + e.message);
        });
    };

    let request_params = {
        method : 'GET',
        hostname : host,
        path : path + params,
        headers : {
            'Ocp-Apim-Subscription-Key' : subscriptionKey,
        }
    };

    let request = https.request (request_params, response_handler);
    request.end ();
})

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});

var port = process.env.PORT || 8081;

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

})