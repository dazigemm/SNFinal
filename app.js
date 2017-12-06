// app.js
const express = require('express');
const app = express();

const path = require('path');

const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

app.set('view engine', 'hbs');
//*
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

const session = require('express-session');
const sessionOptions = {
	secret: 'super secret',
	resave: true,
	saveUnitialized: true
};
app.use(session(sessionOptions));

require('./db');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Meal = mongoose.model('Meal');

const passport = require('passport');
/*
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());
*/

const herokuStrategy = require('passport-heroku').Strategy;
const HEROKU_CLIENT_ID = process.env.HEROKU_CLIENT_ID;
const HEROKU_CLIENT_SECRET = process.env.HEROKU_CLIENT_SECRET;

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(new HerokuStrategy({
	clientID: HEROKU_CLIENT_ID,
	clientSecret: HEROKU_CLIENT_SECRET,
	callbackURL: "http://127.0.0.1:3000/auth/heroku/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			return done(null, profile);
		});
	}
));

app.get('/auth/heroku/callback',
	passport.authenticate('heroku', {failureRedirect: '/login'}),
	function(req,res) {
		res.redirect('/');
	});
/* *** */

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
app.post('/sell', function(req,res) {
	//console.log(req.body.mealName);
	var dBoo = req.body.delivery;
	if (dBoo == 'yes') {
		dBoo = true;
	}
	else {
		dBoo = false;
	}
	//console.log("user name: " + req.user);
	new Meal({
		chef: req.user.username,
		mealName: req.body.mealName,
		mealPrice: req.body.mealPrice,
		extraDetails: req.body.extraDetails,
		cuisine: req.body.cuisine,
		delivery: dBoo,
		deliveryDetails: req.body.deliveryDetails
	}).save(function(err, meal, count) {
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
	res.send('thank you for your input');
});
/****************************************************************/

app.listen(process.env.PORT || 5000);//3000);
//console.log('Started server on port 3000');
