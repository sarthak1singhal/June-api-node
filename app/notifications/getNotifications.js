const https = require('request')

const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);

module.exports = {



    getNotifications: async function(req, res) {
        fb_id = req.query.fb_id;


        if (fb_id) {
            array_out = [];

            try {

                const acon = await amysql.createConnection({
                    host: config.host,
                    user: config.user,
                    password: config.password,
                    database: config.database
                });



                [_query, f] = await acon.execute("select * from notification where effected_fb_id=? order by id desc ", [fb_id])

                for (i in _query) {
                    [rd, f1] = await acon.execute("select * from users where fb_id= ?", [_query[i].fb_id]);
                    [rd1, f1] = await acon.execute("select * from videos where id=? ", [_query[i].value]);

                    array_out.push({
                        "fb_id": _query[i]['fb_id'],
                        "fb_id_details": {
                            "first_name": rd[0].first_name,
                            "last_name": rd[0].last_name,
                            "profile_pic": rd[0].profile_pic,
                            "username": rd[0].username,
                            "verified": rd[0].verified,
                        },

                        "effected_fb_id": _query[i]['effected_fb_id'],
                        "type": _query[i]['type'],
                        "value": _query[i]['value'],
                        "value_data": {
                            "id": rd1[0].id,
                            "video": rd1[0].video,
                            "thum": rd1[0].thum,
                            "gif": rd1[0].gif
                        },
                        "created": _query[i]['created']
                    })
                }


                res.send({ code: "200", msg: array_out })











            } catch (e) {
                console.log(e)
            }


        } else {
            res.send(

                {

                    code: 201,

                    msg: { response: "Json Parem are missing" }

                })
        }
    }



};