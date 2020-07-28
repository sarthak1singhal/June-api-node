var mysql = require('mysql');
readJson = require("r-json");
const config = readJson(`config.json`);

var connection = mysql.createConnection({
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;