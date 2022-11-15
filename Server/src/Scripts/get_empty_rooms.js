function get_building(room) {
    if (room === null) {
        return;
    } else if (room.length === 2) {
        //TODO: implement how to guess two empty rooms
        return;
    } else {
        roomS = room.toString();
        if (roomS.length > 4) {            
            return parseInt(roomS.slice(0, 2))
        } else if (roomS.length === 4) {
            return parseInt(roomS.slice(0, 1))
        } else if (room === 0) {
            return 0;
        }
    } 
}

function get_empty_rooms(rooms, buildings, day, time) {
    let room_w = []
    let room_a = []

    for (room of rooms) {
        const building = get_building(room.room)
        if (buildings.includes(building)) {
            if (!room_a.includes(room.room)) {room_a.push(room.room);}
            if(room.day === day && (time > room.begin && time < room.end)) {
                room_w.push(room.room)
            }
        }
    }

    room_a = room_a.filter(function(el) {
        return !room_w.includes(el);
    })

    return room_a.sort();
}

module.exports = get_empty_rooms