const jsdom = require('jsdom');

//TODO: implement code without using jsdom
function get_document(html) {
    const dom = new jsdom.JSDOM(html);
    return dom.window.document;
}

function extract_time_to24(time) {
    time = time.split(":");
    hour = parseInt(time[0]);
    minute = parseInt(time[1]);
    if (minute > 0) hour += 1;
    if (minute > 0) {
        if ((hour >= 1 && hour <=8)) hour += 12;
    } else {
        if (!(hour >= 8 && hour <=12)) hour += 12;
    }
    return hour;
}

function extract_room(class_room) {
    if (!isNaN(class_room)) {
        class_room = parseInt(class_room);
    } else if (class_room[0] === '[') {
        if (class_room[1] === '0') {
            class_room = class_room.slice(3)
            class_room = class_room.split("-");
            if (!isNaN(class_room[0])) {
                class_room = parseInt(class_room[0])
            } else {
                class_room = 16311; //TODO: Get Real Value (Lab ELC. Building)
            }
        } else {
            class_room = class_room.split("-")[0];
            class_room = class_room.split("]")[0];
            class_room = parseInt(class_room.slice(1));
        }
    } else if (class_room[0] === 'ا') {
        class_room = parseInt(class_room.split("-")[2].split("]")[0].split("[")[1])
    } else if (class_room.split("-").length == 2) {
        class_room = parseInt(class_room.split("-")[0])
    } else if (class_room === "2nd floor lab1") {
        class_room = 3201;    //TODO: Get Real Value
    } else if (class_room === "2nd floor lab 2" || class_room === "2nd floor lab2") {
        class_room = 3202;    //TODO: Get Real Value
    } else if (class_room === "2nd floor lab3") {
        class_room = 3203;    //TODO: Get Real Value
    } else if (class_room === "LAB CHE") {
        class_room = 322;     //TODO: Get Real Value
    } else if (class_room.includes("+")) {
        class_room = class_room.split("+")
        class_room[0] = extract_room(class_room[0]);
        class_room[1] = extract_room(class_room[1]);
    } else if (class_room === "-----") {
        class_room = 0;
    } else {
        throw new Error(`Error not found: ${class_room}`);
    }
    
    return class_room
}

function timetable_helper(course_info) {
    let course = {};
    courseS = course_info.split(',');
    course.code = courseS[0].trim();
    courseS = courseS[1].split(' :');
    course.name = courseS[0].trim();
    courseS = courseS[1].split('At');
    course.type = courseS[0].trim();
    courseS = courseS[1].split('From');
    course.room = extract_room(courseS[0].trim());
    courseS = courseS[1].split('-');
    course.stime = extract_time_to24(courseS[0].trim().split(' To ')[0]);
    course.etime = extract_time_to24(courseS[0].trim().split(' To ')[1]);
    course.group = parseInt(courseS[1].trim());
    return course;
}

function split_cookie(cookie) {
    cookie = cookie.split(',');
    return {ASPsession: cookie[0].split(';')[0], ASPXAUTH: cookie[1].trim(1).split(';')[0]};
};

function parse_timetable(html) {
    const document = get_document(html);
    const table = document.getElementById("cont_win_2_Table1");
    const rows = table.getElementsByTagName('tr');
    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let timetable = {};
    let day;
    for (row of rows) {
        info = row.textContent.trim();
        if (days.includes(info)) {
            day = info;
            timetable[day] = {day: day, subjects: []};
        } else {
            timetable[day].subjects.push(timetable_helper(info));
        }
    }
    timetable = Object.values(timetable)
    return timetable;
}

function parse_seatnumber(html) {
    const document = get_document(html);
    const span = document.getElementById("ctl07_lbl_SeatNumber");
    return parseInt(span.textContent.trim());
}

function parse_absence(html) {
    const document = get_document(html);
    const table = document.getElementById("ctl07_GridView1");
    const rows = table.getElementsByTagName('tr');
    let absence_table = {};
    let first = true;
    for (row of rows) {
        if (first) {first = false; continue;}
        let course_code;
        let course_name;
        let occurence = {};
        cells = row.getElementsByTagName('td');
        occurence.week = parseInt(cells[1].textContent.trim().split(' ')[1]);
        occurence.type = cells[3].textContent.trim();
        course_code = cells[4].textContent.trim();
        course_name = cells[5].textContent.trim();
        if (!absence_table[course_code]) {
            absence_table[course_code] = {
                code: course_code,
                name: course_name,
                absence: [occurence]
            }
        } else if (absence_table[course_code].name) {
            absence_table[course_code].absence.push(occurence);
        }
    }
    absence_table = Object.values(absence_table);
    return absence_table;
}

function parse_classwork(html) {
    const document = get_document(html);
    const table = document.getElementById("cont_win_13_Table1");
    const rows = table.getElementsByTagName('tr');
    let classwork = [];
    for(row of rows) {
        cells = row.getElementsByTagName('td');
        classwork.push({
            code: cells[0].textContent.trim(),
            name: cells[1].textContent.trim(),
            midterm: cells[2].textContent.trim(),
            dailywork: cells[3].textContent.trim()
        });
    };
    classwork.shift();
    return classwork;
}

function parse_transcript(html) {
    const document = get_document(html);
    const table = document.getElementById("cont_win_3_Table1");
    const rows = table.getElementsByTagName('tr');
    let transcript = {semesters:[], cum_gpa:{}, last_gpa:{}, tot_credits:{}};
    let semester = {};
    let sem = '';
    for(row of rows) {
        const backgroundColor = row.style.backgroundColor;
        if(backgroundColor === 'rgb(49, 162, 172)') continue;
        if(backgroundColor === 'rgb(255, 183, 69)') {
            sem = row.getElementsByTagName('td')[0].textContent.trim().split('-');
            semester = {season: sem[0], year: parseInt(sem[1])};
            transcript.semesters[sem] = {semester: semester, courses: []}
        } else if (backgroundColor === 'rgb(237, 239, 92)') {
            transcript.cum_gpa = {type: 'Cumulative GPA', value: parseFloat(row.getElementsByTagName('td')[0].textContent.split('=')[1].trim())};
        } else if (backgroundColor === 'rgb(182, 239, 92)') {
            transcript.last_gpa = {type: 'Last Term GPA', value: parseFloat(row.getElementsByTagName('td')[0].textContent.split('=')[1].trim())};
        } else if (backgroundColor === 'rgb(109, 230, 86)') {
            transcript.tot_credits = {type: 'Total Credits', value: parseInt(row.getElementsByTagName('td')[0].textContent.split('=')[1].trim())};
        } else {
            cols = row.getElementsByTagName('td');
            transcript.semesters[sem].courses.push({
                semester: semester,
                course_code: cols[0].textContent.trim(),
                course_name: cols[1].textContent.trim(),
                course_grade: cols[2].textContent.trim(),
                course_credit: parseInt(cols[3].textContent.trim()),
                quality_points : parseFloat(cols[4].textContent.trim())
            })
        }
    };
    transcript.semesters = Object.values(transcript.semesters);
    return transcript;
}

function parse_profile(html) {
    const document = get_document(html);
    const div = document.getElementById("win_4_Content");
    const cells = div.getElementsByTagName('td');
    const profile = {
        student_id: parseInt(cells[1].textContent.trim()), 
        name_a: cells[3].textContent.trim(), 
        name_e: cells[5].textContent.trim(), 
        program: cells[7].textContent.trim(), 
        gpa: parseFloat(cells[9].textContent.trim()), 
        last_gpa: parseFloat(cells[11].textContent.trim()), 
        tot_credits: parseInt(cells[13].textContent.trim()), 
        university_id: parseInt(cells[15].textContent.trim())
    };
    return profile;
}

const website = "https://std.eng.cu.edu.eg/";
login_url = (time) => `${website}?_dc=${time}`;
login_body = (id, pass) => `submitDirectEventConfig=%7B%22config%22%3A%7B%22extraParams%22%3A%7B%22tecla%22%3A13%7D%7D%7D&__EVENTTARGET=ctl03&__EVENTARGUMENT=txtPassword%7Cevent%7CKeyUp&__VIEWSTATE=%2FwEPDwUJMjA4NzY4MDUyD2QWAgIDD2QWAgIDDxQqElN5c3RlbS5XZWIuVUkuUGFpcgEPBQRiYXNlDxYCHghJbWFnZVVybAUSaG9tZXBhZ2ViYW5uZXIuZ2lmZGQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgUFBWN0bDAzBQdXaW5kb3cxBQt0eHRVc2VybmFtZQULdHh0UGFzc3dvcmQFB0J1dHRvbjEV1ojdRtapbx3MTJ7fsuSYqEsXanhW%2FbDv%2BLkkNB%2BFsw%3D%3D&__VIEWSTATEGENERATOR=C2EE9ABB&__EVENTVALIDATION=%2FwEdAALVILSIlTYVfKj6MDSXQAcXNpGzZOwh9RDF3%2FtMV5ai8yBE4Rt6HVlNtleMUQjroyNPxvqGC1hJLx00GORUD%2FJV&txtUsername=${id}&txtPassword=${pass}`;
const login_headers = {
    'Host' : 'std.eng.cu.edu.eg',
    'Accept' : '*/*',
    'X-Ext.Net': 'delta=true',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept-Language' : 'en-GB,en-US;q=0.9,en;q=0.8',
    'Accept-Encoding' : 'gzip, deflate',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Origin' : 'http://std.eng.cu.edu.eg',
    'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
    'Referer': 'https://std.eng.cu.edu.eg/'
};

login_request = (id, pass) => {
    return {
        method: 'POST',
        headers: login_headers,
        body: login_body(id, pass),
        keepalive: true
    }
};

async function login_req(id, pass) {
    const res = await fetch(login_url(Date.now()), login_request(id, pass));
    const success = res.headers.has('set-cookie');
    let cookie;
    if (success) cookie = split_cookie(res.headers.get('set-cookie'));
    return ({'login_success': success, 'cookie': cookie, 'status': res.status});
};

join_cookie = (cookie) => `${cookie.ASPsession}; ${cookie.ASPXAUTH}`;
cookie_headers = (cookie) => {
    return {
        'Host': 'std.eng.cu.edu.eg',
        'Cookie': join_cookie(cookie),
        'Upgrade-Insecure-Requests': 1,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
        'Referer': 'http://std.eng.cu.edu.eg/SIS/Default.aspx',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
};

get_url = (path) => `${website}SIS/Modules/MetaLoader.aspx?path=~%2FSIS%2FModules%2FStudent%2F${path}.ascx`;
get_request = (cookie) => {
    return {
        method: 'GET',
        headers: cookie_headers(cookie),
        keepalive: true
    }
};

post_url = (time) => `${website}SIS/Default.aspx?dc=${time}`;
post_body = (type) => `submitDirectEventConfig=%7B%22config%22%3A%7B%22extraParams%22%3A%7B%22WindowID%22%3A%22${type}.ascx%22%7D%7D%7D&__EVENTTARGET=ResourceManager1&__EVENTARGUMENT=-%7Cpublic%7CLoadWindowControl&__VIEWSTATE=%2FwEPDwUKLTQ3ODM1MDQ4Nw9kFgICAw9kFgICAw8UKhJTeXN0ZW0uV2ViLlVJLlBhaXICDwUEYmFzZQ8WAh4JV2FsbHBhcGVyBUguLi9NeUlIYW5kbGVyLmFzaHg%2FaW1hZ2U9REVDOEZCQTItMEU3NS00NzUwLTk0QTAtMzUzQzMzNjlFRDVCLTkwMDEzNy5wbmdkDwUJdnNNZW1iZXJzFCsABA8FB01vZHVsZXMPAh4UKwAeFCsEAQ8FBGJhc2UWBh4ITW9kdWxlSUQFCW1kbF93aW5fMR4IV2luZG93SUQFBXdpbl8xHgdBdXRvUnVuaBQrBAEPBQRiYXNlFgYfAQUJbWRsX3dpbl8yHwIFBXdpbl8yHwNoFCsEAQ8FBGJhc2UWBh8BBQltZGxfd2luXzMfAgUFd2luXzMfA2gUKwQBDwUEYmFzZRYGHwEFCW1kbF93aW5fNB8CBQV3aW5fNB8DaBQrBAEPBQRiYXNlFgYfAQUJbWRsX3dpbl81HwIFBXdpbl81HwNoFCsEAQ8FBGJhc2UWBh8BBQltZGxfd2luXzYfAgUFd2luXzYfA2gUKwQBDwUEYmFzZRYGHwEFCW1kbF93aW5fNx8CBQV3aW5fNx8DaBQrBAEPBQRiYXNlFgYfAQUJbWRsX3dpbl85HwIFBXdpbl85HwNoFCsEAQ8FBGJhc2UWBh8BBQptZGxfd2luXzEwHwIFBndpbl8xMB8DaBQrBAEPBQRiYXNlFgYfAQUKbWRsX3dpbl8xMx8CBQZ3aW5fMTMfA2gUKwQBDwUEYmFzZRYGHwEFCm1kbF93aW5fMTcfAgUGd2luXzE3HwNoFCsEAQ8FBGJhc2UWBh8BBQptZGxfd2luXzIyHwIFBndpbl8yMh8DaBQrBAEPBQRiYXNlFgYfAQUKbWRsX3dpbl8yNR8CBQZ3aW5fMjUfA2gUKwQBDwUEYmFzZRYGHwEFCm1kbF93aW5fNTkfAgUGd2luXzU5HwNoFCsEAQ8FBGJhc2UWBh8BBQptZGxfd2luXzYwHwIFBndpbl82MB8DaBQrBAEPBQRiYXNlFgYfAQULbWRsX3dpbl8yNDEfAgUHd2luXzI0MR8DaBQrBAEPBQRiYXNlFgYfAQULbWRsX3dpbl8yNDIfAgUHd2luXzI0Mh8DaBQrBAEPBQRiYXNlFgYfAQULbWRsX3dpbl8zMDQfAgUHd2luXzMwNB8DaBQrBAEPBQRiYXNlFgYfAQULbWRsX3dpbl8zMDUfAgUHd2luXzMwNR8DaBQrBAEPBQRiYXNlFgYfAQULbWRsX3dpbl80MDIfAgUHd2luXzQwMh8DaBQrBAEPBQRiYXNlFgYfAQULbWRsX3dpbl80MDcfAgUHd2luXzQwNx8DaBQrBAEPBQRiYXNlFgYfAQULbWRsX3dpbl85NDMfAgUHd2luXzk0Mx8DaBQrBAEPBQRiYXNlFgYfAQULbWRsX3dpbl85NDUfAgUHd2luXzk0NR8DaBQrBAEPBQRiYXNlFgYfAQULbWRsX3dpbl85NDYfAgUHd2luXzk0Nh8DaBQrBAEPBQRiYXNlFgYfAQULbWRsX3dpbl85NDkfAgUHd2luXzk0OR8DaBQrBAEPBQRiYXNlFgYfAQULbWRsX3dpbl85NjUfAgUHd2luXzk2NR8DaBQrBAEPBQRiYXNlFgYfAQULbWRsX3dpbl85NjkfAgUHd2luXzk2OR8DaBQrBAEPBQRiYXNlFgYfAQULbWRsX3dpbl85NzgfAgUHd2luXzk3OB8DaBQrBAEPBQRiYXNlFgYfAQURbWRsX09wdGlvbnNXaW5kb3cfAgUNT3B0aW9uc1dpbmRvdx8DaBQrBAEPBQRiYXNlFgYfAQUYbWRsX0NoYW5nZVBhc3N3b3JkV2luZG93HwIFFENoYW5nZVBhc3N3b3JkV2luZG93HwNoDwUJU3RhcnRNZW51FCsEAQ8FBGJhc2UWCB4FV2lkdGgCkAMeBkhlaWdodAKQAx4KVG9vbHNXaWR0aALjAR4FVGl0bGUFClN0YXJ0IE1lbnUPBQtTdGFydEJ1dHRvbhQrBAEPBQRiYXNlFgQeBFRleHRlHgdJY29uQ2xzBQxzdGFydC1idXR0b24PBQlTaG9ydGN1dHMPAhkUKwAZFCsEAQ8FBGJhc2UWCB8BBQltZGxfd2luXzEeClNob3J0Y3V0SUQFDnNocnRfbWRsX3dpbl8xHwgFDFJlZ2lzdHJhdGlvbh8JBR9zaG9ydGN1dC1pY29uIGljb24tcmVnaXN0cmF0aW9uFCsEAQ8FBGJhc2UWCB8BBQltZGxfd2luXzIfCgUOc2hydF9tZGxfd2luXzIfCAUNTXkgVGltZSBUYWJsZR8JBRxzaG9ydGN1dC1pY29uIGljb24tVGltZVRhYmxlFCsEAQ8FBGJhc2UWCB8BBQltZGxfd2luXzMfCgUOc2hydF9tZGxfd2luXzMfCAUPRnVsbCBUcmFuc2NyaXB0HwkFHXNob3J0Y3V0LWljb24gaWNvbi1UcmFuc2NyaXB0FCsEAQ8FBGJhc2UWCB8BBQltZGxfd2luXzQfCgUOc2hydF9tZGxfd2luXzQfCAUHUHJvZmlsZR8JBRpzaG9ydGN1dC1pY29uIGljb24tUHJvZmlsZRQrBAEPBQRiYXNlFggfAQUJbWRsX3dpbl81HwoFDnNocnRfbWRsX3dpbl81HwgFEUdyYWR1YXRpb24gUmVwb3J0HwkFI3Nob3J0Y3V0LWljb24gaWNvbi1HcmFkdWF0aW9uUmVwb3J0FCsEAQ8FBGJhc2UWCB8BBQltZGxfd2luXzYfCgUOc2hydF9tZGxfd2luXzYfCAUPQWR2aXNpbmcgSGVscGVyHwkFIXNob3J0Y3V0LWljb24gaWNvbi1BZHZpc2luZ0hlbHBlchQrBAEPBQRiYXNlFggfAQUJbWRsX3dpbl83HwoFDnNocnRfbWRsX3dpbl83HwgFDkdQQSBUcmFuc2NyaXB0HwkFIHNob3J0Y3V0LWljb24gaWNvbi1HUEFUcmFuc2NyaXB0FCsEAQ8FBGJhc2UWCB8BBQltZGxfd2luXzkfCgUOc2hydF9tZGxfd2luXzkfCAUSSW5mby4gYW5kIFdhcm5pbmdzHwkFGnNob3J0Y3V0LWljb24gaWNvbi1XYXJuaW5nFCsEAQ8FBGJhc2UWCB8BBQptZGxfd2luXzEwHwoFD3NocnRfbWRsX3dpbl8xMB8IBQtNYWlsIFN5c3RlbR8JBR1zaG9ydGN1dC1pY29uIGljb24tTWFpbFN5c3RlbRQrBAEPBQRiYXNlFggfAQUKbWRsX3dpbl8xMx8KBQ9zaHJ0X21kbF93aW5fMTMfCAUWVGVybSBDbGFzc3dvcmsgUmVzdWx0cx8JBRxzaG9ydGN1dC1pY29uIGljb24tQ2xhc3NXb3JrFCsEAQ8FBGJhc2UWCB8BBQptZGxfd2luXzE3HwoFD3NocnRfbWRsX3dpbl8xNx8IBRpSZWdpc3RyYXRpb24gU3RhdHVzIFJlcG9ydB8JBRxzaG9ydGN1dC1pY29uIGljb24tVGltZVRhYmxlFCsEAQ8FBGJhc2UWCB8BBQptZGxfd2luXzIyHwoFD3NocnRfbWRsX3dpbl8yMh8IBSBSZXF1ZXN0IHdpdGhkcmF3YWwgZnJvbSBhIGNvdXJzZR8JBSFzaG9ydGN1dC1pY29uIGljb24tVXBkYXRlU3ViamVjdHMUKwQBDwUEYmFzZRYIHwEFCm1kbF93aW5fMjUfCgUPc2hydF9tZGxfd2luXzI1HwgFDEVkaXQgUHJvZmlsZR8JBSFzaG9ydGN1dC1pY29uIGljb24tVXBkYXRlU3ViamVjdHMUKwQBDwUEYmFzZRYIHwEFCm1kbF93aW5fNTkfCgUPc2hydF9tZGxfd2luXzU5HwgFFE1pY3JvcHJvY2Vzc29yIEJvbnVzHwkFIXNob3J0Y3V0LWljb24gaWNvbi1VcGRhdGVTdWJqZWN0cxQrBAEPBQRiYXNlFggfAQUKbWRsX3dpbl82MB8KBQ9zaHJ0X21kbF93aW5fNjAfCAUTaW4gQ2xhc3MgQXR0ZW5kYW5jZR8JBSFzaG9ydGN1dC1pY29uIGljb24tVXBkYXRlU3R1ZGVudHMUKwQBDwUEYmFzZRYIHwEFC21kbF93aW5fMjQxHwoFEHNocnRfbWRsX3dpbl8yNDEfCAUZUHJpdmF0ZSBJbnRlcm5ldCBQYXNzd29yZB8JBRpzaG9ydGN1dC1pY29uIGljb24tV2FybmluZxQrBAEPBQRiYXNlFggfAQULbWRsX3dpbl8yNDIfCgUQc2hydF9tZGxfd2luXzI0Mh8IBRBEb2N1bWVudCBSZXF1ZXN0HwkFGnNob3J0Y3V0LWljb24gaWNvbi1XYXJuaW5nFCsEAQ8FBGJhc2UWCB8BBQttZGxfd2luXzMwNB8KBRBzaHJ0X21kbF93aW5fMzA0HwgFD0lUIFJlZ2lzdHJhdGlvbh8JBSFzaG9ydGN1dC1pY29uIGljb24tVXBkYXRlU3ViamVjdHMUKwQBDwUEYmFzZRYIHwEFC21kbF93aW5fMzA1HwoFEHNocnRfbWRsX3dpbl8zMDUfCAUVR2V0IEFuIEUtbWFpbCBBY2NvdW50HwkFIXNob3J0Y3V0LWljb24gaWNvbi1VcGRhdGVTdWJqZWN0cxQrBAEPBQRiYXNlFggfAQULbWRsX3dpbl80MDIfCgUQc2hydF9tZGxfd2luXzQwMh8IBRVTdHVkZW50IFdhcyBBYnNlbnQgSW4fCQUhc2hvcnRjdXQtaWNvbiBpY29uLVVwZGF0ZVN1YmplY3RzFCsEAQ8FBGJhc2UWCB8BBQttZGxfd2luXzQwNx8KBRBzaHJ0X21kbF93aW5fNDA3HwgFHFNwZWNpYWwgUmVnaXN0cmF0aW9uIFJlcXVlc3QfCQUhc2hvcnRjdXQtaWNvbiBpY29uLVVwZGF0ZVN1YmplY3RzFCsEAQ8FBGJhc2UWCB8BBQttZGxfd2luXzk0NR8KBRBzaHJ0X21kbF93aW5fOTQ1HwgFEU15IFNlYXRpbmcgbnVtYmVyHwkFHHNob3J0Y3V0LWljb24gaWNvbi1DbGFzc1dvcmsUKwQBDwUEYmFzZRYIHwEFC21kbF93aW5fOTQ2HwoFEHNocnRfbWRsX3dpbl85NDYfCAUQQ29vcmRpbmF0b3IgRGF0YR8JBSFzaG9ydGN1dC1pY29uIGljb24tVXBkYXRlU3ViamVjdHMUKwQBDwUEYmFzZRYIHwEFC21kbF93aW5fOTQ5HwoFEHNocnRfbWRsX3dpbl85NDkfCAUr2KfZhNiq2YjYp9i12YQg2YXYuSDYo9iz2KrYp9iwINin2YTZhdin2K%2FYqR8JBSFzaG9ydGN1dC1pY29uIGljb24tVXBkYXRlU3ViamVjdHMUKwQBDwUEYmFzZRYIHwEFC21kbF93aW5fOTY1HwoFEHNocnRfbWRsX3dpbl85NjUfCAUUVXBkYXRlIFBlcnNvbmFsIERhdGEfCQUhc2hvcnRjdXQtaWNvbiBpY29uLVVwZGF0ZVN1YmplY3RzZBgBBR5fX0NvbnRyb2xzUmVxdWlyZVBvc3RCYWNrS2V5X18WHwUQUmVzb3VyY2VNYW5hZ2VyMQUFd2luXzEFBXdpbl8yBQV3aW5fMwUFd2luXzQFBXdpbl81BQV3aW5fNgUFd2luXzcFBXdpbl85BQZ3aW5fMTAFBndpbl8xMwUGd2luXzE3BQZ3aW5fMjIFBndpbl8yNQUGd2luXzU5BQZ3aW5fNjAFB3dpbl8yNDEFB3dpbl8yNDIFB3dpbl8zMDQFB3dpbl8zMDUFB3dpbl80MDIFB3dpbl80MDcFB3dpbl85NDMFB3dpbl85NDUFB3dpbl85NDYFB3dpbl85NDkFB3dpbl85NjUFB3dpbl85NjkFB3dpbl85NzgFDU9wdGlvbnNXaW5kb3cFFENoYW5nZVBhc3N3b3JkV2luZG93BeHEW31YE%2F35IEusI%2BQJbzorPA0kZnV0sHFrZnHEiRQ%3D&__VIEWSTATEGENERATOR=246FFBC3&__EVENTVALIDATION=%2FwEdAAIojFS5Dio1OoOyDSZo3%2FCjBUdYWMLkI%2FtXuqI0HQ389N7GXZSQpAs5p7uB0cJqJj%2By6v%2FtJWwUHCaVzyyL7GHU`;
post_request = (cookie, type) => {
    return {
        method: 'POST',
        headers: cookie_headers(cookie),
        body: post_body(type),
        keepalive: true
    }
};

const absence_path = "StudenAbscense%2FStudenAbscense";
async function absence_req(cookie) {
    let res = await fetch(get_url(absence_path), get_request(cookie));
    res = await res.text(); 
    res = parse_absence(res);               
    return res;
};

const seatnumber_path = "GetMySeatNumber%2FGetMySeatNumber";
async function seatnumber_req(cookie) {
    let res = await fetch(get_url(seatnumber_path), get_request(cookie));
    res = await res.text(); 
    res = parse_seatnumber(res);                  
    return res;
};

const reg_path = 'Registration%2FRegistration'
async function reg_req(cookie) {
    let res = await fetch(get_url(reg_path), get_request(cookie));
    res = await res.text();                   
    return res;
}; //TODO

const timetable_body = 'win_2%22%2C%22ControlPath%22%3A%22~%2FSIS%2FModules%2FStudent%2FMyTimeTable%2FMyTimeTable';
async function timetable_req(cookie) {
    let res = await fetch(post_url(Date.now()), post_request(cookie, timetable_body));
    res = await res.text();                   
    res = parse_timetable(res);
    return res;
};

const classwork_body = 'win_13%22%2C%22ControlPath%22%3A%22~%2FSIS%2FModules%2FStudent%2FMyResult%2FClassWork%2FClassWork';
async function classwork_req(cookie) {
    let res = await fetch(post_url(Date.now()), post_request(cookie, classwork_body));
    res = await res.text();
    res = parse_classwork(res);
    return res;
};

const profile_body = "win_4%22%2C%22ControlPath%22%3A%22~%2FSIS%2FModules%2FStudent%2FMyProfile%2FMyProfile";
async function profile_req(cookie) {
    let res = await fetch(post_url(Date.now()), post_request(cookie, profile_body));
    res = await res.text();
    res = parse_profile(res);
    return res;
};

const report_body = "win_5%22%2C%22ControlPath%22%3A%22~%2FSIS%2FModules%2FStudent%2FGraduationReport%2FGraduationReport";
async function report_req(cookie) {
    let res = await fetch(post_url(Date.now()), post_request(cookie, report_body));
    res = await res.text();                   
    return res;
}; //TODO

const transcript_body = "win_3%22%2C%22ControlPath%22%3A%22~%2FSIS%2FModules%2FStudent%2FMyResult%2FTranscript%2FTranscript";
async function transcript_req(cookie) {
    let res = await fetch(post_url(Date.now()), post_request(cookie, transcript_body));
    res = await res.text();  
    res = parse_transcript(res);                 
    return res;
};

const regstatus_body = "win_17%22%2C%22ControlPath%22%3A%22~%2FSIS%2FModules%2FStudent%2FRegistrationStatus%2FRegistrationStatus";
async function regstatus_req(cookie) {
    let res = await fetch(post_url(Date.now()), post_request(cookie, regstatus_body));
    const html = await res.text();
    return res;
}; //TODO

module.exports = {
    login: login_req,
    absence: absence_req,
    timetable: timetable_req,
    classwrork: classwork_req,
    seatnumber: seatnumber_req,
    profile: profile_req,
    report: report_req,
    transcript: transcript_req,
    regstatus: regstatus_req,
    reg: reg_req
};