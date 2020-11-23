// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');
var con = require('../../params.js')
const fx = require('./functions')

module.exports = function(app) {



    app.post("/reportVideo", fx.isLoggedIn, (req, res) => {


        fb_id = req.user.id;
        action = req.body.action;

        video_id = req.body.video_id
        if (fb_id && video_id && action) {


            con.query("select * from videos where id = ?", [video_id], function(e, r) {

                if (e) console.log(e)

                videoCreatorId = r[0].fb_id

                if (videoCreatorId != fb_id) {
                    if (action == "I don't like it") {
                        con.query("update videos set `unlike` = `unlike` + 1 where id = ?", [video_id], function(e1, r1) {

                            if (e1) console.log(e1);

                        });
                    } else {

                        con.query("insert into reportVideo (video_id,fb_id,video_creater_id,action) values (?,?,?,?)", [video_id, fb_id, videoCreatorId, action], function(err, row) {

                            if (err) console.log(err)

                            con.query("update videos set `report` = `report` + 1 where id = ?", [video_id], function(e2, r2) {

                                if (e2) console.log(e2);



                            })

                        })



                    }


                }






            })


            return res.send({ code: 200, response: "actions success" });

        } else {
            return res.send({ code: 201, response: "error" });

        }




    })



};