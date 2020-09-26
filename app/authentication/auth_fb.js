// app/routes.js

var con = require('../../params.js')
const jwt = require('jsonwebtoken');
const readJson = require("r-json")
const config = readJson(`config.json`);

const client = require('./initRedis')

var fx = require("../functions/functions")
const jwt_refresh_expiration = 60 * 60 * 24 * 30;
const axios = require('axios');



module.exports = function(app, passport) {





    app.post('/login-fb', function(req, res, next) {
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
                console.log(response, "is response");

                appToken = response.data.access_token;
                link = 'https://graph.facebook.com/debug_token?input_token=' + userToken + '&access_token=' + appToken

                axios.get(link)
                    .then(function(response) {
                        // handle success
                        console.log(response.data, " is response 2");

                        user_id = response.data.user_id;



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




        email = req.body.email.trim().toLowerCase()




        con.query("select * from users where email = ?", [email], function(e, r) {
            if (e)
                console.log(e);
            let uuid = uniqid();
            if (r.length == 0) {
                con.query("insert into users (first_name, last_name,  email, fb_id) values (?,?,?,?,?,?)", [req.body.f_name, req.body.l_name, req.body.email, uuid], function(e, row) {



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
                        uid: uuid

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










    });


























};