// app/routes.js
var uuid = require('uuid');
const https = require('request')
const jwt = require('jsonwebtoken');

var path = require('path');
const axios = require('axios');
readJson = require("r-json");
const config = readJson(`config.json`);
const client = require('../authentication/initRedis')
const AWS = require('aws-sdk');

module.exports = {



    sendNotification: function(data) {

        headers = {
            "authorization": "key=" + config.fcmKey,
            'cache-control': "no-cache",
            'content-type': "application/json",
            'postman-token': "85f96364-bf24-d01e-3805-bccf838ef837"
        }
        axios.post('https://fcm.googleapis.com/fcm/send', data, headers)
            .then(function(response) {
                // handle success
                console.log(response, "is response");
            })
            .catch(function(error) {
                // handle error
                // console.log(error, "error");
            })

    },




    sendEmail: async function(html, subject, to) {
        let transporter = nodemailer.createTransport({
            name: "www.elysionsoftwares.com",
            host: "smtp.hostinger.in",
            port: 587,
            secure: false, // use SSL
            auth: {
                user: "info@elysionsoftwares.com", // generated ethereal user
                pass: "Elysion@123", // generated ethereal password
            },

        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Elysion" <info@elysionsoftwares.com>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: html
        }, (error, info) => {

            if (error) {
                console.log(error)
                return;
            }
            console.log('Message sent successfully!');
            console.log(info);
            transporter.close();
        });

    },
    refresh_token: (len) => {
        var text = "";
        var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < len; i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));

        return text;
    },

    username_append: (username) => {
        var text = "";
        var charset = "0123456789";
        for (var i = 0; i < Math.floor(Math.random() * 4); i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));


        var text2 = "";
        var charset2 = "abcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < Math.floor(Math.random() * 3); i++)
            text += charset2.charAt(Math.floor(Math.random() * charset2.length));

        u_name = username + text + text2;
        if (u_name.length > 30) {
            u_name = new Date().getTime().toString();
        }



        return u_name;
    },


    isLoggedIn: (req, res, next) => {

        let token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['token'] || req.cookies.access_token;
        let refreshtoken = req.headers['refresh_token'] || req.cookies.refresh_token;

        if (token && refreshtoken) {

            try {
                jwt.verify(token, config.jwt_secret, (e, authData) => {
                    console.log(authData, "OUTSIDE");



                    if (e) {

                        console.log(e, "ERROR\n");
                        if (e.name === "TokenExpiredError") {

                            authData = jwt.verify(token, config.jwt_secret, { ignoreExpiration: true });

                            console.log(authData);
                            client.GET(authData.id, (err, result) => {



                                console.log(result, " RESULT");

                                if (err) {
                                    return res.sendStatus(500);

                                }
                                if (!result) {
                                    return res.sendStatus(403);

                                }
                                result = JSON.parse(result);

                                if (refreshtoken != result.refresh_token) {


                                    return res.sendStatus(403);

                                }


                                let time = Math.round(new Date().getTime() / 1000);

                                console.log(result.expires, "EXPIRY");
                                console.log(time, "CURRENT TIME");
                                //parseInt()
                                if (result.expires < time) {


                                    console.log("NEED A NEW REFRESH TOKEN");

                                    let refresh_token = getRefreshTok(64);

                                    res.cookie("refresh_token", refresh_token, {
                                        // secure: true,
                                        httpOnly: true
                                    });

                                    let refresh_token_maxage = Math.round(new Date().getTime() / 1000) + jwt_refresh_expiration;
                                    client.set(authData.id,
                                        JSON.stringify({
                                            refresh_token: refresh_token,
                                            expires: refresh_token_maxage
                                        }), (ee, rr) => {
                                            console.log(ee)
                                        }
                                    );

                                }


                                console.log("NEED A NEW ACCESS TOKEN");

                                let token = jwt.sign({ id: authData.id, access: authData.access, email: authData.email }, config.jwt_secret, {
                                    expiresIn: '30s'
                                });
                                // Again, let's assign this token into httpOnly cookie.
                                res.cookie("access_token", token, {
                                    // secure: true,
                                    httpOnly: true
                                });

                                req.user = authData;

                                return next()


                            })


                        } else {

                            return res.sendStatus(403);

                        }
                    } else {

                        console.log("CONTINUE WITHOUT NEW ACCESS TOKEN")

                        console.log("PASSED");


                        req.user = authData;
                        return next()

                    }

                });

                // handle token here


            } catch (err) {

                console.log(err)
                return res.sendStatus(403)
            }
        } else {
            return res.sendStatus(403)

        }

    },


    logOutFromAllDevices: (userId) => {
        client.del(userId, (er, rr) => {

            if (er) console.log(er);
        });


    },





    generateUploadSignedUrl: function(params) {
        let { region, bucket, path, expires = 3 * 60, acl = 'private', contentType = 'application/octet-stream', accessKeyId = config.awsAccessKey, secretAccessKey = config.awsSecretKey } = params


        const S3 = new AWS.S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            region: region,
            s3ForcePathStyle: true,
            signatureVersion: 'v4'
        })
        const Params = { Bucket: bucket, Key: path, Expires: expires, ACL: acl, ContentType: contentType };
        return new Promise(function(resolve, reject) {
            S3.getSignedUrl('putObject', Params, function(err, url) {
                if (err) {
                    resolve(err);
                } else {
                    resolve(url);
                }
            });
        })

    }

    ,

    getImageUrl: function(url) {


        if (!url) {
            return null;
        }
        if (url.toString().contains("facebook")) {
            return url;
        } else {
            return config.cdnUrl + url;
        }

    }




};



function getRefreshTok(len) {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0@#%ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}