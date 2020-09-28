// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');
var con = require('../../params.js');
const { language } = require('googleapis/build/src/apis/language');
const { map } = require('jquery');
//var async = require("async");
const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);


module.exports = {



    showAllVideos: function(req, res) {


        fb_id = req.query.fb_id;
        action = req.query.action;
        _language = req.query.language;


        if (!fb_id) fb_id = " "
        console.log("SHOW ALL VIDEOS")
        video_id = req.query.video_id
        if (fb_id) {
            showVideos(fb_id, action, _language, video_id, res);


            /*  if (!_language) {
                con.query("select * from users where id= ?", [fb_id], function(e, r) {
                    if (r.length != 0) {
                        _language = r[0].language.toLowerCase();
                    } else {
                        _language = "";
                    }

                    showVideos(fb_id, action, _language, video_id, res);


                })

            } else {
                showVideos(fb_id, action, _language, video_id, res);

            }
*/





        } else {
            res.send({ code: 201, response: "error" });

        }




    }



};



async function showVideos(fb_id, action, language, video_id, res) {
    if (video_id) {

        hmap = {};
        con.query("select * from videos where id= ?", [video_id], function(e, r) {

            if (e) {
                console.log(e, "ShowAllVIdeos. 75")

                res.send({ code: 200, msg: "error" })
            } else {


                i = 0
                console.log(i)
                con.query("select * from users where fb_id= ?", [r[i].fb_id], function(e1, r1) {
                    if (e1) console.log(e1)

                    con.query("select * from sound where id = ?", [r[0].sound_id], function(e2, r2) {
                        i = 0

                        if (e2) console.log(e2)

                        con.query("SELECT SUM(action) as count, SUM(dislike) as dislike, SUM(report) as report from video_like_dislike where video_id= ?", [r[i].id], function(e3, r3) {
                            if (e3) console.log(e3, "90");

                            con.query("SELECT count(*) as count from video_comment where video_id= ?", [r[0].id], function(e4, r4) {

                                if (e4) console.log(e4)

                                con.query("SELECT count(*) as count from video_like_dislike where video_id= ? and fb_id= ? ", [r[i].id, fb_id], function(e5, r5) {
                                    if (e5) console.log(e5)

                                    console.log(r2, "r2")


                                    smap = {};
                                    if (r2.length == 0) {

                                        smap = {
                                            "id": null,
                                            "audio_path": {
                                                "mp3": null, //complete sound path here
                                                "acc": null
                                            },
                                            "sound_name": null,
                                            "description": null,
                                            "thum": null,
                                            "section": null,
                                            "created": null,

                                        }

                                    } else {
                                        smap = {
                                            "id": r2[0].id,
                                            "audio_path": {
                                                "mp3": config.apiUrl + r2[0].id + ".mp3", //complete sound path here
                                                "acc": config.apiUrl + r2[0].id + ".aac"
                                            },
                                            "sound_name": r2[0].sound_name,
                                            "description": r2[0].description,
                                            "thum": config.apiUrl + r2[0].thum,
                                            "section": r2[0].section,
                                            "created": r2[0].created,

                                        }
                                    }
                                    hmap = [{
                                        "id": r[i]['id'],
                                        "fb_id": r[i]['fb_id'],
                                        "user_info": {
                                            "first_name": r1[0].first_name,
                                            "last_name": r1[0].last_name,
                                            "profile_pic": r1[0].profile_pic,
                                            "username": r1[0].username,
                                            "verified": r1[0].verified,
                                        },
                                        "count": [{
                                            "like_count": r3[0]['like'],
                                            "video_comment_count": r4[0]['count']
                                        }],
                                        "liked": r5[0]['count'],
                                        "video": config.apiUrl + r[i]['video'],
                                        "thum": config.apiUrl + r[i]['thum'], //complete file path for the files
                                        "gif": config.apiUrl + r[i]['gif'],
                                        "description": r[i]['description'],
                                        "sound": smap,
                                        "created": r[i]['created']
                                    }];

                                    res.send({ code: 200, msg: hmap })

                                })

                            })
                        })

                    })

                })



            }



        })
    } else {

        if (language == "hindi" || language == "english") language = "";

        v = ["hindi", "english"]
        q = "Select * from videos where section = ? and (language = ? or language = ?) order by rand() limit 4";
        if (language != "") {
            q = "Select * from videos where section = ? and (language = ? or language = ? or language = ?)  order by rand() limit 4"
            v = ["hindi", "enlish", language]
        }

        try {
            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });

            hmap = {};
            arr = [];
            const [rows, fields] = await acon.execute("select * from discover_section order by value limit 20");
            for (i in rows) {


                v.unshift(rows[i].id)

                const [row_posts, fields] = await acon.execute(q, v);

                for (j in row_posts) {
                    [query1, f] = await acon.execute("select * from users where fb_id=? ", [row_posts[j].fb_id]);

                    [query112, f1] = await acon.execute("select * from sound where id= ?", [row_posts[j].sound_id]);


                    [countcomment, f] = await acon.execute("SELECT count(*) as count from video_comment where video_id=? ", [row_posts[j].id]);


                    [liked, f] = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id=? and fb_id= ?", [row_posts[j].id, row_posts[j].fb_id]);

                    score = 60 + row_posts[j]['like'] - 1.5 * row_posts[j]['unlike'] - 2 * row_posts[j]['report'];

                    if (row_posts[j] > 1000) {
                        score = row_posts[j]['like'] - 12 * row_posts[j]['report'] - 7 * row_posts[j]['unlike'];
                    } else if (row_posts[j]['view'] > 10000) {
                        score = row_posts[j]['like'] - 120 * row_posts[j]['report'] - 70 * row_posts[j]['unlike'];
                    }
                    if (score > 0) {
                        smap = {};
                        if (query112.length == 0) {

                            smap = {
                                "id": "null",
                                "audio_path": {
                                    "mp3": "null", //complete sound path here
                                    "acc": "null"
                                },
                                "sound_name": "null",
                                "description": null,
                                "thum": "null",
                                "section": "null",
                                "created": "null",

                            }

                        } else {
                            smap = {
                                "id": query112[0].id,
                                "audio_path": {
                                    "mp3": config.apiUrl + query112[0].id + ".mp3", //complete sound path here
                                    "acc": config.apiUrl + query112[0].id + ".aac"
                                },
                                "sound_name": query112[0].sound_name,
                                "description": query112[0].description,
                                "thum": config.apiUrl + config.apiUrl + query112[0].thum,
                                "section": query112[0].section,
                                "created": query112[0].created,

                            }
                        }





                        arr.push({
                            "id": row_posts[j]['id'],
                            "fb_id": row_posts[j]['fb_id'],
                            "user_info": [{
                                "first_name": query1[0].first_name,
                                "last_name": query1[0].last_name,
                                "profile_pic": query1[0].profile_pic,
                                "username": query1[0].username,
                                "verified": query1[0].verified,
                            }],
                            "count": {
                                "like_count": row_posts[j]['like'],
                                "video_comment_count": countcomment[0]['count']
                            },
                            "liked": liked[0]['count'],
                            "video": config.apiUrl + row_posts[j]['video'],
                            "thum": config.apiUrl + row_posts[j]['thum'],
                            "gif": config.apiUrl + row_posts[j]['gif'],
                            "description": row_posts[j]['description'],
                            "sound": smap,
                            "created": row_posts[j]['created']
                        });



                    }


                }






                v.shift();




            }

            res.send({ code: "200", msg: arr })

        } catch (e) {
            console.log(e)
        }

    }

}