// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');
const acon = require('../../async_sql.js');
readJson = require("r-json");
const config = readJson(`config.json`);

module.exports = {



    discover: async function(req, res) {

        arr_out = []


        fb_id = req.body.fb_id;

        if (!fb_id)
            fb_id = " "
        if (fb_id) {



            q = "Select * from videos where section = ? order by rand() limit 4"
            v = []

            try {


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
                                    "description": "null",
                                    "thum": "null",
                                    "section": "null",
                                    "created": "null",

                                }

                            } else {
                                console.log(query112)
                                smap = {
                                    "id": query112[0].id,
                                    "audio_path": {
                                        "mp3": query112[0].id + ".mp3", //complete sound path here
                                        "acc": query112[0].id + ".aac"
                                    },
                                    "sound_name": query112[0].sound_name,
                                    "description": query112[0].description,
                                    "thum": config.apiUrl + query112[0].thum,
                                    "section": query112[0].section,
                                    "created": query112[0].created,

                                }
                            }





                            arr.push({
                                "id": row_posts[j]['id'],
                                "fb_id": row_posts[j]['fb_id'],
                                "user_info": {
                                    "fb_id": query1[0].fb_id,
                                    "first_name": query1[0].first_name,
                                    "last_name": query1[0].last_name,
                                    "profile_pic": query1[0].profile_pic,
                                    "username": query1[0].username,
                                    "verified": query1[0].verified,
                                    "gender": query1[0].gender,
                                    "created": query1[0].created,
                                },
                                "count": {
                                    "like_count": row_posts[j]['like'],
                                    "video_comment_count": countcomment[0]['count'],
                                    "view": row_posts[j]['view'],

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

                if (arr.length != 0) {
                    arr_out.push({
                        section_name: rows[j].section_name,
                        section_videos: arr
                    })
                }


            } catch (e) {
                console.log(e);
            }


            res.send({ code: "200", msg: arr_out })


        } else {
            res.send(

                {

                    code: 201,

                    msg: { response: "Json Parem are missing" }

                })
        }

    },








};