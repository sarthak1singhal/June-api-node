var path = require('path');
const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require("../functions/functions");
const uploadUrl = require("../functions/functions");
const Hashids = require('hashids/cjs')
const hashids = new Hashids()
module.exports = function(app) {










    app.post('/sound-upload-url', fx.isLoggedIn, async function(req, res) {








        var fileName = new Date().getTime().toString();


        var sound = fileName + ".mp3";

        var thumb = fileName + ".png";






        var p = {
            region: config.mumbai_bucket_region,
            bucket: config.bucket_name,
            path: "sounds/" + sound

        }
        var t = {
            region: config.mumbai_bucket_region,
            bucket: config.bucket_name,
            path: "sounds/" + thumb

        }
        var x = await fx.generateUploadSignedUrl(p);

        var y = await fx.generateUploadSignedUrl(t);


        return res.send({
            soundUrl: x,
            thumbUrl: y,
            audioPath: "sounds/" + fileName,
            thumb: "sounds/" + thumb
        })
    })




    app.post("/soundInsert", fx.isLoggedIn, async function(req, res) {






        try {
            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });

            var [vv, svs] = await acon.execute("insert into sound (sound_name,description,audioPath ,thum, section, priority)values(?,?,?,?,?,?)", [req.body.sound_name, "", req.body.audioPath, req.body.thum, "", req.body.priority]);

            return res.send({
                isError: false
            })

        } catch (e) {

        }




        return res.send({
            isError: true
        })








    })





    app.post("/change-sound-priority", fx.isLoggedIn, async function(req, res) {






        try {
            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });

            var [vv, svs] = await acon.execute("update sound set priority = ? where id = ?", [req.body.priority, req.body.id]);

            return res.send({
                isError: fakse
            })

        } catch (e) {

        }
        return res.send({
            isError: true
        })












    })





};