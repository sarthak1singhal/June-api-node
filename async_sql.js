const amysql = require('mysql2/promise');
readJson = require("r-json");
const config = readJson(`config.json`);

var acon = await amysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});


module.exports = acon;