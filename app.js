// app.js
const express = require('express');
const app = express();

const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

app.set('view engine', 'hbs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

const session = require('express-session');
const sessionOptions = {
	secret: 'super secret',
	resave: true,
	saveUnitialized: true
};
app.use(session(sessionOptions));

// link db
require('./db');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Meal = mongoose.model('Meal');

// set up passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// to help with imgs
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
// prob not a good idea to store these images publically....
var storage = multer.diskStorage({
	destination: 'public/img/',
	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			if (err) return cb(err)
			cb(null, raw.toString('hex') + path.extname(file.originalname))
		})
	}
});
//const upload = multer({dest: 'uploads/'});
const upload = multer({storage: storage});
/* ********************* ROUTES *********************** */

app.get('/', function(req, res) {

	//res.send('hello');
	res.render('index', {user: req.user});
});

/************* User Authentication Stuff *****************/

app.get('/login', function (req, res) {
	res.render('login', {user: req.user});
});

app.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/');
});

app.get('/register', function(req, res) {
	res.render('register');
});

app.post('/register', function(req, res) {
	const pw = req.body.password;
	const name = req.body.username;
	User.register(new User({username: name}), pw, function(err, user) {
		if (err) {
			return res.render('register', {user: user});
		}
		passport.authenticate('local')(req, res, function () {
			res.redirect('/');
		});
	});
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

/*************************** Other Routes ************************/

// give chef form to post meal
app.get('/sell', function(req,res) {
	if (req.user === undefined) {
		res.render('login');
	//res.render('sell');

	}
	res.render('sell');
});

// save meal posted to db
app.post('/sell', upload.single('pic'), function(req,res) {
	//console.log(req.body.mealName);
	var dBoo = req.body.delivery;
	if (dBoo == 'yes') {
		dBoo = true;
	}
	else {
		dBoo = false;
	}
	//console.log("user name: " + req.user);
	//console.log("pic: " + req.file);
	//console.log("pic path: " + req.file.path);
	var newMeal = new Meal({
		chef: req.user.username,
		imgPath: req.file.path.replace(/\\/g,"/").substring(7),
		mealName: req.body.mealName,
		mealPrice: req.body.mealPrice,
		extraDetails: req.body.extraDetails,
		cuisine: req.body.cuisine,
		delivery: dBoo,
		deliveryDetails: req.body.deliveryDetails
	});
	//console.log(newMeal);
	newMeal.save(function(err, meal, count) {
		res.redirect('/buy');
	});
});

// find all meals and list them
app.get('/buy', function(req,res) {
	//res.render('sell');
	Meal.find(function(err, meals, count) {
		res.render('buy', {
			meals: meals
		});
	});
});

// for now, just show a confirmation message
app.post('/buy', function(req,res) {
	res.redirect('review');
});

app.get('/review', function(req, res) {
	res.render('review');
});

app.post('/review', function(req, res) {
	// save review under chef's rating?
	res.send('thank you for your input');
});
/****************************************************************/

app.listen(process.env.PORT || 5000);
//console.log('Started server on port 5000');
