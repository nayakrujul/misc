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
    [...Array(3).keys()].forEach(i => {
        let data = document.createElement("td");
        let inpt = document.createElement("input");
        inpt.type = i ? "number" : "text";
        if (i !== 0) {
            inpt.min = 0;
        }
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
}

add_row();

window.onbeforeunload = function() {
    return "You have unsaved changes.";
}