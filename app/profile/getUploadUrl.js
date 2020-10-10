var path = require('path');
const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);
const fx = require("../functions/functions");
const uploadUrl = require("../functions/functions");

module.exports = function(app) {










    app.post('/getUploadUrl', async function(req, res) {


        var p = {
            region: config.mumbai_bucket_region,
            bucket: config.bucket_name,
            path: "path"

        }
        var x = await fx.generateUploadSignedUrl(p);



        return res.send({
            url: x
        })






















    })















};