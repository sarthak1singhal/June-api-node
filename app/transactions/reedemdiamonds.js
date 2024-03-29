var path = require('path');
RAZORPAYX_API_KEY= "rzp_test_Jj18yUc535vLdk"
RAZORPAYX_API_PRIVATE_SECRET="H6HTbmbnD0PEelgn2BeFXjq7"
process.env.RAZORPAYX_API_KEY = RAZORPAYX_API_KEY;
process.env.RAZORPAYX_API_PRIVATE_SECRET = RAZORPAYX_API_PRIVATE_SECRET

const config = readJson(`config.json`);
const acon = require('../../initSql')
const RazorPay = require('razorpay'); 
const  { diamondToINR  } = require('../functions/coinstodiamonds')
var con = require('../../params.js')
const fx = require('../functions/functions')
const multer = require("multer")
var fs = require('file-system');
const { RazorPayContact  , RazorPayFundAccount , RazorPayPayout} = require("razorpayx-nodejs-sdk");

const upload = multer({
    dest: path.join(__dirname, '../../upload')
    
});

module.exports = function(app) {
    // 
    app.post('/redeem', fx.isLoggedIn, async function(req, res) {
        try {
            //b_id: 'es5j6486khspju3n' 30
            let { name, email, contact , ifsc, accountnumber } = req.body;
      
            let maskedAccountNumber = accountnumber.replace(/\b[\dX][-. \dX]+(\d{4})\b/g, 'XXXX XXXX XXXX $1');
            let userid = req.user.id;
            let newContactId;
            let newAccountId;
            let [user, f1] = await acon.query("select * from users WHERE fb_id = ?", [userid]).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));
            user = user[0];
            let diamond =  user.diamond ; 
            let ammount = diamondToINR(diamond)
            if (user.razor_contact_id  == null) {
  
                let newCustomer = await RazorPayContact.create({ name, email, contact, type: 'customer' }).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));;
              
                if(newCustomer && newCustomer.code == 200){
                user['razor_contact_id'] = newCustomer.data.id;
                newContactId = newCustomer.data.id
                }else{
                    return res.send({status:500 , message:'internal server error' , data : 'unable to create razor pay customer'})
                }
            }

            if (!user.razor_fund_account_id) {
                const fundAccount = await RazorPayFundAccount.create({ contact_id: user.razor_contact_id, account_type: "bank_account", "bank_account": { name, ifsc, account_number: accountnumber } }).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));;
                if(fundAccount && fundAccount.code == 200){
                user.razor_fund_account_id = JSON.parse(fundAccount).data.id
                newAccountId = fundAccount.data.id
              }else{
                return res.send({status:500 , message:'internal server error' , data : 'unable to create razor pay fund account'})
             }
        
            }

            if ((newAccountId && newAccountId.length > 0) || (newContactId && newContactId.length > 0)) {
                await acon.query("update users SET razor_contact_id =?, razor_fund_account_id=? WHERE fb_id = ? ", [user.razor_contact_id, user.razor_fund_account_id, userid]).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));

                await acon.query("insert into bankaccounts (account_number,ifsc_code,fb_id,razor_contact_id ,razor_fund_account_id )values(?,?,?,?, ?)", [maskedAccountNumber, ifsc, userid, userid, user.razor_contact_id, fundAccount.id]).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));

            }
            
            let newPayout = await RazorPayPayout.create({ account_number: accountnumber, fund_account_id: user.razor_fund_account_id, amount: parseInt(ammount) * 100, currency: 'INR', "mode": "IMPS", purpose: "payout", "queue_if_low_balance": true }).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));
            newPayout.data.failure_reason == null ?  newPayout.data.failure_reason = '' :   newPayout.data.failure_reason;
            await acon.query("insert into payouts (razor_payout_id,razor_fund_account_id,amount,fees,tax,status,mode,razor_failure_reason ) values (?,?,?,?,?,?,?,?)", [newPayout.data.id, newPayout.data.fund_account_id, newPayout.data.amount, newPayout.data.fees, newPayout.data.tax, newPayout.data.status, newPayout.data.mode, newPayout.data.failure_reason]).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));

            if(newPayout && newPayout.code == 200){
            return res.send({ statusCode: 200, message: 'ok', data: { status: newPayout.status, ammount: newPayout.ammount, fees: newPayout.fees, tax: newPayout.tax, failureReason: newPayout.razor_failure_reason } });
            }else{
                return res.send({status:500 , message:'internal server error' , data : 'unable to create razor pay out'})
            }
        } catch (err) {
            console.log(err);
            return res.send({ statusCode: 500, message: 'Internal Server Errors', data: err });
        }

    })
}