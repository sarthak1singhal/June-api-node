// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');
const axios = require('axios');
readJson = require("r-json");
const config = readJson(`config.json`);


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



        return username + text + text2;
    },








};