var mysql = require('mysql2');
readJson = require("r-json");
const config = readJson(`config.json`);



const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});




// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();


module.exports = promisePool;