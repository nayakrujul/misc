const pvw = document.getElementById("view");
const cnv = document.getElementById("canvas");
const tbl = document.getElementById("table");
const scr = document.getElementById("score");
const clr = document.getElementById("clear");
const clk = document.getElementById("click");
const btn = document.getElementById("addq");
const nam = document.getElementById("name");
const dld = document.getElementById("download")

const colours = ["#ffcccc", "#ffe0cc", "#fff296", "#b2d8b2", "#92ccff", "#f2e0ff"];
const fonts = ["Trebuchet MS", "sans-serif", "serif", "cursive", "fantasy", "monospace"]

function delete_row(element) {
    element.parentElement.parentElement.remove();
    if ([...document.querySelectorAll(".del-btn")].length === 0) {
        add_row();
    }
    calculate_score();
}

function add_row(l=undefined, dosave=true) {
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
    btn.value = "×";
    btn.onclick = () => delete_row(btn);
    btn.classList.add("del-btn");
    dt.appendChild(btn);
    row.appendChild(dt);
    tbl.appendChild(row);
    row.firstChild.firstChild.focus();
    if (dosave) save();
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

function save() {
    let rows = [...tbl.rows];
    rows.shift();
    let output = [];
    rows.forEach(r => {
        let [nm, mks, max, _] = [...r.children].map(x => x.firstChild.value);
        output.push([encodeURIComponent(nm), mks, max].join(","));
    });
    localStorage.setItem(`exam-score.data`, output.join("||"));
    localStorage.setItem(`exam-score.name`, encodeURIComponent(nam.value));
    if (!cnv.hidden) create_image();
}

function load(string, pname) {
    let lst = string.split("||");
    for (i = 0; i < lst.length; i++) {
        let [a, b, c] = lst[i].split(",");
        add_row([decodeURIComponent(a), b, c], false);
    }
    calculate_score();
    nam.value = pname;
}

function clear_table() {
    let rows = [...tbl.rows];
    rows.shift();
    rows.forEach(row => row.remove());
    add_row();
    nam.value = "";
    calculate_score();
}

function create_image() {
    let font_face = fonts[sel_font];
    const ctx = cnv.getContext('2d');
    ctx.textAlign = "center";
    ctx.fillStyle = colours[sel_clr];
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.font = "60px " + font_face;
    ctx.fillStyle = "black";
    ctx.fillText(nam.value || "Exam Score", cnv.width / 2, 100);
    ctx.font = "40px " + font_face;
    ctx.fillStyle = "#888888";
    ctx.fillText("misc.rujulnayak.com/exam-score", cnv.width / 2, cnv.height - 40);
    let [text1, text2] = scr.innerHTML.split(" ");
    ctx.fillStyle = "#004080";
    ctx.font = "200px " + font_face;
    ctx.fillText(text1, cnv.width / 2, cnv.height / 2 - 50);
    ctx.fillStyle = "#008000";
    ctx.font = "150px " + font_face;
    ctx.fillText(text2, cnv.width / 2, cnv.height / 2 + 200);
}

function download_image() {
    let data = cnv.toDataURL('image/png');
    clk.href = data;
    clk.download = `exam-score-${
        encodeURIComponent(
            nam.value
            .toLowerCase()
            .replaceAll(" ", "-")
        ).replaceAll(/%../g, "")
    }.png`;
    clk.click();
}

let sel_clr = 0;
let clrs = document.createElement("div");
clrs.id = "colours-div";
clrs.hidden = true;
clrs.innerHTML = colours.map((c, i) =>
    `<span id="clr-${i}" class="colour ${i === 0 ? 'selected': ''}" style="background-color: ${c};"></span>`
).join(" ");
document.body.insertBefore(clrs, cnv);
[...clrs.querySelectorAll("span.colour")].forEach(span => span.addEventListener("click", ({target}) => {
    document.getElementById("clr-" + sel_clr).classList.remove("selected");
    sel_clr = +target.id.slice(4);
    target.classList.add("selected");
    save();
}));

let sel_font = 0;
let fnts = document.createElement("div");
fnts.id = "fonts-div";
fnts.hidden = true;
fnts.innerHTML = fonts.map((f, i) =>
    `<span id="font-${i}" class="font ${i === 0 ? 'selected': ''}" style="font-family: ${f}">A</span>`
).join(" ");
document.body.insertBefore(fnts, cnv);
[...fnts.querySelectorAll("span.font")].forEach(span => span.addEventListener("click", ({target}) => {
    document.getElementById("font-" + sel_font).classList.remove("selected");
    sel_font = +target.id.slice(5);
    target.classList.add("selected");
    save();
}));

nam.addEventListener("input", save);
btn.addEventListener("click", () => add_row());
clr.addEventListener("click", clear_table);
pvw.addEventListener("click", () => {
    cnv.hidden = dld.hidden = clrs.hidden = fnts.hidden = !cnv.hidden;
    save();
});
dld.addEventListener("click", download_image);

if (data = localStorage.getItem("exam-score.data"))
    load(data, decodeURIComponent(localStorage.getItem("exam-score.name") || ""));
else add_row();

document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey)) {
        switch (e.key) {
            case "s":
                e.preventDefault();
                save();
                break;
            case "a":
                e.preventDefault();
                add_row();
                break;
            case "d":
                e.preventDefault();
                clear_table();
                break;
        }
    }
});
