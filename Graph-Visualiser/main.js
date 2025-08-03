const graph = document.getElementById("canvas");
const ctx = graph.getContext('2d');

const width = graph.width;

const ns = document.getElementById("nodes");
const es = document.getElementById("edges");

const dir = document.getElementById("directed");
const add = document.getElementById("add-node");
const spe = document.getElementById("spacing");
const con = document.getElementById("connect");
const ral = document.getElementById("rem-all");

const rad = 100;

let moving = 0;
let selected = -1;
let hl = -1;
let mouse_over = -1;

let centre = [0, 0]
let new_edge = [0, 0];

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function scale(x, y) {
    let rect = graph.getBoundingClientRect();
    let newx = (x + 5) * (width / rect.width);
    let newy = (y + 5) * (width / rect.height);
    return [Math.round(newx), Math.round(newy)];
}

function clamp(n, min=-1000, max=1000) {
    return Math.min(max, Math.max(min, n));
}

function closest_point(cx, cy, px, py) {
    let dx = px - cx;
    let dy = py - cy;
    let dist = distance(cx, cy, px, py);
    if (dist === 0) return [cx + rad, cy];
    let sc = rad / dist;
    return [cx + dx * sc, cy + dy * sc]
}

function spaced_points(n, r) {
    let points = [];
    let step = (2 * Math.PI) / n;
    for (let i = 0; i < n; i++) {
        let angle = - Math.PI / 2 - step / 2 + i * step;
        let x = r * Math.cos(angle);
        let y = r * Math.sin(angle);
        points.push([Math.round(x), Math.round(y)]);
    }
    return points;
}

function eq(a, b) {
    if (Array.isArray(a)) {
        if (Array.isArray(b)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++)
                if (!eq(a[i], b[i])) return false;
            return true
        } else return false;
    } else if (Array.isArray(b)) return false;
    else return a === b;
}

function contains(arr, item) {
    for (let i = 0; i < arr.length; i++)
        if (eq(arr[i], item)) return true;
    return false;
}

function clear() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, width);
}

function draw_node(x, y, label, back) {
    if (back === 0) {
        ctx.beginPath();
        ctx.arc(x, y, rad * 0.8, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
        ctx.fill();
    } else if (back === 1) {
        ctx.beginPath();
        ctx.arc(x, y, rad * 1.2, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, rad * 0.8, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.font = '40px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
}

function draw_line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (dir.checked) draw_arrow_head(x1, y1, x2, y2);
}

function draw_arrow_head(x1, y1, x2, y2) {
    let angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
        x2 - rad / 2 * Math.cos(angle - Math.PI / 6),
        y2 - rad / 2 * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        x2 - rad / 2 * Math.cos(angle + Math.PI / 6),
        y2 - rad / 2 * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
}

function draw_nodes() {
    Array.from(ns.rows).slice(1).forEach((row, i) => {
        let lbl = row.cells[1].querySelector("input.text").value;
        let [xinp, yinp] = [...row.cells[2].querySelectorAll("input.num")];
        draw_node(+xinp.value + width / 2, +yinp.value + width / 2, lbl, i === mouse_over ? hl : -1);
    });
}

function draw_edges() {
    Array.from(es.rows).slice(1).forEach(row => {
        let fn = +row.cells[0].querySelector("select.dropdown").value;
        let tn = +row.cells[1].querySelector("select.dropdown").value;
        let [x1i, y1i] = [...ns.rows[fn + 1].cells[2].querySelectorAll("input.num")];
        let [x2i, y2i] = [...ns.rows[tn + 1].cells[2].querySelectorAll("input.num")];
        let [x1, y1] = closest_point(+x1i.value + width / 2, +y1i.value + width / 2, +x2i.value + width / 2, +y2i.value + width / 2);
        let [x2, y2] = closest_point(+x2i.value + width / 2, +y2i.value + width / 2, +x1i.value + width / 2, +y1i.value + width / 2);
        draw_line(x1, y1, x2, y2);
    });
}

function draw_new_edge() {
    let [x, y] = closest_point(centre[0], centre[1], new_edge[0], new_edge[1]);
    draw_line(x, y, new_edge[0], new_edge[1]);
}

function clamp_positions() {
    Array.from(ns.rows).slice(1).forEach(row => {
        let [xinp, yinp] = [...row.cells[2].querySelectorAll("input.num")];
        xinp.value = Math.round(clamp(+xinp.value));
        yinp.value = Math.round(clamp(+yinp.value));
    });
}

function fix_dropdowns() {
    Array.from(es.rows).slice(1).forEach(row => {
        let s1 = row.cells[0].querySelector("select.dropdown");
        let s2 = row.cells[1].querySelector("select.dropdown");
        Array.from(s1.options).forEach((o1, i1) => {
            o1.disabled = o1.value === s2.value;
            o1.innerHTML = `#${i1 + 1} (${ns.rows[i1 + 1].cells[1].querySelector("input.text").value})`;
        });
        Array.from(s2.options).forEach((o2, i2) => {
            o2.disabled = o2.value === s1.value;
            o2.innerHTML = `#${i2 + 1} (${ns.rows[i2 + 1].cells[1].querySelector("input.text").value})`;
        });
    });
}

function input() {
    clamp_positions();
    fix_dropdowns();
    clear();
    draw_nodes();
    draw_edges();
    if (moving == 2) draw_new_edge();
}

function remove({target}) {
    let row = target.parentElement.parentElement;
    let index = +row.cells[0].innerHTML - 1;
    row.remove();
    Array.from(ns.rows).slice(index + 1).forEach((r, i) => r.cells[0].innerHTML -= 1);
    Array.from(es.rows).slice(1).forEach(r => {
        let s1 = r.cells[0].querySelector("select.dropdown");
        let s2 = r.cells[1].querySelector("select.dropdown");
        if (+s1.value == index || +s2.value == index) {
            r.remove();
            return;
        }
        Array.from(s1.options).forEach((o1, i1) => {
            if (i1 === index) o1.remove();
            if (i1 > index) {
                o1.value -= 1;
                o1.innerHTML = o1.innerHTML.replace(/#(\d+)/, (_, num) => `#${+num - 1}`);
            }
        });
        Array.from(s2.options).forEach((o2, i2) => {
            if (i2 === index) o2.remove();
            if (i2 > index) {
                o2.value -= 1;
                o2.innerHTML = o2.innerHTML.replace(/#(\d+)/, (_, num) => `#${+num - 1}`);
            }
        });
    });
    input();
}

function remove2({target}) {
    let row = target.parentElement.parentElement;
    row.remove();
    input();
}

function remove3() {
    [...es.querySelectorAll("span.remove")].forEach(el => el.click());
}

function swap({target}) {
    let row = target.parentElement.parentElement;
    let s1 = row.cells[0].querySelector("select.dropdown");
    let s2 = row.cells[1].querySelector("select.dropdown");
    let v1 = s1.value;
    let v2 = s2.value;
    s1.options[v2].disabled = false;
    s2.options[v1].disabled = false;
    s1.value = v2;
    s2.value = v1;
    s1.options[v1].disabled = true;
    s2.options[v2].disabled = true;
    input()
}

function add_edge(i, j) {
    let rs = Array.from(es.rows).slice(1);
    for (let ind = 0; ind < rs.length; ind++) {
        if (
            rs[ind].cells[0].querySelector("select.dropdown").value == i &&
            rs[ind].cells[1].querySelector("select.dropdown").value == j
        ) return;
    }
    let tr = document.createElement("tr");
    tr.innerHTML = `
        <td><select class="dropdown">
            ${Array.from(ns.rows).slice(1).map((r, ix) =>
                `<option value="${ix}" ${ix === i ? 'selected' : ''} ${ix === j ? 'disabled' : ''}>
                    #${ix + 1} (${r.cells[1].querySelector("input.text").value})
                </option>`
            )}
        </select></td>
        <td><select class="dropdown">
            ${Array.from(ns.rows).slice(1).map((r, ix) =>
                `<option value="${ix}" ${ix === j ? 'selected' : ''} ${ix === i ? 'disabled' : ''}>
                    #${ix + 1} (${r.cells[1].querySelector("input.text").value})
                </option>`
            )}
        </select></td>
        <td><span class="swap">&#8644;</span></td>
        <td><span class="remove">&times;</span></td>
    `;
    es.appendChild(tr);
    [...tr.querySelectorAll("select.dropdown")].forEach(sel => sel.addEventListener("input", input));
    tr.querySelector("span.swap").addEventListener("click", swap);
    tr.querySelector("span.remove").addEventListener("click", remove2);
    input();
}

function add_node() {
    let tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${ns.rows.length}</td>
        <td><input type="text" value="${String.fromCharCode(65 + ((ns.rows.length - 1) % 26))}" class="text" /></td>
        <td>(
            <input type="number" value="0" class="num" />,
            <input type="number" value="0" class="num" />
        )</td>
        <td><span class="remove">&times;</span></td>
    `;
    ns.appendChild(tr);
    [...tr.querySelectorAll("input")].forEach(inp => inp.addEventListener("input", input));
    tr.querySelector("span.remove").addEventListener("click", remove);
    input();
}

function space_evenly() {
    let rows = Array.from(ns.rows).slice(1);
    let ps = spaced_points(rows.length, 500 * Math.sqrt(2));
    for (let i = 0; i < ps.length; i++) {
        let [px, py] = ps[i];
        let [xi, yi] = [...rows[i].cells[2].querySelectorAll("input.num")]
        xi.value = px;
        yi.value = py;
    }
    input();
}

function fully_connect() {
    let edges = Array.from(es.rows).slice(1).map(r => [
        +r.cells[0].querySelector("select.dropdown").value,
        +r.cells[1].querySelector("select.dropdown").value
    ]);
    for (let i = 0; i < ns.rows.length - 1; i++) {
        for (let j = 0; j < ns.rows.length - 1; j++) {
            if (i === j) continue;
            if (dir.checked) {
                if (!contains(edges, [i, j])) {
                    add_edge(i, j);
                    edges.push([i, j]);
                }
            } else {
                if (!contains(edges, [i, j]) && !contains(edges, [j, i])) {
                    add_edge(i, j);
                    edges.push([i, j]);
                }
            }
        }
    }
}

function mousedown({offsetX, offsetY, button}) {
    if (button !== 0) return;
    let [ox, oy] = scale(offsetX, offsetY);
    let arr = Array.from(ns.rows).slice(1);
    for (let i = 0; i < arr.length; i++) {
        let [xi, yi] = [...arr[i].cells[2].querySelectorAll("input.num")];
        let dist = distance(+xi.value + width / 2, +yi.value + width / 2, ox, oy);
        if (dist <= rad * 0.8) {
            selected = i;
            moving = 1;
            break;
        } else if (dist <= rad * 1.2) {
            selected = i;
            moving = 2;
            break;
        }
    }
}

function mousemove({offsetX, offsetY}) {
    let [ox, oy] = scale(offsetX, offsetY);
    if (moving === 0) {
        let arr = Array.from(ns.rows).slice(1);
        mouse_over = -1;
        hl = -1;
        for (let i = 0; i < arr.length; i++) {
            let [xi, yi] = [...arr[i].cells[2].querySelectorAll("input.num")];
            let dist = distance(+xi.value + width / 2, +yi.value + width / 2, ox, oy);
            console.log(dist);
            if (dist <= rad * 0.8) {
                mouse_over = i;
                hl = 0;
                break;
            } else if (dist <= rad * 1.2) {
                mouse_over = i;
                hl = 1;
                break;
            }
        }
        input();
    } else if (moving === 1) {
        let row = Array.from(ns.rows)[selected + 1];
        let [xi, yi] = [...row.cells[2].querySelectorAll("input.num")];
        xi.value = clamp(ox - width / 2);
        yi.value = clamp(oy - width / 2);
        input();
    } else if (moving === 2) {
        let row = Array.from(ns.rows)[selected + 1];
        let [xi, yi] = [...row.cells[2].querySelectorAll("input.num")];
        centre = [+xi.value + width / 2, +yi.value + width / 2];
        new_edge = [clamp(ox, 0, 2000), clamp(oy, 0, 2000)];
        input();
    }
}

function mouseup({offsetX, offsetY, button}) {
    if (button !== 0) return;
    if (moving === 2) {
        let [ox, oy] = scale(offsetX, offsetY);
        let arr = Array.from(ns.rows).slice(1);
        for (let i = 0; i < arr.length; i++) {
            if (i === selected) continue;
            let [xi, yi] = [...arr[i].cells[2].querySelectorAll("input.num")];
            let dist = distance(+xi.value + width / 2, +yi.value + width / 2, ox, oy);
            if (dist <= rad * 1.2) {
                add_edge(selected, i);
                break;
            }
        }
    }
    selected = -1;
    moving = 0;
    mouse_over = -1;
    hl = -1;
    centre = [0, 0];
    new_edge = [0, 0];
    input();
}

[...document.querySelectorAll("input.num, input.text")].forEach(inp => inp.addEventListener("input", input));
[...document.querySelectorAll("span.remove")].forEach(rem => rem.addEventListener("click", remove));

graph.addEventListener("mousedown", mousedown);
graph.addEventListener("mousemove", mousemove);
graph.addEventListener("mouseup", mouseup);
graph.addEventListener("mouseleave", mouseup);

dir.addEventListener("input", input);
add.addEventListener("click", add_node);
spe.addEventListener("click", space_evenly);
con.addEventListener("click", fully_connect);
ral.addEventListener("click", remove3);

add_edge(0, 1);
add_edge(0, 2);
add_edge(2, 3);
add_edge(0, 3);
