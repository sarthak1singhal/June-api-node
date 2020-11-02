// app/routes.js
const https = require('request')

var con = require('../../params.js')
var bcrypt = require('bcrypt-nodejs');

var otpGenerator = require('otp-generator')


const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const readJson = require("r-json")
const config = readJson(`config.json`);
var uniqid = require('uniqid');

const crypto = require("crypto");
const client = require('./initRedis')
const amysql = require('mysql2/promise');

var fx = require("../functions/functions")
const jwt_refresh_expiration = 60 * 60 * 24 * 30;



module.exports = function(app, passport) {





    app.post('/login', function(req, res, next) {
        console.log("req.body")

        if (!req.body.email) {
            return res.send({
                isError: true,
                message: "Invalid credentials"
            })
        }
        if (!req.body.password) {
            return res.send({
                isError: true,
                message: "Invalid credentials"
            })
        }


        email = req.body.email.trim().toLowerCase()

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(String(email).toLowerCase())) {

            con.query("select * from users where username = ?", [email], function(e, r) {

                if (r.length == 0) {
                    return res.send({
                        isError: true,
                        code: 0,
                        message: "No account found with this username"
                    })
                }

                if (!bcrypt.compareSync(password, rows[0].password)) {
                    return res.send({
                        isError: true,
                        code: 1,
                        message: "Wrong Password"
                    })

                } else {

                    user = r[0]


                    var d = {
                        "id": user.fb_id,
                    }
                    const token = jwt.sign(JSON.stringify(d), config.jwt_secret);


                    refresh_token = "";




                    client.GET(user.id, (err, reply) => {

                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                            return;
                        }



                        try {
                            reply = JSON.parse(reply);

                        } catch (_r) {

                        }

                        if (reply && reply.refresh_token) {

                            refresh_token = reply.refresh_token;


                        } else {


                            refresh_token = fx.refresh_token(64);
                            let refresh_token_maxage = Math.round(new Date().getTime() / 1000) + jwt_refresh_expiration;

                            client.SET(user.id, JSON.stringify({
                                refresh_token: refresh_token,
                                expires: refresh_token_maxage
                            }), (err, reply) => {

                                if (err) {
                                    console.log(err);
                                    return;
                                }

                            })



                        }



                        res.cookie("access_token", token, {
                            // secure: true,
                            httpOnly: true
                        });
                        res.cookie("refresh_token", refresh_token, {
                            // secure: true,
                            httpOnly: true
                        });


                        let username = "";

                        let isUsername = false;
                        if (r[0].username) {

                            username = r[0].username

                            isUsername = true
                        }

                        return res.send({

                            isError: false,
                            first_name: r[0].first_name,
                            last_name: r[0].last_name,
                            gender: r[0].gender,
                            block: r[0].block,
                            email: r[0].email,
                            profile_pic: r[0].profile_pic,
                            app_language: r[0].app_language,
                            token: token,
                            refresh: refresh_token,
                            isUsername: isUsername,
                            username: username,
                            uid: r[0].fb_id

                        });



                    })





















                }


            })
        } else {
            con.query("select * from users where email = ?", [email], function(e, r) {




                if (r.length == 0) {
                    return res.send({
                        isError: true,
                        code: 0,
                        message: "This is not a registered email account"
                    })
                }
                if (r[0].signup_type == "facebook") {
                    return res.send({
                        isError: true,
                        code: 2,
                        message: "This account is linked with facebook"
                    })
                }



                if (!bcrypt.compareSync(password, rows[0].password)) {
                    return res.send({
                        isError: true,
                        code: 1,
                        message: "Wrong Password"
                    })

                } else {

                    user = r[0]


                    var d = {
                        "id": user.fb_id,
                    }
                    const token = jwt.sign(JSON.stringify(d), config.jwt_secret);


                    refresh_token = "";




                    client.GET(user.id, (err, reply) => {

                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                            return;
                        }



                        try {
                            reply = JSON.parse(reply);

                        } catch (_r) {

                        }

                        if (reply && reply.refresh_token) {

                            refresh_token = reply.refresh_token;


                        } else {


                            refresh_token = fx.refresh_token(64);
                            let refresh_token_maxage = Math.round(new Date().getTime() / 1000) + jwt_refresh_expiration;

                            client.SET(user.id, JSON.stringify({
                                refresh_token: refresh_token,
                                expires: refresh_token_maxage
                            }), (err, reply) => {

                                if (err) {
                                    console.log(err);
                                    return;
                                }

                            })



                        }



                        res.cookie("access_token", token, {
                            // secure: true,
                            httpOnly: true
                        });
                        res.cookie("refresh_token", refresh_token, {
                            // secure: true,
                            httpOnly: true
                        });


                        let username = "";

                        let isUsername = false;
                        if (r[0].username) {

                            username = r[0].username

                            isUsername = true
                        }

                        return res.send({

                            isError: false,
                            first_name: r[0].first_name,
                            last_name: r[0].last_name,
                            gender: r[0].gender,
                            block: r[0].block,
                            email: r[0].email,
                            profile_pic: r[0].profile_pic,
                            app_language: r[0].app_language,
                            token: token,
                            refresh: refresh_token,
                            isUsername: isUsername,
                            username: username,
                            uid: r[0].fb_id


                        });



                    })


























                }


            })
        }









    });



    app.post('/isEmailExist', async function(req, res, next) {
        console.log("req.body")

        if (!req.body.email) {
            return res.send({
                isError: true,
                code: 0,
                message: "Enter a email address"
            })
        }

        email = req.body.email.trim()

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(String(email).toLowerCase())) {

            return res.send({
                isError: true,
                code: 1,
                message: "Invalid email address"
            })
        }






        con.query("select * from users where email = ?", [email], function(e, r) {

            if (e) console.log(e);
            if (r.length == 0) {
                return res.send({
                    isError: false,
                    code: 3,
                    message: "No user found"
                })
            } else {

                return res.send({
                    isError: true,
                    code: 2,
                    message: "Email already registered"
                })

            }


        })






    });


    app.post('/isUsernameExist', async function(req, res, next) {
        console.log("req.body")

        if (!req.body.username) {
            return res.send({
                isError: true,
                message: "Enter a username"
            })
        }

        username = req.body.username.trim()


        try {

            let acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });



            let [r, f] = await acon.execute("select * from users where username = ?", [username])




            if (r.length == 0) {
                return res.send({
                    isError: false,
                    code: 0,
                    message: "No user found"
                })
            } else {


                let data = [];
                while (data.length != 4) {

                    new_username = fx.username_append(username);
                    let [r2, f] = await acon.execute("select * from users where username = ?", [new_username]);

                    if (r2.length == 0) {


                        if (!data.includes(new_username)) {

                            data.push(new_username);

                        }
                    }


                }



                return res.send({
                    isError: true,
                    code: 1,
                    data: data,
                    message: "Username already registered"
                })

            }





        } catch (e) {
            console.log(e)
        }








    });


    app.post('/isEmailorUsernameExist', async function(req, res, next) {
        console.log("req.body")

        if (!req.body.email) {
            return res.send({
                isError: true,
                message: "Enter a email address"
            })
        }

        email = req.body.email.trim()

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(String(email).toLowerCase())) {
            username = req.body.email.trim().toLowerCase()


            try {

                let acon = await amysql.createConnection({
                    host: config.host,
                    user: config.user,
                    password: config.password,
                    database: config.database
                });



                let [r, f] = await acon.execute("select * from users where username = ?", [username])




                if (r.length == 0) {
                    return res.send({
                        isError: true,
                        code: 0,
                        message: "No user found",
                        email: email
                    })
                } else {






                    return res.send({
                        isError: false,
                        code: 1,
                        message: "Username already registered",
                        email: email
                    })

                }





            } catch (e) {
                console.log(e)
            }


        }






        con.query("select * from users where email = ?", [email], function(e, r) {

            if (e) console.log(e)


            if (r.length != 0) {
                return res.send({
                    isError: true,
                    code: 0,
                    message: "No user found",
                    email: email
                })
            } else {

                return res.send({
                    isError: false,
                    code: 1,
                    message: "Email already registered",
                    email: email
                })

            }


        })






    });








    app.post('/send-otp', async function(req, res, next) {


        if (!req.body.email)

        {
            return (res.send({
                isError: true,
                message: "Enter Email"
            }))
        }
        if (!req.body.full_name)

        {
            return (res.send({
                isError: true,
                message: "Enter name"
            }))
        }


        if (!req.body.password) {
            return res.status(400).json({
                message: "Enter Password",
                isError: true
            });
        }

        if (req.body.password.trim().length < 8) {
            return res.status(400).json({
                message: "Password length is too short. Use 8 characters",
                isError: true
            });
        }

        req.body.email = req.body.email.trim()
        if (req.body.email.length > 50) {
            return (res.send({
                isError: true,
                message: "Email too long, make length less than 50 characters"
            }))
        }
        if (!req.body.number) {

            req.body.number = "";
        } else if ((req.body.number.length > 12 || req.body.number.length < 8) || isNaN(req.body.number.trim())) {
            console.log(req.body.number.length > 12 || req.body.number.length < 8);

            console.log("RANDI RANDI")
            console.log(isNaN(req.body.number.trim()));

            return res.send({
                isError: true,
                message: "Phone number is invalid"
            })

        }




        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(String(req.body.email).toLowerCase())) {
            return res.send({
                isError: true,
                message: "Invalid email"
            })
        }


        try {

            let acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });



            let [r, f] = await acon.execute("select * from users where email = ?", [req.body.email])

            if (r.length != 0) {
                return res.send({
                    isError: true,
                    message: "Email already exist"
                })
            }


            li = createNewOTP(req.body.email);

            sendOTPMail(li[1], req.body.email)

            return res.send({
                isError: false,
                message: "OTP Sent to your email",
                key: li[0],
                validInMin: 30
            })




        } catch (e) {
            console.log(e)
        }












    });





    app.post('/signup', function(req, res, next) {


        otp = req.body.otp;

        hash = req.body.key;
        console.log(req.body)

        if (!req.body.full_name) {
            return res.status(400).json({
                message: "Invalid Name",
                isError: true
            });
        }




        if (req.body.password.trim().length < 8) {
            return res.status(400).json({
                message: "Password length is too short. Use 8 characters",
                isError: true
            });
        }


        if (req.body.full_name.split(" ").length > 1) {
            req.body.f_name = req.body.full_name.split(" ")[0];

            req.body.l_name = " ";
            for (var i = 1; i < req.body.full_name.split(" ").length; i++) {
                req.body.l_name = req.body.l_name + " " + req.body.full_name.split(" ")[i];

            }
        } else {
            req.body.f_name = req.body.full_name;
            req.body.l_name = " ";

        }

        req.body.f_name = req.body.f_name.trim()

        req.body.l_name = req.body.l_name.trim()

        req.body.email = req.body.email.toLowerCase().trim();
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(String(req.body.email)))
            return res.status(400).json({
                message: "Email address is not valid",
                isError: true
            });


        isVerify = verifyOTP(req.body.email, req.body.hash, req.body.otp, res);

        if (!isVerify) {
            return res.send({
                isError: true,
                message: "OTP is invalid"
            })
        }

        if (!req.body.number) {

            console.log("NUMBER UNAVAILABLE");

            req.body.number = "";
        } else if ((req.body.number.length > 12 || req.body.number.length < 8) || isNaN(req.body.number.trim())) {

            console.log(req.body.number.length > 12 || req.body.number.length < 8);

            console.log(isNaN(req.body.number.trim()));

            console.log("LINE 833");
            return res.send({
                isError: true,
                message: "Phone number is invalid"
            })

        }





        con.query("select * from users where email = ?", [email], function(e, r) {

            if (r.length != 0) {
                return res.send({
                    isError: true,
                    code: 0,
                    message: "This email is already registered"
                })
            }

            password = bcrypt.hashSync(req.body.password, null, null)



            let uuid = uniqid();
            con.query("insert into users (first_name, last_name, password, email,phoneNumber, fb_id, signup_type) values (?,?,?,?,?,?)", [req.body.f_name, req.body.l_name, password, req.body.email, req.body.number, uuid, "manual"], function(e, row) {



                var d = {
                    "id": uuid,
                }
                const token = jwt.sign(JSON.stringify(d), config.jwt_secret);


                refresh_token = "";







                refresh_token = fx.refresh_token(64);
                let refresh_token_maxage = Math.round(new Date().getTime() / 1000) + jwt_refresh_expiration;

                client.SET(d.id, JSON.stringify({
                    refresh_token: refresh_token,
                    expires: refresh_token_maxage
                }), (err, reply) => {

                    if (err) {
                        console.log(err);
                        return;
                    }

                })






                res.cookie("access_token", token, {
                    // secure: true,
                    httpOnly: true
                });
                res.cookie("refresh_token", refresh_token, {
                    // secure: true,
                    httpOnly: true
                });




                res.send({

                    isError: false,
                    first_name: req.body.f_name,
                    last_name: req.body.l_name,
                    isUsername: false,
                    app_language: "english",
                    email: req.body.email,
                    token: token,
                    refresh: refresh_token,
                    uid: uuid

                });


















            })









        })














    });









    app.post('/saveUserName', fx.isLoggedIn, async function(req, res, next) {
        console.log("req.body")

        if (!req.body.username) {
            return res.send({
                isError: true,
                message: "Enter a username"
            })
        }

        username = req.body.username.trim().toLowerCase()


        try {

            let acon = await amysql.createConnection({
                host: config.host,
                user: config.user,
                password: config.password,
                database: config.database
            });



            let [r, f] = await acon.execute("select * from users where username = ?", [username])




            if (r.length == 0) {

                let [r, f] = await acon.execute("insert into users username = ? where id = ?", [username, req.user.id])



                return res.send({
                    isError: true,
                    code: 1,
                    data: data,
                    message: "Username Saved"
                })




            } else {


                let data = [];
                while (data.length != 4) {

                    new_username = fx.username_append(username);
                    let [r2, f] = await acon.execute("select * from users where username = ?", [new_username]);

                    if (r2.length == 0) {

                        data.push(new_username);

                    }


                }



                return res.send({
                    isError: true,
                    code: 1,
                    data: data,
                    message: "Username already registered"
                })

            }





        } catch (e) {
            console.log(e)
        }








    });














};



function createNewOTP(phone) {
    // Generate a 6 digit numeric OTP
    const otp = otpGenerator.generate(4, { alphabets: false, upperCase: false, specialChars: false });
    const ttl = 60 * 60 * 1000; //5 Minutes in miliseconds
    const expires = new Date().getTime() + ttl; //timestamp to 5 minutes in the future
    const data = `${phone}.${otp}.${expires}`; // phone.otp.expiry_timestamp
    const hash = crypto.createHmac("sha256", config.OTP_KEY).update(data).digest("hex"); // creating SHA256 hash of the data
    const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user
    // you have to implement the function to send SMS yourself. For demo purpose. let's assume it's called sendSMS
    //sendSMS(phone, `Your OTP is ${otp}. it will expire in 5 minutes`);
    return [fullHash, otp];
}

function verifyOTP(phone, hash, otp, res) {
    // Seperate Hash value and expires from the hash returned from the user
    let [hashValue, expires] = hash.split(".");
    // Check if expiry time has passed
    let now = new Date().getTime();
    if (now > parseInt(expires)) {

        li = createNewOTP(phone);

        sendOTPMail(li[1], phone)

        return res.send({
            isError: false,
            message: "Enter the new OTP sent to your mail",
            key: li[0],
            validInMin: 30
        })



    }
    // Calculate new hash with the same key and the same algorithm
    let data = `${phone}.${otp}.${expires}`;
    let newCalculatedHash = crypto.createHmac("sha256", config.OTP_KEY).update(data).digest("hex");
    // Match the hashes
    if (newCalculatedHash === hashValue) {
        return true;
    }
    return false;
}


async function sendOTPMail(otp, d) {
    let transporter = nodemailer.createTransport({
        name: "www.elysionsoftwares.com",
        host: "smtp.hostinger.in",
        port: 587,
        secure: false, // use SSL
        auth: {
            user: "info@elysionsoftwares.com", // generated ethereal user
            pass: "Elysion@123", // generated ethereal password
        },

    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Elysion" <info@elysionsoftwares.com>', // sender address
        to: d, // list of receivers
        subject: "Elysion OTP - " + otp, // Subject line
        text: otp + " is your one time password",
        // html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + url + ">Click here to verify</a>"
    }, (error, info) => {

        if (error) {
            console.log(error)
            return;
        }
        //  console.log('Message sent successfully!');
        console.log(info);
        transporter.close();
    });


}