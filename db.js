//var http = require('http');
const mongoose = require('mongoose');
//const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');
/*
var uristring = process.env.MONGOLAB_URI ||
	process.env.MONGOHO_URL ||
	'mongodb://localhost/HelloMongoose';
var theport = process.env.PORT || 5000;
*/
const User = new mongoose.Schema({
	name: String,
	password: String,
	rating: Number
});

const Meal = new mongoose.Schema({
	chef: String,
	mealName: String,
	mealPrice: Number,
	extraDetails: String,
	cuisine: String,
	delivery: Boolean,
	deliveryDetails: String
});

User.plugin(passportLocalMongoose);

mongoose.model('User', User);
mongoose.model('Meal', Meal);
//*
if(process.env.NODE_ENV === 'PRODUCTION') {
	var fs = require('fs');
	var path = require('path');
	var fn = path.join(__dirname, 'config.json');
	var data = fs.readFileSync(fn);

	var conf = JSON.parse(data);
	var dbconf = conf.dbconf;
}
else {
	dbconf = 'mongodb://localhost/chefy';
}

mongoose.connect(dbconf);
//*/
/*
mongoose.connect(uristring, function (err, res) {
	if (err) {
		console.log('ERROR connecting to: ' + uristring + '. '  err);
	}
	else {
		console.long('Succeeded to connect to : " + uristring);
		}
	});
*/
