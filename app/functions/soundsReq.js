var path = require('path');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require('./functions')
const acon = require('../../initSql')

module.exports = function(app) {



    app.post('/allSounds', async function(req, res) {


        keyword = req.body.keyword;
        if (!keyword) keyword = "";


        if (req.body.offset == null) {
            return res.sed({
                isError: true,
                msg: "Parameter error"
            })
        }

        offset = req.body.offset

        array_out = [];

        try {





            if (keyword.trim() == "") {


                [query1, f1] = await acon.query("select * from sound limit ?, 20", [offset]);
                array_out1 = []

                for (j in query1) {

                    array_out1.push({
                        "id": query1[j]['id'],

                        "audio_path": {
                            "mp3": config.cdnUrl + query1[j]['audioPath'] + ".mp3",
                            "acc": config.cdnUrl + query1[j]['audioPath'] + ".aac"
                        },
                        "sound_name": query1[j]['sound_name'],
                        "description": query1[j]['description'],
                        "section": query1[j]['section'],
                        "thum": config.cdnUrl + query1[j]['thum'],
                        "created": query1[j]['created'],
                    });
                }





                res.send({ isError: false, msg: array_out1 })



            } else {


                [query1, f1] = await acon.query("select * from sound where (sound_name like '%" + keyword + "%' or description like '%" + keyword + "%')  limit ?, 20 ", [offset]);
                array_out1 = []
                for (j in query1) {


                    array_out1.push({
                        "id": query1[j]['id'],

                        "audio_path": {
                            "mp3": config.cdnUrl + query1[j]['audioPath'] + ".mp3",
                            "acc": config.cdnUrl + query1[j]['audioPath'] + ".aac"
                        },
                        "sound_name": query1[j]['sound_name'],
                        "description": query1[j]['description'],
                        "section": query1[j]['section'],
                        "thum": config.cdnUrl + query1[j]['thum'],
                        "created": query1[j]['created'],
                    });
                }


                res.send({ isError: false, msg: array_out1 })
















            }











        } catch (e) {
            console.log(e)
            res.send({
                isError: true,
                msg: "Some error"
            })
        }


























    })







    app.post('/mark-s-fav', fx.isLoggedIn, async function(req, res) {








        fb_id = req.user.id;
        sound_id = req.body.sound_id;
        fav = req.body.fav;

        try {


            if (fb_id && sound_id) {


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

        if (req.body.offset == null) {
            return res.send({
                isError: true,
                msg: "Error"
            })
        }

        offset = req.body.offset
        try {


            if (fb_id) {



                array_out1 = [];
                [q, f] = await acon.execute("select * from fav_sound where fb_id = ?", [fb_id])


                for (i in q) {
                    [q1, f] = await acon.execute("select * from sound where id = ? limit = ?, 30", [q[i].sound_id, offset])

                    array_out1.push({
                        "id": q1[0].id,

                        "audio_path": {
                            "mp3": config.cdnUrl + q[i]['audioPath'] + ".mp3",
                            "acc": config.cdnUrl + q[i]['audioPath'] + ".aac"
                        },
                        "sound_name": q1[0].sound_name,
                        "description": q1[0].description,
                        "section": q1[0].section,
                        "thum": config.cdnUrl + +q1[0].thum,
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