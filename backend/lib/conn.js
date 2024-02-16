const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    port: "8889",
    user: "notes",
    password: "notes",
    database: "notes"
})

module.exports = connection;