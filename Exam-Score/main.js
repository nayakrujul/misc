const dlb = document.getElementById("download");
const cnv = document.getElementById("canvas");
const tbl = document.getElementById("table");
const scr = document.getElementById("score");
const clr = document.getElementById("clear");
const clk = document.getElementById("click");
const btn = document.getElementById("addq");
const nam = document.getElementById("name");

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

function createImage() {
    const ctx = cnv.getContext('2d');
    ctx.textAlign = "center";
    ctx.fillStyle = "turquoise";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.font = "60px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(nam.value || "Exam Score", cnv.width / 2, 100);
    ctx.font = "50px Arial";
    ctx.fillStyle = "beige";
    ctx.fillText("rujulnayak.com", cnv.width / 2, cnv.height - 50);
    let [text1, text2] = scr.innerHTML.split(" ");
    ctx.fillStyle = "blue";
    ctx.font = "200px Arial";
    ctx.fillText(text1, cnv.width / 2, cnv.height / 2 - 50);
    ctx.fillStyle = "green";
    ctx.font = "150px Arial";
    ctx.fillText(text2, cnv.width / 2, cnv.height / 2 + 200);
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

nam.addEventListener("input", () => localStorage.setItem(`exam-score.name`, encodeURIComponent(nam.value)));
btn.addEventListener("click", () => add_row());
clr.addEventListener("click", clear_table);
dlb.addEventListener("click", createImage);

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