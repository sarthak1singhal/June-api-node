 var path = require('path');
 const config = readJson(`config.json`);
 const amysql = require('mysql2/promise');


 var con = require('../../params.js')
 const fx = require('../functions/functions')
 const multer = require("multer")
 var fs = require('file-system');

 const upload = multer({
     dest: path.join(__dirname, '../../upload')
         // you might also want to set some limits: https://github.com/expressjs/multer#limits
 });

 module.exports = function(app) {

     app.post('/edit-profile', fx.isLoggedIn, async function(req, res) {
         fb_id = req.user.id;
         first_name = req.body.full_name;
         full_name = req.body.full_name;

         username = req.body.username;
         gender = req.body.gender;
         bio = req.body.bio;
         if (!bio) bio = " ";
         if (!gender) gender = " ";

         if (!first_name) {
             return res.send({
                 isError: true,
                 msg: "First name is missing "
             })
         }

         var last_name;
         if (first_name.split(" ").length > 1) {

             first_name = full_name.split(" ")[0];

             for (let i = 1; i < first_name.split(" ").length; i++) {
                 last_name = last_name + first_name.split(" ")[i] + " ";
             }

             last_name = last_name.trim()

         } else {
             first_name = full_name;
             last_name = " ";
         }



         con.query("select * from users where username = ?", [username], function(e, r) {

             if (r.length != 0) {
                 return res.send({
                     isError: true,
                     "msg": "Username already exist"
                 })
             }


             con.query("update users SET first_name =? , last_name =? , gender = ?, bio =?  , username = ?  WHERE fb_id = ? ", [first_name, last_name, gender, bio, username, fb_id], function(erri, r) {



                 if (erri) {
                     console.log(erri)

                     res.send({
                         isError: true,

                         msg: "Problem in updating details"
                     })

                 } else {


                     con.query("select * from users where fb_id = ?", [fb_id], function(error, row) {

                         if (row.length != 0) {


                             array_out = {

                                 first_name: row[0].first_name,
                                 username: row[0].username,
                                 verified: row[0].verified,

                                 "last_name": row[0].last_name,
                                 "gender": row[0].gender,
                                 "bio": row[0].bio,
                                 "phoneNumber": row[0].phoneNumber,
                                 "dob": row[0].dob
                             }


                             res.send({

                                 isError: false,
                                 msg: array_out

                             })

                         }



                     })


                 }






             })


         })

     })






     app.post('/uploadProfileImage_app/', fx.isLoggedIn, upload.single("file"), async function(req, res) {


         var acon = await amysql.createConnection({
             host: config.host,
             user: config.user,
             password: config.password,
             database: config.database
         });



         if (!req.body.file) {
             return res.send({ isError: true, message: "Please upload a image" })
         } else {
             ext = path.extname(req.body.name).toLowerCase()
             if (ext == ".jpg" || ext == ".png" || ext == ".jpeg") {} else {
                 return res.send({ isError: true, message: "Please upload a product image in jpg, png or jpeg format" })

             }
         }




         try {


             [q, l] = await acon.execute("select * from users where fb_id = ?", [req.user.id]);







             console.log(q[0]);
             if (req.body.file) {
                 userme = q[0].first_name + "-" + q[0].last_name;
                 name = userme + "-" + Math.round(new Date().getTime() / 1000) +
                     path.extname(req.body.name).toLowerCase();


                 targetPath = path.join(__dirname, "../../upload/" + name);
                 var realFile = Buffer.from(req.body.file, "base64");


                 console.log(targetPath, "PATH")
                 fs.writeFileSync(targetPath, realFile);

                 //  fs.writeFileSync(name, realFile);


                 if (q[0].profile_pic) {

                     fname = q[0].profile_pic;

                     path0 = path.join(__dirname, "../../upload/" + fname);

                     fs.unlink(path0, function(e) {
                         console.log(e);
                     });


                 }

             } else {
                 return res.sen({ isError: true, message: "Failed" })
             }

             [q1, l1] = await acon.execute("update users set profile_pic = ? where fb_id = ?", [name, req.user.id]);


             res.send({
                 isError: false,
                 message: 'Uploaded Successfully',
                 data: config.baseUrl + "local/" + name
             })

         } catch (e) {
             console.log(e)
             res.send({ isError: true, message: e });
         }



     })






     app.post('/get-verified', fx.isLoggedIn, upload.single("file"), async function(req, res) {


         var acon = await amysql.createConnection({
             host: config.host,
             user: config.user,
             password: config.password,
             database: config.database
         });



         if (!req.body.file) {
             return res.send({ isError: true, message: "Please upload a image" })
         } else {
             ext = path.extname(req.body.name).toLowerCase()
             if (ext == ".jpg" || ext == ".png" || ext == ".jpeg") {} else {
                 return res.send({ isError: true, message: "Please upload a product image in jpg, png or jpeg format" })

             }
         }




         try {


             [q, l] = await acon.execute("select * from verification_request where fb_id = ?", [req.user.id]);







             console.log(q[0]);
             if (req.body.file) {
                 userme = q[0].first_name + "-" + q[0].last_name;
                 name = userme + "v" + Math.round(new Date().getTime() / 1000) +
                     path.extname(req.body.name).toLowerCase();


                 targetPath = path.join(__dirname, "../../upload/" + name);
                 var realFile = Buffer.from(req.body.file, "base64");


                 console.log(targetPath, "PATH")
                 fs.writeFileSync(targetPath, realFile);

                 if (q.length != 0)
                     if (q[0].attachment) {

                         fname = q[0].attachment;

                         path0 = path.join(__dirname, "../../upload/" + fname);

                         fs.unlink(path0, function(e) {
                             console.log(e);
                         });


                     }

             } else {
                 return res.sen({ isError: true, message: "Failed" })
             }


             if (q.length == 0) {
                 [q1, l1] = await acon.execute("insert into verification_request (attachment, fb_id) values (?,?)", [name, req.user.id]);

             } else
                 [q1, l1] = await acon.execute("update verification_request set attachment = ? where fb_id = ?", [name, req.user.id]);


             res.send({
                 isError: false,
                 message: 'Uploaded Successfully',
                 data: config.baseUrl + "local/" + name
             })

         } catch (e) {
             console.log(e)
             res.send({ isError: true, message: e });
         }



     })





 };