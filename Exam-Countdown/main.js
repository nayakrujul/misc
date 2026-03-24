let times = {
    "Biology (AQA)": {"Topics 1-4": "4/6P", "Topics 5-8": "12/6A", "All Topics & Practicals": "16/6A"},
    "Biology (OCR A)": {"Biological Processes": "4/6P", "Biological Diversity": "12/6A", "Unified Biology": "16/6A"},
    "Biology (OCR B)": {"Fundamentals": "4/6P", "Scientific Literacy": "12/6A", "Practical Skills": "16/6A"},
    "Chemistry (AQA)": {"Inorganic Chemistry": "2/6A", "Organic Chemistry": "9/6A", "All Topics & Practicals": "15/6A"},
    "Chemistry (OCR A)": {"Physical Chemistry": "2/6A", "Analytical Techniques": "9/6A", "Unified Chemistry": "15/6A"},
    "Chemistry (OCR B)": {"Fundamentals": "2/6A", "Scientific Literacy": "9/6A", "Practical Skills": "15/6A"},
    "Computer Science (AQA)": {"Programming": "10/6P", "Theory": "17/6A"},
    "Computer Science (OCR)": {"Theory": "10/6P", "Programming": "17/6A"},
    "Economics (AQA)": {"Markets": "11/5A", "National and International": "18/5P", "Economic Principles": "4/6A"},
    "Economics (OCR)": {"Microeconomics": "11/5A", "Macroeconomics": "18/5P", "Themes in Economics": "4/6A"},
    "French (AQA)": {"Listening, Reading, Writing": "8/6A", "Writing": "17/6A"},
    "Further Maths (AQA)": {"Pure 1": "21/5P", "Pure 2": "5/6P", "Option Topics": "12/6P"},
    "Further Maths (OCR A)": {
        "Pure Core 1": "14/5P", "Pure Core 2": "21/5P", "Statistics": "5/6P",
        "Mechanics": "12/6P", "Discrete": "16/6P", "Additional Pure": "19/6P"
    },
    "Further Maths (OCR B)": {
        "Pure Core": "14/5P", "Further Pure with Technology": "19/5P", "Algorithmic Modelling": "21/5P",
        "Mechanics": "5/6P", "Statistics": "12/6P", "Extra Pure": "16/6P", "Numerical Methods": "19/6P"
    },
    "Geography (AQA)": {"Physical": "12/5A", "Human": "21/5P"},
    "Geography (OCR)": {"Physical": "12/5A", "Human": "21/5P", "Debates": "8/6P"},
    "German (AQA)": {"Listening, Reading, Writing": "19/5A", "Writing": "2/6A"},
    "Maths (AQA)": {"Pure": "3/6P", "Mechanics": "11/6P", "Statistics": "18/6P"},
    "Maths (OCR A)": {"Pure": "3/6P", "Pure & Statistics": "11/6P", "Pure & Mechanics": "18/6P"},
    "Maths (OCR B)": {"Pure & Mechanics": "3/6P", "Pure & Statistics": "11/6P", "Pure & Comprehension": "18/6P"},
    "Philosophy (AQA)": {"Epistemology and ethics": "12/5A", "Metaphysics": "19/5A"},
    "Physics (AQA)": {"Topics 1-6": "20/5P", "Topics 6-8": "1/6A", "Option Module & Practicals": "8/6A"},
    "Physics (OCR A)": {"Modelling": "20/5P", "Exploring": "1/6A", "Unified": "8/6A"},
    "Physics (OCR B)": {"Fundamentals": "20/5P", "Scientific Literacy": "1/6A", "Practical Skills": "8/6A"},
    "Spanish (AQA)": {"Listening, Reading, Writing": "4/6A", "Writing": "12/6P"},
    "STEP": {"STEP II": "4/6A", "STEP III": "10/6A"}
}

const sel = document.getElementById("subsel");
Object.keys(times).forEach(s => {
    let id = s.toLowerCase().replaceAll(" ", "-");
    sel.innerHTML += `<option value="${id}" id="${id}">${s}</option>`
});

const div = document.getElementById("subjects");
const fma = document.getElementById("fm-div-a");
const fmb = document.getElementById("fm-div-b");
const fmsela = document.getElementById("fm-sel-a");
const fmselb = [...fmb.querySelectorAll("input")];

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
    fma.hidden = !selected.includes("further-maths-(ocr-a)");
    fmb.hidden = !selected.includes("further-maths-(ocr-b)");
}

function title_case(str) {
    return str.replaceAll("-", " ").replace(/\((.*?)\)|(\w\S*)/g, (match, group1, group2) => {
        if (group1 !== undefined) return match.toUpperCase();
        return group2.charAt(0).toUpperCase() + group2.substring(1).toLowerCase();
    });
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
        if (!Object.keys(times).map(title_case).includes(title_case(subj))) return;
        let tim = times[subj.toUpperCase() === "STEP" ? "STEP" : title_case(subj)];
        let i = 1;
        Object.keys(tim).forEach(pap => {
            if (subj === "further-maths-(ocr-a)" && !fmsela.value.includes(pap[0])) return;
            else if (subj === "further-maths-(ocr-b)" &&
                !document.getElementById("fm-sel-b-" + pap[0].toLowerCase()).checked) return;
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
        ex.classList.add("exam", s.split('-(')[0].trim());
        ex.innerHTML = `
            <h2 class="name">${s === 'step' ? 'STEP' : title_case(s)}</h2>
            <b class="paper">${s === 'step' ? '' : 'Paper ' + i + ': '}${p}</b> <br />
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
        sub.classList.add("subject", sel.value.split('-(')[0].trim());
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
if (storfm !== null) fmsela.value = storfm;

let storfmb = localStorage.getItem("countdown.fmb");
if (storfmb !== null) fmselb.forEach(x => x.checked = storfmb.includes(x.id.slice(-1)));

let storsubj = localStorage.getItem("countdown.subjects");
if (storsubj !== null) {
    storsubj.split(",").forEach(s => {
        sel.value = s;
        sel_handler();
    });
}

sel.addEventListener("input", sel_handler);

fmsela.addEventListener("input", () => {
    localStorage.setItem("countdown.fm", fmsela.value);
    add_exams();
});

fmselb.forEach(inp => inp.addEventListener("input", () => {
    localStorage.setItem("countdown.fmb", fmselb.map(x => x.checked ? x.id.slice(-1) : "").join(""));
    add_exams();
}))

setInterval(update_countdowns, 200);
