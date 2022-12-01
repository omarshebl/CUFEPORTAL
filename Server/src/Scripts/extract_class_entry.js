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

function extract_schid(schid) {
    schid = schid.split("?");
    schid = schid[1].split("&");
    return schid[0].split("=")[1];
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

module.exports = {extract_room, extract_schid, extract_time_to24}