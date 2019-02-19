/*
	Notes:
	- When you create the app, disable create client secret.
	- https://medium.com/@prasadjay/amazon-cognito-user-pools-in-nodejs-as-fast-as-possible-22d586c5c8ec
*/

//Include api modules.
const http       = require('http');
const express    = require('express');
const bodyParser = require('body-parser');

//Get routes
const routes = require('./routes.js');

//Start Express-js
const app    = express();
const server = http.createServer(app);

//Add bodyparser and CORS.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Start the server.
try{

  //Listen mode.
  app.listen(8080,'127.0.0.1',()=>{
  	console.log('Server running');
  });

  //Assign routes controller.
  app.use('/auth',routes);

} catch(err){
 
  console.log('error',err);

}

const onClose = ()=>{
	process.exit();
}

//Handle process server.
process.on('SIGTERM', onClose);
process.on('SIGINT',  onClose)
process.on('uncaughtException', onClose);