var path = require('path');
const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require("../functions/functions");
const uploadUrl = require("../functions/functions");
const Hashids = require('hashids/cjs')
const hashids = new Hashids()
module.exports = function(app) {


    app.post('/set-section-priority', fx.isLoggedIn, async function(req, res) {





        try {

            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });
            var [ins, fields] = await acon.execute("update discover_section set value = ? where section_name = ?", [req.body.priority, req.body.tag, ]);

            return res.send({
                isError: false,
            })

        } catch (e) {

            return res.send({
                isError: true

            })
        }



    })




    app.post('/set-section-thumbnail', fx.isLoggedIn, async function(req, res) {





        try {

            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });
            var [ins, fields] = await acon.execute("update discover_section set section_image = ? where section_name = ?", [req.body.imagePath, req.body.tag, ]);

            return res.send({
                isError: false,
            })

        } catch (e) {

            return res.send({
                isError: true

            })
        }



    })







    app.post('/get-section-thumb-url', fx.isLoggedIn, async function(req, res) {





        try {


            var fileName = req.body.section_name + ".png";



        } catch (e) {
            console.log(e);

            return res.send({
                "msg": e
            })
        }



        var p = {
            region: config.mumbai_bucket_region,
            bucket: config.bucket_name,
            path: "sections/" + fileName


        }
        var x = await fx.generateUploadSignedUrl(p);




        return res.send({
            url: x,
            fileName: "sections/" + fileName,
            cdnurl: config.cdnUrl + "sections/" + fileName,

        })
    })




};