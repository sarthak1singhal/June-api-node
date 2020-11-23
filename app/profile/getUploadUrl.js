var path = require('path');
const acon = require('../../async_sql.js');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require("../functions/functions");
const uploadUrl = require("../functions/functions");
const Hashids = require('hashids/cjs')
const hashids = new Hashids()
module.exports = function(app) {

    app.get("/", function(req, res) {

        return res.status(200).send({})
    })

    app.get("/index.html", function(req, res) {

        return res.status(200).sendFile(__dirname + '/test.html');

    })


    app.get("/health", function(req, res) {

        return res.status(200).send({})
    })



    app.get("/try", function(req, res) {

        return res.send({
            "isError": false
        });

    })



    app.post("/updateVideos", async function(req, res) {

        videoPath = req.body.videoPath;
        thumbPath = req.body.thumbPath;
        accessToken = req.body.accessToken;
        currentPath = req.body.currentPath;
        console.log(req.body);
        console.log(config.lambda_access_token)

        if (accessToken != config.lambda_access_token) {
            console.log("unequal");
            //return res.send({ isError: "Invalid access" })
        }

        try {



            var [upd, d] = await acon.execute("update videos set video = ?, thum = ?, isAvailable = ? where video = ?", [videoPath, thumbPath, 1, currentPath]);

            console.log("UPDATED");

        } catch (e) {
            console.log(e);
            return res.send({
                "isError": true
            });
        }



    })






    app.post('/getUploadUrl', fx.isLoggedIn, async function(req, res) {





        try {

            var [abc, fields] = await acon.execute("SELECT * FROM users WHERE fb_id = ?", [req.user.id]);
            var hashids = new Hashids(config.short_id_key);

            var id = hashids.encode(abc.id);



            console.log(id, "TJOS OS ID");
            if (!id) {
                id = Math.floor((Math.random() * 1000)).toString();

            }
            var fileName = id + new Date().getTime().toString();
            sound_id = fileName;

            fileName = fileName + ".mp4";
            console.log("id  = ", id);
            console.log("user id  = ", req.user.id);
            console.log("filename  = ", fileName);
            description = req.body.description;
            if (!description) description = "";
            console.log(req.body)
            if (req.body.sound_id) {
                sound_id = req.body.sound_id;
            }



            var [ins, fields] = await acon.execute("insert into videos(description,video,sound_id,fb_id)values(?,?,?,?)", [description, "public/" + fileName, sound_id, req.user.id]);

            if (req.body.hashtags) {

                var l = req.body.hashtags;
                for (var i = 0; i < l; i++) {

                    var [ex, aaelds] = await acon.execute("select * from discover_section where section_name = ?", [l[i]]);

                    if (ex.length == 0) {
                        var [sa, aaeldss] = await acon.execute("insert into discover_section (section_name) values (?)", [l[i]]);

                    }


                }

            }

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












    app.post('/getProfilePicUrl', fx.isLoggedIn, async function(req, res) {





        try {


            var fileName = req.user.id + ".png";

            //   var [ins, fields] = await acon.execute("insert into videos(description,video,sound_id,fb_id)values(?,?,?,?)", [description, "public/" + fileName, sound_id, req.user.id]);



        } catch (e) {
            console.log(e);

            return res.send({
                "msg": e
            })
        }



        var p = {
            region: config.mumbai_bucket_region,
            bucket: config.bucket_name,
            path: "profilePic/" + fileName


        }
        var x = await fx.generateUploadSignedUrl(p);




        return res.send({
            url: x,
            fileName: "profilePic/" + fileName,
            cdnurl: config.cdnUrl + "profilePic/" + fileName,

        })
    })



    app.post('/get-verification-docs-url', fx.isLoggedIn, async function(req, res) {





        try {


            var fileName = req.user.id + "_profile.png";

            var docName = req.user.id + "_doc.png";
            //   var [ins, fields] = await acon.execute("insert into videos(description,video,sound_id,fb_id)values(?,?,?,?)", [description, "public/" + fileName, sound_id, req.user.id]);







            var p = {
                region: config.mumbai_bucket_region,
                bucket: config.bucket_name,
                path: "verifies/" + req.user.id + "/" + fileName,

            }
            var x = await fx.generateUploadSignedUrl(p);


            var doc = {
                region: config.mumbai_bucket_region,
                bucket: config.bucket_name,
                path: "verifies/" + req.user.id + "/" + docName,

            }
            var docx = await fx.generateUploadSignedUrl(doc);




            return res.send({
                profile_url: x,
                doc_url: docx,
                profile_path: "verifies/" + req.user.id + "/" + fileName,
                document_path: "verifies/" + req.user.id + "/" + docName

            })





        } catch (e) {
            console.log(e);

            return res.send({
                "msg": e
            })
        }
    })



    app.post("/get-verified", fx.isLoggedIn, async function(req, res) {


        try {

            var [ins, fields] = await acon.execute("select * from verification_request where fb_id = ?", [req.user.id]);

            if (ins.length == 0) {
                var [vv, svs] = await acon.execute("insert into verification_request(profile,document,status,fb_id)values(?,?,?,?)", [req.body.profile_path, req.body.document_path, "Pending", req.user.id]);

            }

            return res.send({
                isError: false
            })

        } catch (e) {
            return res.send({
                isError: true,

            })
        }

    })


};