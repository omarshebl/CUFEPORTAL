const fs = require("fs")
const xlsx = require('node-xlsx')

function get_date_from_iso8601(number) {
    var date = new Date(Math.round(number*100000)*864-2209168800000);
    return date.toLocaleString();
}

function get_student_data(data) {
    const idIndex = 1;
    const nameAIndex = 2;
    const nameEIndex = 3;
    const regDateIndex = 4;
    
    nameA = data[nameAIndex].trim();
    nameE = '';
    if (data[nameEIndex] !== undefined) nameE = data[nameEIndex].trim();

    return {
        id: data[idIndex], 
        nameArabic: nameA, 
        nameEnglish: nameE, 
        registrationDate: get_date_from_iso8601(data[regDateIndex])
    };
}

function get_class_data(file) {
    file = file.split(".")[0]
    file = file.split("_")

    return {
        index: file[0],
        schid: file[1],
        course: file[2],
        session_type: file[3]
    };
}

function extract_files_data(directory) {
    const files = fs.readdirSync(directory);
    let filesData = [];

    for ([index, file] of files.entries()) {
        const workSheetsFromFile = xlsx.parse(`./${directory}/${file}`);
        const studentData = workSheetsFromFile[0].data;
        let students = [];
        const classData = get_class_data(file);
        for (i = 1; i < studentData.length; i++) {
            if(studentData[i].length === 0) break;
            students.push(get_student_data(studentData[i]));
        }
        filesData.push({class: classData, students: students});
    }

    return filesData
}

module.exports = extract_files_data