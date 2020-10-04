// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');
var con = require('../../params.js')
const fx = require('./functions')

module.exports = function(app) {



    app.post("/delete-video", fx.isLoggedIn, (req, res) => {


        fb_id = req.user.id
        id = req.body.video_id
        if (!id) {

            return res.send({
                isError: true,
                msg: "Invalid parameters"
            })
        }

        //delete gif and video files

        con.query("select * from videos where id = ?", [id], function(e, r) {


            if (e)
                return res.send({ isError: true, msg: "Some error occured" })

            if (r[0].fb_id != fb_id) {

                return res.send({ isError: true, msg: "Cannot delete. Some error occured" });
            }






            con.query("delete from videos where id = ?", [id], function(ee, rr) {})


            con.query("delete from video_like_dislike where video_id = ?", [id], function(ee, rr) {})

            con.query("delete from video_comment where video_id = ?", [id], function(ee, rr) {})


            return res.send({ isError: false, msg: "Deleted Successfully" })
        })




    })


















    app.post("/updateVideoView", fx.isLoggedIn, (req, res) => {


        id = req.body.video_id
        if (!id) {

            return res.send({
                isError: true,
                msg: "Invalid parameters"
            })
        }


        if (id) {
            con.query("update videos set `view` = `view` + 1 where id = ?", [id], function(er, row) {


                return res.send({
                    isError: false,
                    msg: "success"
                })


            })

        } else {

            return res.send({
                isError: true,
                msg: "Json Parem are missing updateVideoVIew"
            })

        }




    })











};