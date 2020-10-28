var path = require('path');
const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require("../functions/functions");
const uploadUrl = require("../functions/functions");
const Hashids = require('hashids/cjs')
const hashids = new Hashids()
module.exports = function(app) {





    app.post("/updateVideos", async function(req, res) {

        videoPath = req.body.videoPath;
        thumbPath = req.body.thumbPath;
        accessToken = req.body.thumbPath;
        currentPath = req.body.currentPath;
        console.log(req.body);
        console.log(config.lambda_access_token)

        if (accessToken != config.lambda_access_token) {
            console.log("unexqual");
            return res.send({
                isError: "Invalid access"
            })
        }

        try {
            var acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });


            var [upd, d] = acon.execute("update videos set video = ? where thum = ?, isAvailable = ? where video = ?", [videoPath, thumbPath, currentPath, 1]);

            console.log("UPDATED");

        } catch (e) {
            console.log(e);
            return res.send({
                "isError": true
            });
        }



    })






    app.post('/getUploadUrl', fx.isLoggedIn, async function(req, res) {



        var hashids = new Hashids(config.short_id_key);


        try {
            var acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });

            var [user, fields] = await acon.execute("SELECT * FROM users WHERE fb_id = ?", [req.user.id]);
            console.log(user);
            var id = hashids.encode(user.id);


            if (!id)
                id = (Math.random() * 1000).toString();

            var fileName = id + new Date().getTime().toString() + ".mp4";

            description = req.body.description;
            if (!description) description = "";
            sound_id = fileName;
            if (req.body.sound_id) {
                sound_id = req.body.sound_id;
            }


            var [ins, fields] = await acon.execute("insert into videos(description,video,sound_id,fb_id)values(?,?,?,?)", [description, "public/" + fileName, sound_id, req.user.id]);


        } catch (e) {
            console.log(e);

            return res.send({
                "msg": e
            })
        }



        var p = {
            region: config.mumbai_bucket_region,
            bucket: config.bucket_name,
            path: "public/" + fileName

        }
        var x = await fx.generateUploadSignedUrl(p);



        return res.send({
            url: x,
            fileName: fileName
        })
    })















};