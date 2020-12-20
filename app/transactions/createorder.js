 const Razorpay = require('razorpay');

 const fx = require('../functions/functions')


 module.exports = function(app) {

     app.post('/createorders', fx.isLoggedIn, async function(req, res) {
         let { amount, currency, receipt } = req.body;

         var instance = new Razorpay({
             key_id: 'rzp_test_Jj18yUc535vLdk',
             key_secret: 'H6HTbmbnD0PEelgn2BeFXjq7',
         });

         instance.orders.create({ amount, currency, receipt }, function(err, order) {
             console.log(err, order, "=======================>")
             if (order) {
                 res.send({ statusCode: 200, data: { orderId: order }, message: 'ok' })
             } else {
                 res.send({ statusCode: 500, data: {}, message: 'internal server error' })
             }

         })



     })
 }