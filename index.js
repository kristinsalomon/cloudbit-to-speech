//Source: https://www.twilio.com/blog/2015/02/answering-health-questions-via-sms-with-ibm-watson-and-twilio.html

var express = require('express'),
	app = express(),
	request = require ('request');

 
// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 8000);

// Get text_to_speech service auth
var service_url, service_username, service_password;
if (process.env.VCAP_SERVICES) {
  console.log('Parsing VCAP_SERVICES');
  var services = JSON.parse(process.env.VCAP_SERVICES);
  //service name, check the VCAP_SERVICES in bluemix to get the name of the services you have
  var service_name = 'text_to_speech';
 
  if (services[service_name]) {
    var svc = services[service_name][0].credentials;
    service_url = svc.url;
    service_username = svc.username;
    service_password = svc.password;
  } else {
    console.log('The service '+service_name+' is not in the VCAP_SERVICES, did you forget to bind it?');
  }
}

//service_url = 'https://stream.watsonplatform.net/text-to-speech-beta/api';
//service_username = '4026ff1d-9764-44ba-b7bb-85c0cec410a9';
//service_password = 'uYZrBKMGUScc';



// Add the test route
app.get('/hello', function(req, res) {
	res.send('hello world');
});



// Add a route to synthesize
var url;
app.get('/synthesize', function(req, res) {
	var phrase = req.query.phrase;
	console.log('phrase:' + phrase);
	var options = {
         url: service_url + '/v1/synthesize',
         method: 'GET',
         qs: {
         	'accept': 'audio/wav',
         	//'text': 'hello world its me Watson'
         	'text': phrase
         },
         auth: {
           'user': service_username,
           'password': service_password
         }
    };
	var transcript = request(options);
	transcript.on('response', function(response) {
    	response.headers['content-disposition'] = 'attachment; filename=transcript.wav';
    	console.log(response.headers);
    });
   transcript.pipe(res);
   
});


// Start the server
app.listen(port);
console.log('listening at:', port);
