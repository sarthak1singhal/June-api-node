const https = require('request')

const amysql = require('mysql2/promise');
const { query } = require('../../params');
readJson = require("r-json");
const config = readJson(`config.json`);

module.exports = {


    my_FavSound: async function(req, res) {

        fb_id = req.query.fb_id;

        try {


            if (fb_id && sound_id) {
                fav = req.query.fav;
                const acon = await amysql.createConnection({
                    host: config.host,
                    user: config.user,
                    password: config.password,
                    database: config.database
                });



                array_out1 = [];
                [q, f] = await acon.execute("select * from fav_sound where fb_id = ?", [fb_id])


                for (i in q) {
                    [q1, f] = await acon.execute("select * from soubd where id = ?", [q[i].sound_id])

                    array_out1.push({
                        "id": q1[0].id,

                        "audio_path": {
                            "mp3": q[i]['sound_id'] + ".mp3",
                            "acc": q[i]['sound_id'] + ".aac"
                        },
                        "sound_name": q1[0].sound_name,
                        "description": q1[0].description,
                        "section": q1[0].section,
                        "thum": q1[0].thum,
                        "created": q1[0].created,

                    })




                }















                res.send({ code: "200", msg: array_out1 })











            } else {


                res.send({ code: "201", msg: { response: "params insuffucuent" } })

            }

















        } catch (e) {
            res.send({ code: "201", msg: { response: "problem" } })

            console.log(e)

        }



    },























    fav_sound: async function(req, res) {

        fb_id = req.query.fb_id;
        sound_id = req.query.sound_id;

        try {


            if (fb_id && sound_id) {
                fav = req.query.fav;
                const acon = await amysql.createConnection({
                    host: config.host,
                    user: config.user,
                    password: config.password,
                    database: config.database
                });



                if (fav == "1") {
                    [q, f] = await acon.execute("insert into fav_sound(fb_id,sound_id)values(?,?)", [fb_id, sound_id])

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



    },







    allSounds: async function(req, res) {
        fb_id = req.query.fb_id;

        keyword = req.query.keyword;
        if (!keyword) keyword = "";

        if (fb_id) {
            array_out = [];

            try {

                const acon = await amysql.createConnection({
                    host: config.host,
                    user: config.user,
                    password: config.password,
                    database: config.database
                });




                if (keyword.trim() == "") {


                    [_query, w] = await acon.execute("select * from sound_section ");




                    array_out = [];
                    array_out2 = []

                    for (i in _query) {

                        //echo $row['section'];
                        //echo "select * from sound where section ='".$row['section']."' ";

                        //remove limit from here when implement pagination
                        [query1, f1] = await acon.execute("select * from sound where section = ? limit 15", [_query[i].id]);
                        array_out1 = []

                        for (j in query1) {
                            [log_in_rs, f] = await acon.execute("select * from fav_sound WHERE fb_id=? and sound_id = ?", [fb_id, query1[j].id]);
                            CountFav = log_in_rs.length;
                            if (CountFav == "") {
                                CountFav = "0";
                            }
                            array_out1.push({
                                "id": query1[j]['id'],

                                "audio_path": {
                                    "mp3": query1[j]['id'] + ".mp3",
                                    "acc": query1[j]['id'] + ".aac"
                                },
                                "sound_name": query1[j]['sound_name'],
                                "description": query1[j]['description'],
                                "section": query1[j]['section'],
                                "thum": query1[j]['thum'],
                                "created": query1[j]['created'],
                                "fav": CountFav
                            });
                        }

                        if (array_out1.length != 0) {
                            array_out2.push({
                                    "section_name": _query[j]['section_name'],
                                    "sections_sounds": array_out1
                                }

                            );
                        }



                    }


                    res.send({ code: "200", msg: array_out2 })



                } else {




                    [_query, w] = await acon.execute("select * from sound_section ");




                    array_out2 = [];

                    for (i in _query) {


                        [query1, f1] = await acon.execute("select * from sound where section = ? and (sound_name like '%" + keyword + "%' or description like '%" + keyword + "%')  limit 10 ", [_query[i].id]);
                        console.log(query1, "nhhhh")
                        array_out1 = []
                        for (j in query1) {
                            [log_in_rs, f] = await acon.execute("select * from fav_sound WHERE fb_id=? and sound_id = ?", [fb_id, query1[j].id]);
                            CountFav = log_in_rs.length;
                            if (CountFav == "") {
                                CountFav = "0";
                            }

                            array_out1.push({
                                "id": query1[j]['id'],

                                "audio_path": {
                                    "mp3": query1[j]['id'] + ".mp3",
                                    "acc": query1[j]['id'] + ".aac"
                                },
                                "sound_name": query1[j]['sound_name'],
                                "description": query1[j]['description'],
                                "section": query1[j]['section'],
                                "thum": query1[j]['thum'],
                                "created": query1[j]['created'],
                                "fav": CountFav
                            });
                        }

                        if (array_out1.length != 0) {
                            array_out2.push({
                                    "section_name": _query[j]['section_name'],
                                    "sections_sounds": array_out1
                                }

                            );
                        }



                    }


                    res.send({ code: "200", msg: array_out2 })
















                }











            } catch (e) {
                console.log(e)
            }


        } else {
            res.send(

                {

                    code: 201,

                    msg: { response: "Json Pcarem are missing" }

                })
        }
    }



};