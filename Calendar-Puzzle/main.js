const ms = document.getElementById("month");
const ds = document.getElementById("date");
const ws = document.getElementById("weekday");

const cs = document.getElementById("compute");
const gr = document.getElementById("grid");
const ro = document.getElementById("revone");
const ra = document.getElementById("revall");


function cell(i, j) {
    return document.getElementById("cell-" + i + j);
}


for (let i = 0; i < 8; i++) {
    let div = document.createElement("div");
    div.classList.add("row");
    div.innerHTML = [...Array(7).keys()].map(
        j => `<div class="unfilled cell" id="cell-${i}${j}"></div>`
    ).join(" ");
    gr.appendChild(div);
}

["06", "16", "70", "71", "72", "73"].forEach(n => {
    let c = cell(n, "");
    c.classList.remove("unfilled");
    c.classList.add("blocked");
});


let today = new Date();

["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].forEach((mn, mi) => {
    let me = document.createElement("option");
    me.value = mi;
    me.innerHTML = mn;
    ms.appendChild(me);
    cell(...divmod(mi, 6)).innerHTML = mn;
    if (mi === today.getMonth()) {
        ms.value = mi;
        cell(...divmod(mi, 6)).classList.add("today");
    }
});

Array(31).keys().forEach(d => {
    let de = document.createElement("option");
    de.value = d;
    de.innerHTML = d + 1;
    ds.appendChild(de);
    cell(...divmod(d + 14, 7)).innerHTML = d + 1;
    if (d + 1 === today.getDate()) {
        ds.value = d;
        cell(...divmod(d + 14, 7)).classList.add("today");
    }
});

["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((wn, wi) => {
    let we = document.createElement("option");
    we.value = wi;
    we.innerHTML = wn;
    ws.appendChild(we);
    let [a, b] = divmod(wi - 1, 3);
    if (wi === 0) [a, b] = [0, -1];
    cell(a + 6, b + 4).innerHTML = wn;
    if (wi === today.getDay()) {
        ws.value = wi;
        cell(a + 6, b + 4).classList.add("today");
    }
});


let sol = undefined;
let pnum = 0;

function shuffle(arr) {
    let ret = [];
    while (arr.length) {
        let ix = Math.floor(Math.random() * arr.length);
        ret.push(arr.splice(ix, 1)[0]);
    }
    return ret;
}

function reveal_next() {
    if (!sol || !sol.length) return;
    let [p, i, j] = sol.shift();
    for (let x = 0; x < p.length; x++)
        for (let y = 0; y < p[x].length; y++)
            if (p[x][y]) {
                cell(x + i, y + j).classList.remove("unfilled");
                cell(x + i, y + j).classList.add("piece" + pnum);
            }
    pnum++;
}

function date_updated() {
    ro.classList.remove("ready");
    ra.classList.remove("ready");
    cs.classList.remove("disabled");
    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 7; y++)
            if (!["06", "16", "70", "71", "72", "73"].includes("" + x + y)) {
                let c = cell(x, y);
                c.className = "cell unfilled";
                if (x * 6 + y === +ms.value) c.classList.add("today");
                if ((x - 2) * 7 + y === +ds.value) c.classList.add("today");
                if ((x - 6) * 3 + y - 3 === +ws.value && x > 5) c.classList.add("today");
            }
}

cs.addEventListener("click", () => {
    let solr = solve(
        block_date(BOARD, +ms.value, +ds.value, +ws.value),
        pcs,
        []
    );
    sol = shuffle(solr);
    ro.classList.add("ready");
    ra.classList.add("ready");
    cs.classList.add("disabled");
    pnum = 0;
});

ro.addEventListener("click", () => {
    if (ro.classList.contains("ready")) reveal_next();
});

ra.addEventListener("click", () => {
    while (pnum < 10) reveal_next();
});

ms.addEventListener("change", date_updated);
ds.addEventListener("change", date_updated);
ws.addEventListener("change", date_updated);
