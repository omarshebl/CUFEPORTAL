const mysql = require('mysql2');
const get_database = require('./Scripts/get_database');
const database_conn = require('./database_conn');

async function handle_req(req) {
    let res;
    const connection = mysql.createConnection(database_conn.root);
    connection.connect();
    res = await get_database.cufeportal(connection, {sql: req.type, data: req.values});
    connection.end();
    return res;
}
    
module.exports = handle_req