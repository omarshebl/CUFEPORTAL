const procedures = {
    classes_from_r_time: {
        data_len_req: 3,
        sql: "CALL GET_CLASS_FROM_R_TIME(?,?,?);"
    },
    classes_from_code: {
        data_len_req: 1,
        sql: "CALL GET_CLASSES_FROM_CODE(?);"
    },
    classes_from_id: {
        data_len_req: 1,
        sql: "CALL GET_CLASSES_FROM_ID(?);"
    },
    e_room: {
        data_len_req: 2,
        sql: "CALL GET_E_ROOM_B_T(?,?);"
    },
    final_from_id: {
        data_len_req: 1,
        sql: "CALL GET_FINAL_FROM_ID(?);"
    },
    midterm_from_id: {
        data_len_req: 1,
        sql: "CALL GET_MIDTERM_FROM_ID(?);"
    },
    last_version: {
        data_len_req: 0,
        sql: "CALL GET_LAST_VERSION();"
    },
    last_class_index: {
        data_len_req: 0,
        sql: "CALL GET_LAST_CLASS_INDEX();"
    },
    students_from_class_id: {
        data_len_req: 1,
        sql: "CALL GET_STUDENTS_FROM_CLASS_ID(?);"
    },
    students_from_code: {
        data_len_req: 1,
        sql: "CALL GET_STUDENTS_FROM_CODE(?);"
    },
    students_from_code_nd: {
        data_len_req: 1,
        sql: "CALL GET_STUDENTS_FROM_CODE_ND(?);"
    },
    students_from_r_time: {
        data_len_req: 3,
        sql: "CALL GET_STUDENTS_FROM_R_TIME(?,?,?)"
    }
}

function cufeportal(connection, query) {
    const check = Array.isArray(query.data)?query.data.length:1;
    if (procedures[query.sql].data_len_req !== check) {
        throw new Error("Mismatch in query input, and data given...");
    }
    return new Promise((resolve, reject) => {
        connection.execute({sql: procedures[query.sql].sql, values: Array.isArray(query.data)?query.data:[query.data]}, 
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