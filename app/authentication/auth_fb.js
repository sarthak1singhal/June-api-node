// app/routes.js

var con = require('../../params.js')
const jwt = require('jsonwebtoken');
const readJson = require("r-json")
const config = readJson(`config.json`);

const client = require('./initRedis')

var fx = require("../functions/functions")
const jwt_refresh_expiration = 60 * 60 * 24 * 30;
const axios = require('axios');

var uniqid = require('uniqid');

const amysql = require('mysql2/promise');

module.exports = function(app, passport) {





    app.post('/login-fb', async function(req, res, next) {
        console.log(req.body)

        if (!req.body.email) {
            return res.send({
                isError: true,
                message: "Invalid credentials"
            })
        }


        userToken = req.body['token']

        appLink = 'https://graph.facebook.com/oauth/access_token?client_id=' + config.clientId + '&client_secret=' + config.clientSecret + '&grant_type=client_credentials'

        userId = "";
        //appToken = requests.get(appLink).json()['access_token']
        axios.get(appLink)
            .then(function(response) {
                // handle success
                //    console.log(response, "is response");

                let appToken = response.data.access_token;
                let link = 'https://graph.facebook.com/debug_token?input_token=' + userToken + '&access_token=' + appToken

                axios.get(link)
                    .then(async function(response) {
                        // handle success
                        response.data = response.data.data;
                        console.log(response.data, " is response 2");
                        console.log(response.data.is_valid, " is response 2");
                        let user_id = response.data.user_id;



                        if (user_id) {
                            email = req.body.email.trim().toLowerCase()

                            /*
                             data: {
    app_id: '1194749257563443',
    type: 'USER',
    application: 'June Social',
    data_access_expires_at: 1606480674,
    expires_at: 1606289866,
    is_valid: true,
    issued_at: 1601105866,
    scopes: [ 'email', 'public_profile' ],
    user_id: '3180757235310807'
  }
                            */

                            username = email.split("@")[0];
                            if (!username) {
                                username = req.body.f_name;
                            }

                            let acon = await amysql.createConnection({
                                host: config.host,
                                user: config.user,
                                password: config.password,
                                database: config.database
                            });

                            let data = [];
                            while (data.length != 1) {

                                new_username = fx.username_append(username);
                                if (new_username) {
                                    let [r2, f] = await acon.execute("select * from users where username = ?", [new_username]);

                                    if (r2.length == 0) {


                                        if (!data.includes(new_username)) {

                                            data.push(new_username);

                                        }
                                    }
                                }


                            }
                            con.query("select * from users where email = ?", [email], function(e, r) {
                                if (e)
                                    console.log(e);
                                let uuid = uniqid();
                                if (r.length == 0) {
                                    con.query("insert into users (first_name, last_name,  email, fb_id,profile_pic,signup_type, username) values (?,?,?,?,?,?,?)", [req.body.f_name, req.body.l_name, email, uuid, req.body.profile_pic, req.body.signup_type, data[0]], function(e, row) {


                                        if (e) console.log(e)

                                        var d = {
                                            "id": uuid,
                                        }
                                        const token = jwt.sign(JSON.stringify(d), config.jwt_secret);


                                        refresh_token = "";







                                        refresh_token = fx.refresh_token(64);
                                        let refresh_token_maxage = Math.round(new Date().getTime() / 1000) + jwt_refresh_expiration;

                                        client.SET(d.id, JSON.stringify({
                                            refresh_token: refresh_token,
                                            expires: refresh_token_maxage
                                        }), (err, reply) => {

                                            if (err) {
                                                console.log(err);
                                                return;
                                            }

                                        })






                                        res.cookie("access_token", token, {
                                            // secure: true,
                                            httpOnly: true
                                        });
                                        res.cookie("refresh_token", refresh_token, {
                                            // secure: true,
                                            httpOnly: true
                                        });




                                        res.send({

                                            isError: false,
                                            first_name: req.body.f_name,
                                            last_name: req.body.l_name,
                                            isUsername: false,
                                            app_language: "english",
                                            email: req.body.email,
                                            token: token,
                                            refresh: refresh_token,
                                            uid: uuid,
                                            profile_pic: req.body.profile_pic

                                        });

                                    })
                                } else {
                                    user = r[0]


                                    var d = {
                                        "id": user.fb_id,
                                    }
                                    const token = jwt.sign(JSON.stringify(d), config.jwt_secret);


                                    refresh_token = "";




                                    client.GET(user.id, (err, reply) => {

                                        if (err) {
                                            console.log(err);
                                            res.sendStatus(500);
                                            return;
                                        }



                                        try {
                                            reply = JSON.parse(reply);

                                        } catch (_r) {

                                        }

                                        if (reply && reply.refresh_token) {

                                            refresh_token = reply.refresh_token;


                                        } else {


                                            refresh_token = fx.refresh_token(64);
                                            let refresh_token_maxage = Math.round(new Date().getTime() / 1000) + jwt_refresh_expiration;

                                            client.SET(user.id, JSON.stringify({
                                                refresh_token: refresh_token,
                                                expires: refresh_token_maxage
                                            }), (err, reply) => {

                                                if (err) {
                                                    console.log(err);
                                                    return;
                                                }

                                            })



                                        }



                                        res.cookie("access_token", token, {
                                            // secure: true,
                                            httpOnly: true
                                        });
                                        res.cookie("refresh_token", refresh_token, {
                                            // secure: true,
                                            httpOnly: true
                                        });


                                        let username = "";

                                        let isUsername = false;
                                        if (r[0].username) {

                                            username = r[0].username

                                            isUsername = true
                                        }

                                        return res.send({

                                            isError: false,
                                            first_name: r[0].first_name,
                                            last_name: r[0].last_name,
                                            gender: r[0].gender,
                                            block: r[0].block,
                                            email: r[0].email,
                                            profile_pic: r[0].profile_pic,
                                            app_language: r[0].app_language,
                                            token: token,
                                            refresh: refresh_token,
                                            isUsername: isUsername,
                                            username: username,
                                            uid: r[0].fb_id


                                        });



                                    })

                                }






                            })

                        } else {


                            return res.send({
                                isError: true,
                                message: "Account not verified"
                            })

                        }



                    })
                    .catch(function(error) {
                        // handle error
                        // console.log(error, "error");
                    });
            })
            .catch(function(error) {
                // handle error
                // console.log(error, "error");
            });














    });


























};