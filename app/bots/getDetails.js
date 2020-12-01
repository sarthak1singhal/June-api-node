// app/routes.js

var con = require('../../params.js')
const jwt = require('jsonwebtoken');
const readJson = require("r-json")
const config = readJson(`config.json`);

const client = require('../authentication/initRedis')

var fx = require("../functions/functions")
const jwt_refresh_expiration = 60 * 60 * 24 * 30;
const axios = require('axios');

var uniqid = require('uniqid');

const acon = require('../../initSql')

module.exports = function(app, passport) {





    app.post('/auth-bot', async function(req, res, next) {


        console.log(req.body)
        if (!req.body.email) {
            return res.send({
                isError: true,
                message: "Invalid credentials"
            })
        }






        email = req.body.email.trim().toLowerCase()



        username = email.split("@")[0];
        if (!username) {
            username = req.body.f_name;

        }

        username = username.replace(" ", "");


        con.query("select * from users where email = ?", [email], async function(e, r) {
            if (e)
                console.log(e);
            let uuid = uniqid();
            if (r.length == 0) {

                let data = [];
                while (data.length != 1) {

                    new_username = fx.username_append(username);
                    if (new_username) {
                        let [r2, f] = await acon.query("select * from users where username = ?", [new_username]);

                        if (r2.length == 0) {


                            if (!data.includes(new_username)) {

                                data.push(new_username);

                            }
                        }
                    }


                }


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














    });



    app.post("/admin-updateVideoView", fx.isLoggedIn, (req, res) => {


        var num = req.body.num;
        var vids = req.body.vids;



        con.query("update videos set `view` = `view` + " + num + " where isAvailable = 1 order by rand() limit ?", [vids], function(e, r) {


            if (e) {
                return res.send({
                    isError: true,
                    msg: e
                })

            }
            return res.send({
                isError: false,
                msg: "Done"
            })


        })








    })



    app.post("/updateNewVideoView", fx.isLoggedIn, (req, res) => {


        var num = req.body.num;
        var vids = req.body.vids;



        con.query("update videos set `view` = `view` + " + num + " where isAvailable = 1 and view < 600 order by rand() limit ?", [vids], function(e, r) {


            if (e) {
                return res.send({
                    isError: true,
                    msg: e
                })

            }
            return res.send({
                isError: false,
                msg: "Done"
            })


        })








    })





    app.post("/admin-addlike", fx.isLoggedIn, (req, res) => {


        var num = req.body.num;
        var vids = req.body.vids;



        con.query("update videos set `like` = `like` + " + num + " where isAvailable = 1 order by rand() limit ?", [vids], function(e, r) {


            if (e) {
                return res.send({
                    isError: true,
                    msg: e
                })

            }
            return res.send({
                isError: false,
                msg: "Done"
            })


        })








    })





    app.post("/inc-likes-new-videos", fx.isLoggedIn, (req, res) => {


        var num = req.body.num;
        var vids = req.body.vids;



        con.query("update videos set `like` = `like` + " + num + " where isAvailable = 1 and like < 40 order by rand() limit ?", [vids], function(e, r) {


            if (e) {
                return res.send({
                    isError: true,
                    msg: e
                })

            }
            return res.send({
                isError: false,
                msg: "Done"
            })


        })








    })







};