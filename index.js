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
const config = readJson(`config.json`);


const users = {}
const userNames = {}
var myId;
var myName;
var con = require('./params.js')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var MySQLStore = require('express-mysql-session')(session);

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


var dateFormat = require('dateformat');
var now = new Date();

app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');

app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));






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
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session














require('./app/routes.js')(app, passport);
require('./app/authentication/login')(app, passport);
require('./app/authentication/auth_fb')(app, passport);
require('./app/authentication/change_password')(app, passport);

require('./app/discover/search')(app, passport);
require('./app/home/showAllVideosReq')(app, passport);
require('./app/functions/showVideoComments')(app);
require('./app/functions/soundsReq')(app);
require('./app/profile/profileReq')(app);
require('./app/profile/edit_profile')(app);

require('./app/profile/follow_user')(app);
require('./app/functions/postComment')(app);
require('./app/functions/reportVideo')(app);
require('./app/functions/delete_updateVIew')(app);

require('./app/notifications/getNotifications')(app);
require('./app/functions/likeDislikeVideo')(app);

require('./app/upload_fetch')(app, passport);
require('./app/profile/getUploadUrl')(app, passport);
require('./app/admin/manageTags')(app, passport);

require('./app/admin/soundUpload')(app, passport);
require('./app/admin/reportedVideos')(app, passport);
require('./app/admin/stickers_upload')(app, passport);
require('./app/admin/verifyUser')(app, passport);
require('./app/bots/getDetails')(app, passport);
require('./app/transactions/createorder')(app, passport);
require('./app/transactions/reedemdiamonds')(app, passport);
require('./app/transactions/verifypayment')(app, passport);
require('./app/transactions/trackpayment')(app, passport);

/*app.listen(80, function() {
    console.log("Srrefsns jf jd fs");
});
*/
app.listen(8080, function() {
    console.log("Srrefsns jf jd fs");
});