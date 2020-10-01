// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');

var con = require('../../params.js')
const fx = require('../functions/functions')

module.exports = function(app) {

    app.post('/edit-profile', fx.isLoggedIn, async function(req, res) {
        fb_id = req.user.fb_id;
        first_name = req.body.full_name;
        username = req.body.username;
        gender = req.body.gender;
        bio = req.body.bio;
        if (!bio) bio = " ";
        if (!gender) gender = " ";

        if (!first_name) {
            return res.send({
                isError: true,
                msg: "First name is missing "
            })
        }

        var last_name;
        if (first_name.split(" ").length > 1) {

            for (let i = 1; i < first_name.split(" ").length; i++) {
                last_name = last_name + first_name.split(" ")[i] + " ";
            }

            last_name = last_name.trim()

        } else {
            last_name = " ";
        }



        if (fb_id && first_name && username) {



            con.query("update users SET first_name =? , last_name =? , gender = ?, bio =?  , username = ?  WHERE fb_id = ? ", [first_name, last_name, gender, bio, username, fb_id], function(erri, r) {



                if (erri) {
                    console.log(erri)

                    res.send({
                        isError: true,

                        msg: "Problem in updating"
                    })

                } else {


                    con.query("select * from users where fb_id = ?", [fb_id], function(error, row) {

                        if (row.length != 0) {


                            array_out = {

                                first_name: row[0].first_name,
                                username: row[0].username,
                                verified: row[0].verified,

                                "last_name": row[0].last_name,
                                "gender": row[0].gender,
                                "bio": row[0].bio
                            }


                            res.send({

                                isError: true,
                                msg: array_out

                            })

                        }



                    })


                }






            })




        } else {
            res.send(

                {

                    isError: true,

                    msg: "Parameters are missing"

                })
        }

    })












};