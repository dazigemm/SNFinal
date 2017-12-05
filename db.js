const mongoose = require('mongoose');
//const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');

const User = new mongoose.Schema({
	name: String,
	password: String
});

User.plugin(passportLocalMongoose);

mongoose.model('User', User);

mongoose.connect('mongodb://localhost/chefy');
