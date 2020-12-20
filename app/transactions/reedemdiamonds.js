var path = require('path');
const config = readJson(`config.json`);
const acon = require('../../initSql')
const RazorPay = require('razorpay');

var con = require('../../params.js')
const fx = require('../functions/functions')
const multer = require("multer")
var fs = require('file-system');
const { RazorPayContact, RazorPayFundAccount, RazorPayPayout } = require("razorpayx-nodejs-sdk");

const upload = multer({
    dest: path.join(__dirname, '../../upload')
        // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

module.exports = function(app) {
    // 
    app.post('/redeem', fx.isLoggedIn, async function(req, res) {
        try {
            let { name, email, contact, ammount, ifsc, accountnumber } = req.body;
            console.log(req.body);
            let maskedAccountNumber = accountnumber.replace(/\b[\dX][-. \dX]+(\d{4})\b/g, 'XXXX XXXX XXXX $1');
            let userid = req.user.id;
            let newContactId;
            let newAccountId;

            let [user, f1] = await acon.query("select * from users WHERE fb_id = ?", [userid]).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));
            console.log(user);
            user = user[0];
            if (!user.razor_contact_id) {
                console.log("INSIDE")
                let newCustomer = await RazorPayContact.create({ name, email, contact, type: 'customer' }).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));;
                user.razor_contact_id = newCustomer.id;
                newContactId = newCustomer.id
            }
            console.log("PUTSIDE")

            console.log(newContactId);

            console.log(user.razor_contact_id);

            if (!user.razor_fund_account_id) {
                const fundAccount = await RazorPayFundAccount.create({ contact_id: user.razor_contact_id, account_type: "bank_account", "bank_account": { name, ifsc, account_number: accountnumber } }).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));;
                user.razor_fund_account_id = fundAccount.id
                newAccountId = fundAccount.id
            }



            console.log(newAccountId);


            if ((newAccountId && newAccountId.length > 0) || (newContactId && newContactId.length > 0)) {
                await acon.query("update users SET razor_contact_id =?, razor_fund_account_id=? WHERE fb_id = ? ", [user.razor_contact_id, user.razor_fund_account_id, userid]).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));

                await acon.query("insert into bankaccounts (account_number,ifsc_code,fb_id,razor_contact_id ,razor_fund_account_id )values(?,?,?,?, ?)", [maskedAccountNumber, ifsc, userid, userid, user.razor_contact_id, fundAccount.id]).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));

            }



            let newPayout = await RazorPayPayout.create({ account_number: accountnumber, fund_account_id: user.razor_fund_account_id, ammount: ammount * 100, currency: 'INR', "mode": "NEFT", purpose: "Points redeemed", "queue_if_low_balance": true }).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));

            await acon.query("insert into payouts (razor_payout_id,razor_fund_account_id,amount,fees,tax,status,mode,razor_failure_reason ) values (?,?,?,?,?,?,?,?)", [newPayout.id, newPayout.fund_account_id, newPayout.ammount, newPayout.fees, newPayout.tax, newPayout.status, newPayout.mode, newPayout.failure_reason]).catch((e) => res.send({ statusCode: 500, message: e, data: {} }));


            return res.send({ statusCode: 200, message: 'ok', data: { status: newPayout.status, ammount: newPayout.ammount, fees: newPayout.fees, tax: newPayout.tax, failureReason: newPayout.razor_failure_reason } });

        } catch (err) {
            console.log(err);
            return res.send({ statusCode: 500, message: 'Internal Server Errors', data: err });
        }

    })
}