var path = require('path');
RAZORPAYX_API_KEY= "rzp_test_Jj18yUc535vLdk"
RAZORPAYX_API_PRIVATE_SECRET="H6HTbmbnD0PEelgn2BeFXjq7"
process.env.RAZORPAYX_API_KEY = RAZORPAYX_API_KEY;
process.env.RAZORPAYX_API_PRIVATE_SECRET = RAZORPAYX_API_PRIVATE_SECRET

const config = readJson(`config.json`);
const acon = require('../../initSql')
const RazorPay = require('razorpay'); 

var con = require('../../params.js')
const fx = require('../functions/functions')
const multer = require("multer")
var fs = require('file-system');
const { RazorPayContact  , RazorPayFundAccount , RazorPayPayout} = require("razorpayx-nodejs-sdk");

const upload = multer({
    dest: path.join(__dirname, '../../upload')
    
});

 module.exports = function(app) {

     app.post('/createorders', fx.isLoggedIn, async function(req, res) {
         let { amount, currency, receipt } = req.body;

         var instance = new Razorpay({
             key_id: 'rzp_test_Jj18yUc535vLdk',
             key_secret: 'H6HTbmbnD0PEelgn2BeFXjq7',
         });

         instance.orders.create({ amount, currency, receipt }, function(err, order) {
            
             if (order) {
                 res.send({ statusCode: 200, data: { orderId: order }, message: 'ok' })
             } else {
                 res.send({ statusCode: 500, data: {}, message: 'internal server error' })
             }

         })



     })
 }