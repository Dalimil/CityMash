"use strict";

const express = require('express');
const Cookies = require('cookies');
const bodyParser = require('body-parser'); // additional body parsing
const morgan = require('morgan'); // General request logger
const path = require('path'); // path.join
const pp = (s) => path.join(__dirname, s);
const app = express();
const server = require('http').createServer(app); // or https
const config = require('./config');
const session = require('./session');
const fs = require('fs');
const data = JSON.parse(fs.readFileSync(pp('data/cities-filtered.json')));
const cityImages = JSON.parse(fs.readFileSync(pp('data/cities-images.json')));
const cities = [];
// console.log(data.gb);
// Initialize cities
Object.keys(data).forEach(countryKey => {
	let countryCities = data[countryKey];
	countryCities.forEach(city => {
		let x = city;
		x.country = countryKey;
		cities.push(x);
	});
});

// Pug template engine - previously Jade - http://jade-lang.com/
app.set('views', 'views'); // where templates are located
app.set('view engine', 'pug'); // Express loads the module internally

app.use(Cookies.express());
// Add top-level (could be made route-specific) parsers that will populate request.body
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json

app.use(morgan('dev')); // Set up logger
const debug = require('./utils/debug'); // + my own logger
app.use(debug.requestInfo); // Middleware function - Order/Place of call important!
// app.use('/articles', requestInfo); // Works but messes up request URLs - /articles/id -> /id

// Expose urls like /static/images/logo.png 
app.use('/static', express.static(pp('public'))); // first arg could be omitted

app.get('/', function(req, res) {
	// res.json({ user: 'john' }); // Send json response
	// res.sendFile( __dirname + "/" + "index.html" );
	// Now render .pug template with any JSON locals/variables:
	session.init(req.cookies);
	console.log("-");
	let favs = session.getFav(req.cookies);
	console.log(favs);
	res.render('index', { favs:  favs } );
});

app.get('/play', function(req, res) {
	session.clear(req.cookies);
	res.render('browse');
});

app.get('/browse', function(req, res) {
	session.clear(req.cookies);
	res.render('browse');
});

app.get('/city', function(req, res) {
	let seen = session.getSeen(req.cookies);

	if(seen == undefined) {
		res.send("Not Initialized");
		return;
	}
	let notSeen = new Array(cities.length).fill().map((v, i) => i).filter(x => seen.indexOf(x) < 0);
	let nxtIndex = getRandomIntIncl(0, notSeen.length - 1);
	session.addSeen(req.cookies, nxtIndex);
	console.log(nxtIndex);

	let city = cities[nxtIndex];
	city.img = chooseRandom(cityImages[city.name], 9, 6);
	let favs = session.getFav(req.cookies);
	city.favedBefore = (favs[city.name] != undefined);
	res.json(city);
});

app.post('/fav', function(req, res) {
	session.updateFav(req.cookies, req.body);
	res.send("ok");
});

app.get('/refresh', function(req, res) {
	let seen = session.getSeen(req.cookies);
	
	let city = cities[seen[seen.length -1]];
	city.img = chooseRandom(cityImages[city.name], 9, 6);
	let favs = session.getFav(req.cookies);
	city.favedBefore = (favs[city.name] != undefined);
	res.json(city);
});

server.listen(config.PORT, function() {
	var host = server.address().address;
	var port = server.address().port;
	// console.log(app.get('env'));
	console.log("Server dir: " + pp('/'));
	console.log((new Date()).toLocaleTimeString() + " - Server running at http://localhost:" + port);
});

function chooseRandom(ar, rangeIncl, count) {
	if(ar == undefined) {
		return new Array(count).fill({"small": "http://www.novelupdates.com/img/noimagefound.jpg"});
	}
	let aCopy = ar.slice();
	for(let i=0; i<count; i++) {
		let choice = getRandomIntIncl(i, rangeIncl);
		let tmp = aCopy[i];
		aCopy[i] = aCopy[choice];
		aCopy[choice] = tmp;
	}
	return aCopy.slice(0, count);
}

function getRandomIntIncl(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}