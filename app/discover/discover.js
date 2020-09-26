// app/routes.js
var uuid = require('uuid');
const https = require('request')

var path = require('path');
const amysql = require('mysql2/promise');
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




    SearchByHashTag: async function(req, res) {
        fb_id = req.query.fb_id;

        if (!fb_id) fb_id = ""

        tag = req.query.tag

        if (!tag) tag = ""

        token = req.query.token
        if (fb_id.trim() != "" && tag.trim() != "") {

            try {


                const acon = await amysql.createConnection({
                    host: config.host,
                    user: config.user,
                    password: config.password,
                    database: config.database
                });


                array_out = [];


                [row, ww] = await acon.execute("select * from videos where description like '%" + tag + "%' order by rand()");



                for (i in row) {

                    [rd, f] = await acon.execute("select * from users where fb_id= ? ", [row[i].fb_id]);

                    [rd12, f1] = await acon.execute("select * from sound where id= ? ", [row[i].sound_id]);

                    countLikes_count = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id=? ", [row[i].id]);

                    countcomment_count = await acon.execute("SELECT count(*) as count from video_comment where video_id=? ", [row[i].id]);


                    liked_count = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id= ? and fb_id= ? ", [
                        [row[i].id], fb_id
                    ]);

                    smap = {}
                    if (rd12.length == 0) {

                        smap = {
                            "id": "null",
                            "audio_path": {
                                "mp3": "null",
                                "acc": "null"
                            },
                            "sound_name": "null",
                            "description": "null",
                            "thum": "null",
                            "section": "null",
                            "created": "null",

                        }


                    } else {

                        smap = {
                            "id": rd12[0].id,
                            "audio_path": {
                                "mp3": rd12[0].id + ".mp3",
                                "acc": rd12[0].id + ".aac"
                            },
                            "sound_name": rd12[0].sound_name,
                            "description": rd12[0].description,
                            "thum": config.apiUrl + rd12[0].thum,
                            "section": rd12[0].section,
                            "created": rd12[0].created,

                        }
                    }


                    array_out.push(

                        {
                            "id": row[i]['id'],
                            "fb_id": row[i]['fb_id'],
                            "user_info": {
                                "first_name": rd[0].first_name,
                                "last_name": rd[0].last_name,
                                "profile_pic": rd[0].profile_pic,
                                "username": rd[0].username,
                                "verified": rd[0].verified,
                            },
                            "count": {
                                "like_count": countLikes_count[0]['count'],
                                "video_comment_count": countcomment_count[0]['count'],
                                "view": row[i]['view'],
                            },
                            "liked": liked_count[0]['count'],
                            "video": config.apiUrl + row[i]['video'],
                            "thum": config.apiUrl + row[i]['thum'],
                            "gif": config.apiUrl + row[i]['gif'],
                            "description": row[i]['description'],
                            "sound": smap,
                            "created": row[i]['created']
                        });

                }


                res.send({ code: 200, msg: array_out })


            } catch (e) {
                console.log(e)
            }

        } else {

            res.send({ code: "201", msg: "params not found" })

        }



    }





    ,
    search: async function(req, res) {
        _type = req.body.type;
        keyword = req.body.keyword;
        const acon = await amysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        });



        console.log(req.body);


        console.log(_type, " ", keyword, " DATA")
        if (_type && keyword) {
            try {

                if (_type == "video") {
                    [row, f] = await acon.execute("select * from videos where description like '%" + keyword + "%' order by rand() limit 15");
                    array_out = [];
                    for (i in row) {

                        [rd, f] = await acon.execute("select * from users where fb_id=? ", [row[i].fb_id]);

                        [rd12, f] = await acon.execute("select * from sound where id= ?", [row[i].sound_id]);

                        countLikes_count = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id= ? ", [row[i].id]);

                        countcomment_count = await acon.execute("SELECT count(*) as count from video_comment where video_id= ?", [row[i].id]);

                        liked_count = "0"
                        fb_id = req.query.fb_id
                        if (fb_id)
                            liked_count = await acon.execute("SELECT count(*) as count from video_like_dislike where video_id=? and fb_id= ? ", [row[i].id, fb_id]);


                        s = {};
                        if (rd12.length == 0) {
                            s = {
                                "id": "",
                                "audio_path": {
                                    "mp3": "", //complete sound path here
                                    "acc": ""
                                },
                                "sound_name": "",
                                "description": "",
                                "thum": "",
                                "section": "",
                                "created": "",

                            }
                        } else {
                            s = {
                                "id": rd12[0].id,
                                "audio_path": {

                                    "mp3": config.apiUrl + rd12[0].id + ".mp3",
                                    "acc": config.apiUrl + rd12[0].id + ".aac"
                                },
                                "sound_name": rd12[0].sound_name,
                                "description": rd12[0].description,
                                "thum": config.apiUrl + rd12[0].thum,
                                "section": rd12[0].section,
                                "created": rd12[0].created,
                            }
                        }


                        array_out.push({
                            "id": row[i]['id'],
                            "fb_id": row[i]['fb_id'],
                            "user_info": {
                                "first_name": rd[0].first_name,
                                "last_name": rd[0].last_name,
                                "profile_pic": rd[0].profile_pic,
                                "username": rd[0].username,
                                "verified": rd[0].verified,
                            },
                            "count": {
                                "like_count": countLikes_count[0]['count'],
                                "video_comment_count": countcomment_count[0]['count'],
                                "view": row[i]['view'],
                            },
                            "liked": liked_count[0]['count'],
                            "video": config.apiUrl + row[i]['video'],
                            "thum": config.apiUrl + row[i]['thum'],
                            "description": row[i]['description'],
                            "sound": s,
                            "created": row[i]['created'],
                        });

                    }

                    return res.send({
                        code: "200",
                        msg: array_out,
                        "type": _type
                    })
                } else if (_type == "users") {
                    [row, f] = await acon.execute("select * from users where first_name like '%" + keyword + "%' or last_name like '%" + keyword + "%' or username like '%" + keyword + "%'  limit 15 ");
                    array_out = [];
                    for (i in row) {
                        [query1, f] = await acon.execute("select * from videos where fb_id= ?", [row[i].fb_id]);
                        videoCount = query1.length;

                        array_out.push({
                            "fb_id": row[i]['fb_id'],
                            "username": row[i]['username'],
                            "verified": row[i]['verified'],
                            "first_name": row[i]['first_name'],
                            "last_name": row[i]['last_name'],
                            "gender": row[i]['gender'],
                            "profile_pic": row[i]['profile_pic'],
                            "block": row[i]['block'],
                            "version": row[i]['version'],
                            "device": row[i]['device'],
                            "signup_type": row[i]['signup_type'],
                            "created": row[i]['created'],
                            "videos": videoCount,
                        });

                    }

                    return res.send({ code: 200, msg: array_out, "type": _type })
                } else if (_type == "sound") {
                    [row1, f] = await acon.execute("select * from sound where sound_name like '%" + keyword + "%' or description like '%" + keyword + "%'  limit 15");
                    array_out1 = []
                    for (i in row1) {
                        [qrry, f] = await acon.execute("select * from fav_sound WHERE fb_id=? and sound_id =?", [fb_id, row1[i].id]);

                        CountFav = qrry.length;
                        if (CountFav == "") {
                            CountFav = "0";
                        }

                        array_out1.push({
                            "id": row1[i]['id'],

                            "audio_path": {
                                "mp3": row1[i]['id'] + ".mp3",
                                "acc": row1[i]['id'] + ".aac"
                            },
                            "sound_name": row1[i]['sound_name'],
                            "description": row1[i]['description'],
                            "section": row1[i]['section'],
                            "thum": config.apiUrl + row1[i]['thum'],
                            "created": row1[i]['created'],
                            "fav": CountFav

                        });
                    }

                    return res.send({ code: "200", msg: array_out1, "type": _type })
                }



                return res.send({
                    isError: true,
                    message: "Some Error"
                })
















            } catch (e) {
                console.log(e)
                return res.send({

                    isError: true,
                    message: "Invalid Params"
                });
            }

        } else {
            return res.send({

                isError: true,
                message: "Invalid Params"
            });
        }
    }



};