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

mongoose.connect('mongodb://localhost/chefy');
