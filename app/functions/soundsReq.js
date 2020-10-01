var path = require('path');
const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require('./functions')
module.exports = function(app) {





    app.post('/allSounds', fx.isLoggedIn, async function(req, res) {


        keyword = req.body.keyword;
        if (!keyword) keyword = "";

        array_out = [];

        try {

            var acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });


            if (!offset) {
                return res.sed({
                    isError: true,
                    msg: "Parameter error"
                })
            }


            if (keyword.trim() == "") {


                [_query, w] = await acon.execute("select * from sound_section ");




                array_out = [];
                array_out2 = []

                for (i in _query) {

                    //echo $row['section'];
                    //echo "select * from sound where section ='".$row['section']."' ";

                    //remove limit from here when implement pagination
                    [query1, f1] = await acon.execute("select * from sound where section = ? limit 30", [_query[i].id]);
                    array_out1 = []

                    for (j in query1) {

                        array_out1.push({
                            "id": query1[j]['id'],

                            "audio_path": {
                                "mp3": query1[j]['id'] + ".mp3",
                                "acc": query1[j]['id'] + ".aac"
                            },
                            "sound_name": query1[j]['sound_name'],
                            "description": query1[j]['description'],
                            "section": query1[j]['section'],
                            "thum": config.apiUrl + query1[j]['thum'],
                            "created": query1[j]['created'],
                        });
                    }





                }


                res.send({ isError: false, msg: array_out1 })



            } else {




                [_query, w] = await acon.execute("select * from sound_section ");




                array_out2 = [];

                for (var i in _query) {


                    [query1, f1] = await acon.execute("select * from sound where section = ? and (sound_name like '%" + keyword + "%' or description like '%" + keyword + "%')  limit 15 ", [_query[i].id]);
                    array_out1 = []
                    for (j in query1) {


                        array_out1.push({
                            "id": query1[j]['id'],

                            "audio_path": {
                                "mp3": query1[j]['id'] + ".mp3",
                                "acc": query1[j]['id'] + ".aac"
                            },
                            "sound_name": query1[j]['sound_name'],
                            "description": query1[j]['description'],
                            "section": query1[j]['section'],
                            "thum": config.apiUrl + query1[j]['thum'],
                            "created": query1[j]['created'],
                        });
                    }




                }


                res.send({ isError: false, msg: array_out1 })
















            }











        } catch (e) {
            console.log(e)
        }


























    })







    app.post('/mark-s-fav', fx.isLoggedIn, async function(req, res) {








        fb_id = req.user.id;
        sound_id = req.body.sound_id;
        fav = req.body.fav;

        try {


            if (fb_id && sound_id) {
                var acon = await amysql.createConnection({
                    host: config.host,
                    user: config.user,
                    password: config.password,
                    database: config.database
                });



                if (fav == "1") {
                    [q, f] = await acon.execute("insert into fav_sound (fb_id, sound_id) values(?, ?)", [fb_id, sound_id])

                    res.send({ code: "200", msg: { response: "successful" } })
                } else if (fav == "0") {
                    [q, f] = await acon.execute("Delete from fav_sound where fb_id = ? and sound_id = ?", [fb_id, sound_id])

                    res.send({ code: "200", msg: { response: "successful" } })
                } else {
                    res.send({ code: "201", msg: { response: "problem" } })

                }











            } else {


                res.send({ code: "201", msg: { response: "params insuffucuent" } })

            }

















        } catch (e) {
            res.send({ code: "201", msg: { response: "problem" } })

            console.log(e)

        }
















    })




    app.post('/fav-sound', fx.isLoggedIn, async function(req, res) {





        fb_id = req.user.id;

        if (!req.body.offset) {
            return res.send({
                isError: true,
                msg: "Error"
            })
        }

        offset = req.body.offset
        try {


            if (fb_id) {
                var acon = await amysql.createConnection({
                    host: config.host,
                    user: config.user,
                    password: config.password,
                    database: config.database
                });



                array_out1 = [];
                [q, f] = await acon.execute("select * from fav_sound where fb_id = ?", [fb_id])


                for (i in q) {
                    [q1, f] = await acon.execute("select * from sound where id = ? offset = ? limit = 30", [q[i].sound_id, offset])

                    array_out1.push({
                        "id": q1[0].id,

                        "audio_path": {
                            "mp3": q[i]['sound_id'] + ".mp3",
                            "acc": q[i]['sound_id'] + ".aac"
                        },
                        "sound_name": q1[0].sound_name,
                        "description": q1[0].description,
                        "section": q1[0].section,
                        "thum": config.apiUrl + q1[0].thum,
                        "created": q1[0].created,

                    })




                }















                return res.send({ isError: false, msg: array_out1 })











            } else {


                res.send({
                    isError: false,
                    msg: "Parameters error"
                })

            }

















        } catch (e) {
            res.send({ isError: true, msg: "Some problem occured" })

            console.log(e)

        }
















    })







};