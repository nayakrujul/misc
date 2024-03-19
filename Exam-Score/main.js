const okc = document.getElementById("okcookie");
const cks = document.getElementById("cookies");
const tbl = document.getElementById("table");
const scr = document.getElementById("score");
const btn = document.getElementById("addq");

function delete_row(element) {
    element.parentElement.parentElement.remove();
    if ([...document.querySelectorAll(".del-btn")].length === 0) {
        add_row();
    }
    calculate_score();
}

function add_row(l=undefined) {
    if (l === undefined) {
        l = ["", "", ""]
    }
    let row = document.createElement("tr");
    [...Array(3).keys()].forEach(i => {
        let data = document.createElement("td");
        let inpt = document.createElement("input");
        inpt.type = i ? "number" : "text";
        if (i !== 0) {
            inpt.min = 0;
        }
        inpt.value = l[i];
        inpt.classList.add("input-box");
        inpt.addEventListener("input", calculate_score);
        data.appendChild(inpt);
        row.appendChild(data);
    });
    let dt = document.createElement("td");
    let btn = document.createElement("input");
    btn.type = "button";
    btn.value = "-";
    btn.onclick = () => delete_row(btn);
    btn.classList.add("del-btn");
    dt.appendChild(btn);
    row.appendChild(dt);
    tbl.appendChild(row);
    row.firstChild.firstChild.focus();
    save();
}

function calculate_score() {
    let a = 0; let b = 0;
    let rows = [...tbl.rows];
    rows.shift();
    rows.forEach(r => {
        let [_, mks, max, __] = [...r.children].map(x => x.firstChild);
        mks.value = mks.value ? Math.abs(mks.value) : "";
        max.value = max.value ? Math.abs(max.value) : "";
        a += Math.min(+mks.value, +max.value);
        b += +max.value;
    });
    scr.innerHTML = a + "/" + b + " (" + (((a / b) || 0) * 100).toFixed(2) + "%)";
    save();
}

function remove_banner() {
    cks.hidden = true;
    document.cookie = "cookiesAllowed=1;domain=misc.rujulnayak.com";
}

function get_cookies() {
    let str = document.cookie.split(";");
    let d = {};
    for (i = 0; i < str.length; i++) {
        if (str[i] === "") continue;
        let c = str[i].split("=");
        d[c[0].trim()] = c[1].trim();
    }
    return d;
}

function sanitise(string) {
    return string.replaceAll("\\", "\\\\").replaceAll("||", "\\pipes").replaceAll(",", "\\comma");
}

function desanitise(string) {
    return string.replaceAll("\\\\", "\\").replaceAll("\\pipes", "||").replaceAll("\\comma", ",");
}

function save() {
    let rows = [...tbl.rows];
    rows.shift();
    let output = [];
    rows.forEach(r => {
        let [nm, mks, max, _] = [...r.children].map(x => x.firstChild.value);
        output.push([sanitise(nm), mks, max].join(","));
    });
    document.cookie = `data=${output.join("||")};domain=misc.rujulnayak.com`;
    console.log("AUTOSAVED:", output.join("||"));
}

function load(string) {
    let lst = string.split("||");
    for (i = 0; i < lst.length; i++) {
        console.log(lst[i]);
        let [a, b, c] = lst[i].split(",");
        add_row([desanitise(a), b, c]);
    }
    calculate_score();
}

btn.addEventListener("click", () => add_row());

okc.addEventListener("click", remove_banner);

if (get_cookies()["cookiesAllowed"]) remove_banner();

if (data = get_cookies()["data"]) {
    load(data);
} else {
    add_row();
}

document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        save();
    }
});