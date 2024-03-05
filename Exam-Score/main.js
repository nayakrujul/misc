const tbl = document.getElementById("table");
const scr = document.getElementById("score");

function delete_row(element) {
    element.parentElement.parentElement.remove();
    if ([...document.querySelectorAll(".del-btn")].length === 0) {
        add_row();
    }
    calculate_score();
}

function add_row() {
    let row = document.createElement("tr");
    [...Array(3)].forEach(_ => {
        let data = document.createElement("td");
        let inpt = document.createElement("input");
        inpt.type = "text";
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
}

function extract_number(str){
    return [...str.matchAll(/\d+/g)].join("");
}

function calculate_score() {
    let a = 0; let b = 0;
    let rows = [...tbl.rows];
    rows.shift();
    rows.forEach(r => {
        let [_, mks, max, __] = [...r.children].map(x => x.firstChild);
        if (m = extract_number(max.value)) {
            let n = +extract_number(mks.value);
            a += Math.min(+m, n); b += +m;
        }
    });
    scr.innerHTML = a + "/" + b + " (" + (((a / b) || 0) * 100).toFixed(2) + "%)";
}

add_row();

window.onbeforeunload = function() {
    return "You have unsaved changes.";
}