function get_day_number(day) {
    switch (day) {
        case 'Saturday':
            return 1;
            break;
        case 'Sunday':
            return 2;
            break;
        case 'Monday':
            return 3;
            break;
        case 'Tuesday':
            return 4;
            break;
        case 'Wednesday':
            return 5;
            break;
        case 'Thursday':
            return 6;
            break;
        case 'Friday':
            return 7;
            break;        
    }
}

function insert_classes(connection, classes, version) {
    insert_classes_query = 'INSERT INTO Classes (CLASS_ID, SCH_ID, COURSE_CODE, CLASS_ROOM, CLASS_TYPE_LEC, CLASS_DAY, CLASS_START, CLASS_END, CLASS_GROUP, CLASS_STATUS, CLASS_NUM_ENROLED, CLASS_M_NUM_ENROLED, CLASS_GGL_CR, VERSION_ID) ' + 
                                    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.connect();
    shift = 0;
    for (c of classes) {
        console.log(c)
        if (isNaN(c.room)) {
            insert_query = [(c.index + shift), parseInt(c.schid), c.course, c.room[0], (c.type === 'Lecture'?1:0), get_day_number(c.day), c.begin, c.end, parseInt(c.group), 0, 0, 0, 'NONE', version];
            connection.execute({sql: insert_classes_query, values: insert_query},function (error) {
                if (error) throw error;
            })
            shift += 1;
            insert_query = [(c.index + shift), parseInt(c.schid), c.course, c.room[1], (c.type === 'Lecture'?1:0), get_day_number(c.day), c.begin, c.end, parseInt(c.group), 0, 0, 0, 'NONE', version];
            connection.execute({sql: insert_classes_query, values: insert_query},function (error) {
                if (error) throw error;
            })
        } else {
            insert_query = [(c.index + shift), parseInt(c.schid), c.course, c.room, (c.type === 'Lecture'?1:0), get_day_number(c.day), c.begin, c.end, parseInt(c.group), 0, 0, 0, 'NONE', version];
            connection.execute({sql: insert_classes_query, values: insert_query},function (error) {
                if (error) throw error;
            })
        }
        //TODO: implement class_status, class_num_enrolled
    }
    connection.end();
}

function insert_courses(connection, courses) {
    insert_courses_query = 'INSERT IGNORE INTO Courses (COURSE_CODE, COURSE_NAME, LECTURE_DUR, TUTORIAL_DUR) ' + 
                                    'VALUES (?, ?, ?, ?) ';
    connection.connect();
    for (c of courses) {
        insert_query = [c[0], c[1], c[3], c[4]];
        connection.execute({sql: insert_courses_query, values: insert_query},function (error) {
            if (error) throw error;
        })
    }
    connection.end();
}

function insert_students(connection, students) {
    insert_students_query = 'INSERT INTO Students (STUDENT_ID, STUDENT_NAME_A, STUDENT_NAME_E) ' + 
                                    'VALUES (?, ?, ?) ' +
                                    'ON DUPLICATE KEY UPDATE STUDENT_NAME_A = ?, STUDENT_NAME_E = ?';
    connection.connect();
    for (s of students) {
        insert_query = [s.id, s.nameArabic, s.nameEnglish, s.nameArabic, s.nameEnglish];
        connection.execute({sql: insert_students_query, values: insert_query},function (error) {
            if (error) throw error;
        })
    }
    connection.end();                            
}

module.exports = {insert_classes, insert_courses, insert_students}
