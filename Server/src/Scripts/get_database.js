const procedures = {
    classes_from_r_time: "CALL GET_CLASS_FROM_R_TIME(?,?,?);", 
    classes_from_code: "CALL GET_CLASSES_FROM_CODE(?);",
    classes_from_id: "CALL GET_CLASSES_FROM_ID(?);",
    e_room: "CALL GET_E_ROOM_B_T(?,?);",
    final_from_id: "CALL GET_FINAL_FROM_ID(?);",
    midterm_from_id: "CALL GET_MIDTERM_FROM_ID(?);",
    last_version: "CALL GET_LAST_VERSION();",
    last_class_index: "CALL GET_LAST_CLASS_INDEX();",
    students_from_class_id: "CALL GET_STUDENTS_FROM_CLASS_ID(?);",
    students_from_code: "CALL GET_STUDENTS_FROM_CODE(?);",
    students_from_code_nd: "CALL GET_STUDENTS_FROM_CODE_ND(?);",
    students_from_r_time: "CALL GET_STUDENTS_FROM_R_TIME(?,?,?);"
}

function cufeportal(connection, query, callback) {
    return new Promise((resolve, reject) => {
        connection.execute({sql: query.sql, values: query.data}, 
            function(err, result) {
                if (err) reject(err);
                resolve(result[0]);
            }
        )
    })
}

module.exports = {
    cufeportal: cufeportal,
    procedures: procedures
}