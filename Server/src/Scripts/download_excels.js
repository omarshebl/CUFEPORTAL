const { data } = require("jquery");
const jsdom = require("jsdom");
const Downloader = require("nodejs-file-downloader");
const {extract_room, extract_schid, extract_time_to24} = require("./extractClassEntry")


async function get_classes_html() {
    const res = await fetch('http://chreg.eng.cu.edu.eg/ClassList.aspx?s=1');
    const html = await res.text();
    return html
}

async function parse_html(string) {
    const dom = new jsdom.JSDOM(string);
    const document = dom.window.document;
    table = document.getElementById("GridView1");
    tbody = table.querySelector("tbody");
    rows = tbody.querySelectorAll("tr");

    const website = 'http://chreg.eng.cu.edu.eg/';
    let data = [];

    for(let i = 1; i < rows.length; i++) {
        columns = rows[i].getElementsByTagName("td");
        
        course_code = columns[0].textContent;
        course_name = columns[1].textContent;
        class_room = columns[2].textContent;
        session_type = columns[3].textContent;
        day_name = columns[4].textContent;
        begin_time = columns[5].textContent;
        end_time = columns[6].textContent;
        gp = columns[7].textContent;
        lnk = (columns[8].getElementsByTagName("a"))[0].getAttribute("href");
        
        schoolid = extract_schid(lnk);
        class_room =  extract_room(class_room);
        begin_time = extract_time_to24(begin_time);
        end_time = extract_time_to24(end_time);
        lnk = website+lnk;

        data.push({
            index:   i,
            schid:   schoolid,
            course:  course_code,
            name:    course_name,
            room:    class_room,
            type:    session_type,
            day:     day_name,
            begin:   begin_time,
            end:     end_time,
            group:   gp,
            link:    lnk
        });
    }
    return data;
}

async function dowload_link(entry, directory){
    const downloader = new Downloader({
        url: entry.link,
        directory: directory,
        fileName: `${entry.index}_${entry.schid}_${entry.course}_${entry.type}.xlsx`,
        maxAttempts: 5
    });

    try {
        await downloader.download();
    } catch (error) {
        console.log(`Download failed for ${entry.link}`, error);
    }
}


async function download_excels(directory) {
    console.time("Excels Download Time")

    const html = await get_classes_html();
    const data = await parse_html(html);

    for (const entry of data) {
        await dowloadL_link(entry, directory);
    }

    console.timeEnd("Excels Download Time")
    return data[data.length].index
}

module.exports = download_excels