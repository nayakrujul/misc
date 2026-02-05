const times = {
    "Biology": {"Biological Processes": "4/6P", "Biological Diversity": "12/6A", "Unified Biology": "16/6A"},
    "Chemistry": {"Physical Chemistry": "2/6A", "Analytical Techniques": "9/6A", "Unified Chemistry": "15/6A"},
    "Computer Science": {"Programming": "12/5P", "Theory": "17/6A"},
    "Economics": {"Microeconomics": "11/5A", "Macroeconomics": "18/5P", "Themes in Economics": "4/6A"},
    "French": {"Listening, Reading, Writing": "8/6A", "Writing": "17/6A"},
    "Further Maths": {"Pure Core 1": "14/5P", "Pure Core 2": "21/5P", "Statistics": "5/6P", "Mechanics": "12/6P", "Discrete": "16/6P", "Add. Pure": "19/6P"},
    "Geography": {"Physical": "12/5A", "Human": "21/5P"},
    "Maths": {"Pure": "3/6P", "Pure & Statistics": "11/6P", "Pure & Mechanics": "18/6P"},
    "German": {"Listening, Reading, Writing": "19/5A", "Writing": "2/6A"},
    "Philosophy": {"Epistemology and ethics": "12/5A", "Metaphysics": "19/5A"},
    "Physics": {"Topics 1-6": "20/5P", "Topics 6-8": "1/6A", "Option Module & Practicals": "8/6A"},
    "Spanish": {"Listening, Reading, Writing": "4/6A", "Writing": "12/6P"},
}

const sel = document.getElementById("subsel");
Object.keys(times).forEach(s => {
    let id = s.toLowerCase().replaceAll(" ", "-");
    sel.innerHTML += `<option value="${id}" id="${id}">${s}</option>`
});

const div = document.getElementById("subjects");
const fm = document.getElementById("fm-div");
const fmsel = document.getElementById("fm-sel");

let selected = [];

function remove({target}) {
    let id = target.id.slice(7);
    document.getElementById(id).disabled = false;
    selected.splice(selected.indexOf(id), 1);
    target.parentElement.remove();
    localStorage.setItem("countdown.subjects", selected.join(","));
    hide_fm();
    add_exams();
}

function hide_fm(){
    fm.hidden = !selected.includes("further-maths");
}

function title_case(str) {
    return str.replace("-", " ").replace(/\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

function format_date(d, m, y) {
    let date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-GB", {
        weekday: "short", day: "numeric", month: "long"
    });
}

function zfill(s, k=2) {
    return (s + "").padStart(k, "0");
}

function add_exams() {
    [...document.querySelectorAll("div.exam")].forEach(el => el.remove());
    let exams = [];
    selected.forEach(subj => {
        if (!Object.keys(times).includes(title_case(subj))) return;
        let tim = times[title_case(subj)];
        let i = 1;
        Object.keys(tim).forEach(pap => {
            if (subj === "further-maths" && !fmsel.value.includes(pap[0])) return;
            let dat = tim[pap];
            let d = +dat.split("/")[0];
            let m = +dat.split("/")[1][0];
            let t = dat.endsWith("A") ? 0 : 1;
            exams.push([i, subj, pap, m, d, t]);
            i++;
        });
    });
    exams.sort((a, b) =>
        (a[3] * 1000 + a[4] * 10 + a[5]) - (b[3] * 1000 + b[4] * 10 + b[5])
    );
    exams.forEach(([i, s, p, m, d, t]) => {
        let ex = document.createElement("div");
        ex.classList.add("exam", s);
        ex.innerHTML = `
            <h2 class="name">${title_case(s)}</h2>
            <b class="paper">Paper ${i}: ${p}</b> <br />
            <span class="time">
                ${format_date(d, m, 2026)}
                (${t == 0 ? "AM" : "PM"})
            </span>
            <h1 class="countdown" datetime="2026-${zfill(m)}-${zfill(d)}T${['08', '13'][t]}:30:00">
                0d 00:00:00
            </h1>
        `;
        document.getElementById("countdowns-flex").appendChild(ex);
    });
    update_countdowns();
}

function update_countdowns() {
    let now = Date.now();
    [...document.querySelectorAll("h1.countdown")].forEach(h1 => {
        let target = new Date(h1.getAttribute("datetime"));
        let total = Math.round((target - now) / 1000);
        let neg = total < 0;
        total = Math.abs(total);
        let days = Math.floor(total / (24 * 60 * 60));
        total %= 24 * 60 * 60;
        let hrs = Math.floor(total / (60 * 60));
        total %= 60 * 60;
        let mins = Math.floor(total / 60);
        let secs = total % 60;
        if (neg) {
            days = "-" + days;
            h1.parentElement.classList.add("completed");
        }
        h1.innerHTML = `${days}d ${zfill(hrs)}:${zfill(mins)}:${zfill(secs)}`;
    });
}

function sel_handler() {
    if (sel.value !== "") {
        selected.push(sel.value);
        document.getElementById(sel.value).disabled = true;
        let sub = document.createElement("span");
        sub.classList.add("subject", sel.value);
        sub.innerHTML = document.getElementById(sel.value).innerHTML +
            ` <span id="remove-${sel.value}" class="remove">&times;</span>`;
        div.insertBefore(sub, sel);
        document.getElementById("remove-" + sel.value)
            .addEventListener("click", remove);
        sel.value = "";
        localStorage.setItem("countdown.subjects", selected.join(","));
        hide_fm();
        add_exams();
    }
}

let storfm = localStorage.getItem("countdown.fm");
if (storfm !== null) fmsel.value = storfm;

let storsubj = localStorage.getItem("countdown.subjects");
if (storsubj !== null) {
    storsubj.split(",").forEach(s => {
        sel.value = s;
        sel_handler();
    });
}

sel.addEventListener("input", sel_handler);

fmsel.addEventListener("input", () => {
    localStorage.setItem("countdown.fm", fmsel.value);
    add_exams();
});

setInterval(update_countdowns, 200);
