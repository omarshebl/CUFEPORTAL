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
    let insert_classes = [];
    connection.connect();
    shift = 0;
    for (c of classes) {
        console.log(c)
        if (isNaN(c.room)) {
            insert_query = [(c.index + shift), parseInt(c.schid), c.course, c.room[0], (c.type === 'Lecture'?1:0), get_day_number(c.day), c.begin, c.end, parseInt(c.group), 0, 0, 0, 'NONE', version];
            connection.execute({sql: insert_classes_query, values: insert_query},function (error) {
                if (error) throw error;
            })
            insert_classes.push(insert_query);
            shift += 1;
            insert_query = [(c.index + shift), parseInt(c.schid), c.course, c.room[1], (c.type === 'Lecture'?1:0), get_day_number(c.day), c.begin, c.end, parseInt(c.group), 0, 0, 0, 'NONE', version];
            connection.execute({sql: insert_classes_query, values: insert_query},function (error) {
                if (error) throw error;
            })
            insert_classes.push(insert_query);
        } else {
            insert_query = [(c.index + shift), parseInt(c.schid), c.course, c.room, (c.type === 'Lecture'?1:0), get_day_number(c.day), c.begin, c.end, parseInt(c.group), 0, 0, 0, 'NONE', version];
            connection.execute({sql: insert_classes_query, values: insert_query},function (error) {
                if (error) throw error;
            })
            insert_classes.push(insert_query);
        }
        //TODO: implement class_status, class_num_enrolled
    }
    connection.end();
    return insert_classes;
}

module.exports = insert_classes
