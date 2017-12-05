// app.js
const express = require('express');
const app = express();

const path = require('path');

const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

app.set('view engine', 'hbs');
/*
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

require('./db');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.intialize());
app.use(passport.session());

/* *** */

app.get('/', function(req, res) {

	//res.send('hello');
	res.render('index', {greeting: 'salutations'});
});

app.get('/faq', function(req, res) {
	res.send('you has q, i has answer');
});

app.listen(3000);
console.log('Started server on port 3000');
