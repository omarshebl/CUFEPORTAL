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

function get_students(filesData) {
    let students = [];
    for (file of filesData) {
        for(student of file.students) {
            students.push({id: student.id, nameArabic: student.nameArabic, nameEnglish: student.nameEnglish})
        }
    }
    students = remove_duplicates(students);
    return students;
}

module.exports = get_students;