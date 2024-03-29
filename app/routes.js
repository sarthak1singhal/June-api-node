// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');
var con = require('../params.js')

const { v4: uuidv4 } = require('uuid');

var bcrypt = require('bcrypt-nodejs');
var reportVideo = require('./functions/reportVideo.js');
const { version } = require('os');


var showMyAllVideos = require('./profile/showMyAllVideos.js')
var discover = require('./discover/discover')
var likeDislikeVideo = require('./functions/likeDislikeVideo')

var profile = require('./profile/profile')

var getNotifications = require('./notifications/getNotifications');
readJson = require("r-json");
const config = readJson(`config.json`);

module.exports = function(app, passport) {

    app.post('/index', (req, res) => {


        console.log(req.body, "this is body")
        if (req.query.p) {
            var p = req.query.p;


            if (p != "uploadVideo") {
                // req.query = req.body;

                // req.body = {}
            }




            if (p == "try_con") {
                return res.send({ message: "working" })
            } else
            if (p == "showAllVideos") {
                showAllVideos.showAllVideos(req, res);
            } else if (p == "updateVideoView") {
                updateVideoView(req, res);

            } else if (p == "get_user_data") {
                return profile.get_user_data(req, res);
            } else if (p == "DeleteSound") {
                return DeleteSound(req, res);
            } else if (p == "DeleteVideo") {
                return DeleteVideo(req, res);
            } else if (p == "post_language") {
                return post_language(req, res);
            } else if (p == "editSoundSection") {
                return editSoundSection(req, res);
            } else if (p == "getNotifications") {
                return getNotifications.getNotifications(req, res); //not done 
            } else {
                return res.send({
                    isError: true,
                    message: "method " + p + "unavailable "
                })
            }



        }




    });


































};






function updateVideoView(req, res) {

    id = req.query.id;

    if (id) {
        con.query("update videos set `view` = `view` + 1 where id = ?", [id], function(er, row) {


            res.send({
                isError: false,
                msg: "success"
            })


        })

    } else {

        res.send({
            isError: true,
            msg: "Json Parem are missing updateVideoVIew"
        })

    }

}






function DeleteVideo(req, res) {



    fb_id = req.user.id
    id = req.body.id
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




}



function post_language(req, res) {

    fb_id = req.query.fb_id;
    _language = req.query.language

    if (fb_id && _language) {

        con.query("update users set content_language = ? where fb_id = ?", [_language.toLowerCase(), fb_id], function(e, r) {

            console.log("LANGUAGE SAVEs")

        })
    } else {
        console.log("NOR SAVED LANGUAFA")
    }

    res.send({ code: 200 });



}



function editSoundSection() {
    id = req.query.id;

    if (!id) id = ""
    section = req.query.section_name;

    if (!section) section = "";

    if (id.trim() != "" && section.trim() != "") {
        con.query("update sound_section set section_name = ? where id = ?", [section, id], function(e, r) {

            res.send({ code: "200", msg: "updated" })

        })
    }
}


function DeleteSound(req, res) {

    id = req.query.id


    //delete the sound file
    if (!id) {
        id = ""
        res.send({ code: "201", msg: "ERROR" })

        return;
    }

    if (id.trim() != "") {

        con.query("delete from sound where id = ?", [id], function(e, r) {})


        con.query("delete from fav_sound where sound_id = ?", [id], function(e, r) {})

        con.query("update videos set sound_id = ? where sound_id = ?", ['0', id], function(e, r) {
            if (e) console.log(e)

            else {

                res.send({ code: "200", msg: { response: "video unlike" } })


            }
        })


    } else {
        res.send({ code: "201", msg: "ERROR delete sound" })
    }


}