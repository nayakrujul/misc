const cnv = document.getElementById("canvas");
cnv.height = cnv.offsetHeight;
cnv.width = cnv.offsetWidth;

const ctx = cnv.getContext("2d");


/**
 * Returns a random item from an array
 * @param {any[]} arr An array to choose a random item from
 * @returns {any} A random item from `arr`
 */
function random_choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a random permutation of the array `[1, 2, 3, ..., n]`
 * @param {number} n A positive integer
 * @returns {number[]} A random permutation of `[1..n]`
 */
function random_permutation(n) {
    let l = [...Array(n + 1).keys()].slice(1, n + 1);
    let r = [];
    while (l.length > 0) 
        r.push(l.splice(l.indexOf(random_choice(l)), 1)[0]);
    return r;
}

function draw_array_state(state) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    let len = state.arr.length;
    let xsc = cnv.width / len;
    let ysc = cnv.height / len;
    for (let i = 0; i < len; i++) {
        if (state.comps.includes(i)) ctx.fillStyle = "red";
        else ctx.fillStyle = "black";
        ctx.fillRect(xsc * i, cnv.height - ysc * state.arr[i], xsc, ysc * state.arr[i]);
    }
}

function animate(sts, fps) {
    if (sts.length === 0) return;
    let [st] = sts.splice(0, 1);
    draw_array_state(st);
    setTimeout(() => animate(sts), 1000 / fps);
}

function run() {
    let len = +document.getElementById("length").value;
    if (len < 2) len = 2;
    if (len > 999) len = 999;
    let fps = +document.getElementById("frames").value;
    if (fps < 1) fps = 1;
    let alg = document.getElementById("algorithm").value;
    let arr;
    let lst = random_permutation(len);
    switch (alg) {
        case "bubble":
            arr = bubble_sort(lst);
            break;
        case "opbubble":
            arr = optimised_bubble_sort(lst);
            break;
        case "insertion":
            arr = insertion_sort(lst);
            break;
        case "selection":
            arr = selection_sort(lst);
            break;
    }
    document.getElementById("to-hide").hidden = true;
    cnv.hidden = false;
    animate(arr, fps);
}

window.onresize = () => {
    cnv.height = cnv.offsetHeight;
    cnv.width = cnv.offsetWidth;
}

cnv.hidden = true;
document.getElementById("start").addEventListener("click", run);
