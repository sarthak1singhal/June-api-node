// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var connection = require('../params');
  // expose this function to our app using module.exports
module.exports = function(passport) {
 
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
 
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {

         connection.query("SELECT * FROM allusers WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
         });
  
    });

 
    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {


            var f_name = req.body.f_name;
            var l_name = req.body.l_name;

            if(f_name == undefined) f_name = "Sarthak";
            if(l_name == undefined) l_name = "Singhal"
            var email = req.body.email;
            var password = req.body.password;
            var password_confirmation = req.body.password_confirmation;

            var access = "influencer";
            if(req.body.access!=undefined)
            {
                access = req.body.access
            }

          
            
            connection.query("SELECT * FROM allusers WHERE email = ?",[email], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That email is already exist.'));
                } else {
                    var newUserMysql = {
                        username: username,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    console.log(newUserMysql);
                    var insertQuery = "INSERT INTO allusers ( f_name, l_name, email, password, access, mailVerified ) values (?,?,?,?,?,?)";
                    connection.query(insertQuery,[f_name, l_name,email,newUserMysql.password, access, 0],function(err, rows) {

                        if(err)
                        {
                            console.log(err.message)
                        }
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                      
                   
                 }
            });
                 
            
         })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy(
            
            {
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password,  done, isChecked) { // callback with email and password from our form
            console.log(req.body, 'us body')
            connection.query("SELECT * FROM allusers WHERE email = ?",[username], function(err, rows){
                if (err){
                 
                    console.log(err)
                    return done(err);
                }if (rows.length==0) {
                    console.log("length")
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password)){
 
                    console.log(req.flash('loginMessage'))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                
                }
                // all is well, return successful user

                console.log("LOFIN")
                return done(null, rows[0]);
            });
         })
    );



  







 




  
};
  