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

function get_students_reg(filesData) {
    let students_reg = [];
    for (file of filesData) {
        for(student of file.students) {
            let date = new Date(student.registrationDate)
            date = date.toLocaleString('en-GB', {hour12:false}).split(',')
            day = date[0].split('/');
            day = `${day[2]}-${day[1]}-${day[0]}`;
            date = day+date[1];
            students_reg.push({class_id: parseInt(file.class.index), id: parseInt(student.id), reg_date: date})
        }
    }
    return students_reg;
}

module.exports = {get_students, get_students_reg};