const mongoose = require('mongoose');
//const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');

const User = new mongoose.Schema({
	name: String,
	password: String
});

const Meal = new mongoose.Schema({
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
/*
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
*/
mongoose.connect('mongodb://localhost/chefy');//dbconf);
