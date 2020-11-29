var path = require('path');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require("../functions/functions");
const uploadUrl = require("../functions/functions");
const Hashids = require('hashids/cjs')
const hashids = new Hashids()
const acon = require('../../initSql')

module.exports = function(app) {










    app.post('/sticker-upload-url', fx.isLoggedIn, async function(req, res) {








        var fileName = new Date().getTime().toString();



        var thumb = fileName + ".png";






        var t = {
            region: config.mumbai_bucket_region,
            bucket: config.bucket_name,
            path: "stickers/" + thumb

        }

        var y = await fx.generateUploadSignedUrl(t);


        return res.send({
            stickerUrl: y,
            stickerPath: "stickers/" + thumb,
        })
    })




    app.post("/stickerInsert", fx.isLoggedIn, async function(req, res) {






        try {


            var [vv, svs] = await acon.query("insert into stickers (path, priority)values(?,?)", [req.body.path, req.body.priority]);

            return res.send({
                isError: false
            })

        } catch (e) {

        }




        return res.send({
            isError: true
        })








    })





    app.post("/change-sticker-priority", fx.isLoggedIn, async function(req, res) {






        try {


            var [vv, svs] = await acon.query("update stickers set priority = ? where id = ?", [req.body.priority, req.body.id]);

            return res.send({
                isError: fakse
            })

        } catch (e) {

        }
        return res.send({
            isError: true
        })












    })




    app.post("/get-stickers", async function(req, res) {






        try {
            const acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });

            var [vv, svs] = await acon.query("select * from stickers order by priority desc", );

            m = [];

            for (var i = 0; i < vv.length; i++) {

                let v = {
                    "url": vv[i].path
                }
                m.push(v)
            }
            return res.send({
                isError: false,
                msg: m

            })

        } catch (e) {

        }




        return res.send({
            isError: true
        })








    })





};