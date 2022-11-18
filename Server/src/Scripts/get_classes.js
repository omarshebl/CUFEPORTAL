const fs = require('fs');

function remove_duplicates(data) {
    let no_dup = [];
    for (row of data) {
        row = JSON.stringify(row);
        if (!no_dup.includes(row)) {
            no_dup.push(row)
        }
    }
    for (row in no_dup) {
        no_dup[row] = JSON.parse(no_dup[row])
    }
    return no_dup;
}

function save_JSON(data, directory, fileName) {
    jsonString = JSON.stringify(data);
    fs.writeFile(`${directory}/${fileName}.json`, jsonString, function(err) {
        if (err) {
            console.log(err);
        }
    })
} 

function get_classes_no_duplicates(classes) {
    rows = [];
    for (row of classes) {
        course_code = row.course;
        course_name = row.name;
        course_type = row.type;
        course_time = row.end - row.begin;
        rows.push([course_code, course_name, course_type, course_time]);
    }
    rows = remove_duplicates(rows);
    return rows;
}

function get_json_class_data(directory, fileName) {
    const data = fs.readFileSync(`${directory}/${fileName}.json`);
    return JSON.parse(data);
}

function get_classes(directory, fileName) {
    const json = get_json_class_data(directory, fileName);
    const classes_nd = get_classes_no_duplicates(json);
    rows = [];
    for (row of classes_nd) {
        if (row[2] === 'Lecture') {
            tutorial_time = 0;
            for (rowin of classes_nd) {
                if (rowin[2] === 'Tutorial' && rowin[0] === row[0]) {
                    tutorial_time = rowin[3];
                }
            }
            row.push(tutorial_time);
            rows.push(row)
        }
    }
    return rows;
}

module.exports = {get_classes, get_json_class_data};