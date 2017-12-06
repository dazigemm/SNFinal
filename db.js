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

var uristring = process.env.MONGODB_URI ||
	'mongodb://localhost/chefy';

var theport = process.env.PORT || 5000;

mongoose.connect(uristring, function (err, res) {
	if (err) {
		console.log('ERROR connecting to: ' + uristring + '- ' + err);
	}
	else {
		console.log('Succeeded connected to: ' + uristring);
	}
});
