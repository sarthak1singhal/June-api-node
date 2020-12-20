//var path = require('path');
//const readJson = require("r-json");

//const config = readJson('../../config.json');
//const acon = require('../../initSql')
const Razorpay = require('razorpay');

//var con = require('../../params.js')
//const fx = require('../functions/functions')
//const multer = require("multer")
//var fs = require('file-system');

var instance = new Razorpay({
    key_id: 'rzp_test_Jj18yUc535vLdk',
    key_secret: 'H6HTbmbnD0PEelgn2BeFXjq7',

});

instance.orders.create({ "amount": 2000, "currency": "INR", "receipt": "" }, function(err, order) {
    console.log(err, order, "=======================>")
    if (order) {
        console.log("OK")
        res.send({ statusCode: 200, data: { orderId: order }, message: 'ok' })
    } else {
        console.log("sss")
        res.send({ statusCode: 500, data: {}, message: 'internal server error' })
    }

})