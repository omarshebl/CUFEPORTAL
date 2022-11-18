function get_last_version(connection, callback) {
    return new Promise((resolve, reject) => {
        connection.execute("SELECT MAX(VERSION_ID) AS VERSION FROM StudentRegClassesVer", function(err, result) {
            if (err) reject(err);
            resolve(result[0]['VERSION']);
        })
    })
}

module.exports = {get_last_version};