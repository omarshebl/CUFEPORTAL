function get_last_version(connection, callback) {
    return new Promise((resolve, reject) => {
        connection.connect();
        connection.execute("SELECT MAX(VERSION_ID) FROM StudentRegClassesVer", function(err, result) {
            if (err) reject(err);
            resolve(result[0]['MAX(VERSION_ID)']);
        })
        connection.end();
    })
}

module.exports = {get_last_version};