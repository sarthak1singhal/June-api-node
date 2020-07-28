var express = require('express');
var http = require('http');
var path = require('path');
var nodemailer = require('nodemailer');
 
const { v4: uuidv4 } = require('uuid');
 var bodyParser = require('body-parser');
var app = express();
var fs = require('fs')
 const fileType = require('file-type')
 const readJson = require("r-json");
var dateTime = require('node-datetime');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
var siofu = require("socketio-file-upload");
const config = readJson(`config.json`);

const io = require('socket.io')(4000)
var socketFile = express()
    .use(siofu.router)
    .listen(8000);
const users = {}
const userNames = {}
 var myId ;
var myName;
var con = require('./params.js')
var session  = require('express-session');
var cookieParser = require('cookie-parser');
 var morgan = require('morgan'); 
var passport = require('passport');
var flash    = require('connect-flash');
var MySQLStore = require('express-mysql-session')(session);

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var dateFormat = require('dateformat');
var now = new Date();

app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');

app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));



 


const siteTitle ="Applicatoin";
const baseURL = "http://localhost:3000/";
var options = {
  host: config.host,
  port: 3306,
  user: config.user,
  password: config.password,
  database: config.database
  };

var sessionStore = new MySQLStore(options);

app.use(session({
  key: 'session_cookie_name',
   store: sessionStore,
	secret: config.secret,
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
 
 
 

 
 
 

 

 
 
 

require('./app/routes.js')(app, passport); 
 
 
  app.listen(3000,function(){
    console.log("Srrefsns jf jd fs");
});