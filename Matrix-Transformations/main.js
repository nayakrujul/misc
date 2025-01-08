const canvas = document.getElementById("graph");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext("2d");

let props = {
    cw: canvas.width,   // width of the canvas, in pixels
    ch: canvas.height,  // height of the canvas, in pixels
    xmin: -5,  // minimum x value on graph
    xmax: 5,   // maximum x value on graph
    ymin: -(canvas.height / canvas.width) * 5,  // minimum y value on graph
    ymax: (canvas.height / canvas.width) * 5,   // maximum y value on graph
    xsc: canvas.width / 10,  // scale of the x axis, in pixels per unit
    ysc: canvas.width / 10,  // scale of the y axis, in pixels per unit
    drag: null,  // coordinates of the start of the drag, null if no drag
    dims: null,  // copy of [xmin, xmax, ymin, ymax] from before the drag
}

/**
 * Multiplies two matrices, throwing an error if they are non-conformable.
 * @param {number[][]} ma A matrix with dimensions MxN 
 * @param {number[][]} mb A matrix with dimensions NxP
 * @returns {number[][]} The resulting matrix with dimensions MxP
 */
function matmul(ma, mb) {
    let [m, n, o, p] = [ma.length, ma[0].length, mb.length, mb[0].length];
    if (n !== o) throw new Error("Matrices are non-conformable");
    let mc = Array.from({length: m}, () => Array(p).fill(0));
    for (let i = 0; i < m; i++)
    for (let j = 0; j < p; j++) 
    for (let k = 0; k < n; k++)
    mc[i][j] += ma[i][k] * mb[k][j];
    return mc;
}

/***
 * Combines multiple matrix transformations by multiplying right to left.
 * @param {number[][][]} ms Any number of 2x2 matrices to combine
 * @returns {number[][]} The resulting 2x2 matrix
 */
function combine_transformations(...ms) {
    ms.reverse();
    let [m1] = ms.splice(0, 1);
    for (let i = 0; i < ms.length; i++) 
        m1 = matmul(m1, ms[i]);
    return m1;
}

/**
 * Transforms a point using a given matrix.
 * @param {number[][]} mat The 2x2 matrix representing the transformation
 * @param {number[]} pt The point, given as [x, y]
 * @returns {number[]} The point after transformation, [x', y']
 */
function transform(mat, pt) {
    let [[x], [y]] =  matmul(mat, [[pt[0]], [pt[1]]]);
    return [x, y];
}

function clear_canvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, props.cw, props.ch);
}

function draw_axes() {
    ctx.fillStyle = "black";
    ctx.lineWidth = 3;
    ctx.beginPath();
    let xax = props.ysc * props.ymax;
    ctx.moveTo(0, xax);
    ctx.lineTo(props.cw, xax);
    ctx.stroke();
    ctx.beginPath();
    let yax = props.xsc * -props.xmin;
    ctx.moveTo(yax, 0);
    ctx.lineTo(yax, props.ch);
    ctx.stroke();
}

function label_x_axis() {
    let xexp = Math.floor(Math.log10((props.xmax - props.xmin) * 0.375));
    let xdiff = 10 ** xexp;
    let [xma, xmb] = [Math.ceil(props.xmax / xdiff), Math.ceil(props.xmin / xdiff)]
    if (xmb === props.xmin / xdiff) xmb++;
    let xmks = Array.from({length: xma - xmb}, (_, i) => (xmb + i) * xdiff);
    if (xmks.includes(0)) xmks.splice(xmks.indexOf(0), 1);
    xmks.forEach(xn => {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo((xn - props.xmin) * props.xsc, props.ysc * props.ymax - 10);
        ctx.lineTo((xn - props.xmin) * props.xsc, props.ysc * props.ymax + 10);
        ctx.stroke();
        ctx.font = '16px "Cambria Maths"';
        ctx.textAlign = "center";
        ctx.fillText(xn.toFixed(Math.max(-xexp, 0)), (xn - props.xmin) * props.xsc, props.ysc * props.ymax + 25);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "darkgray";
        ctx.beginPath();
        ctx.moveTo((xn - props.xmin) * props.xsc, 0);
        ctx.lineTo((xn - props.xmin) * props.xsc, props.ch);
        ctx.stroke();
    });
}

function label_y_axis() {
    let yexp = Math.floor(Math.log10((props.ymax - props.ymin) * 0.375));
    let ydiff = 10 ** yexp;
    let [yma, ymb] = [Math.ceil(props.ymax / ydiff), Math.ceil(props.ymin / ydiff)]
    if (ymb === props.ymin / ydiff) ymb++;
    let ymks = Array.from({length: yma - ymb}, (_, i) => (ymb + i) * ydiff);
    if (ymks.includes(0)) ymks.splice(ymks.indexOf(0), 1);
    ymks.forEach(yn => {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(props.xsc * -props.xmin - 10, props.ch - (yn - props.ymin) * props.ysc);
        ctx.lineTo(props.xsc * -props.xmin + 10, props.ch - (yn - props.ymin) * props.ysc);
        ctx.stroke();
        ctx.font = '16px "Cambria Maths"';
        ctx.textAlign = "left";
        ctx.fillText(yn.toFixed(Math.max(-yexp, 0)), props.xsc * -props.xmin + 15, props.ch - (yn - props.ymin) * props.ysc + 5);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "darkgray";
        ctx.beginPath();
        ctx.moveTo(0, props.ch - (yn - props.ymin) * props.ysc);
        ctx.lineTo(props.cw, props.ch - (yn - props.ymin) * props.ysc);
        ctx.stroke();
    });
}

function update_boxes() {
    document.getElementById("xmin").value = +props.xmin.toPrecision(5);
    document.getElementById("xmax").value = +props.xmax.toPrecision(5);
    document.getElementById("ymin").value = +props.ymin.toPrecision(5);
    document.getElementById("ymax").value = +props.ymax.toPrecision(5);
}

function setup() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    props.cw = canvas.width;
    props.ch = canvas.height;
    props.xsc = props.cw / (props.xmax - props.xmin);
    props.ysc = props.ch / (props.ymax - props.ymin);
    clear_canvas();
    draw_axes();
    label_x_axis();
    label_y_axis();
    update_boxes();
}

function zoom_square_x() {
    props.xmin = -(props.cw / props.ch) * (props.ymax - props.ymin) / 2;
    props.xmax = (props.cw / props.ch) * (props.ymax - props.ymin) / 2;
    setup();
}

function zoom_square_y() {
    props.ymin = -(props.ch / props.cw) * (props.xmax - props.xmin) / 2;
    props.ymax = (props.ch / props.cw) * (props.xmax - props.xmin) / 2;
    setup();
}

function centre() {
    props.xmin = -(props.xmax - props.xmin) / 2;
    props.xmax = -props.xmin;
    props.ymin = -(props.ymax - props.ymin) / 2;
    props.ymax = -props.ymin;
    setup();
}

function move_canvas(event) {
    if (event.buttons === 0)
        return props.drag = null;
    let [x, y] = [event.offsetX, event.offsetY];
    if (props.drag === null)
        return [props.drag, props.dims] =
            [[x, y], [props.xmin, props.xmax, props.ymin, props.ymax]];
    let [sx, sy] = props.drag;
    props.xmin = props.dims[0] + (sx - x) / props.xsc;
    props.xmax = props.dims[1] + (sx - x) / props.xsc;
    props.ymin = props.dims[2] + (y - sy) / props.ysc;
    props.ymax = props.dims[3] + (y - sy) / props.ysc;
    
    setup();
}

function rescale({target}) {
    let val = parseFloat(target.value);
    if (isNaN(val) || isNaN(target.value))
        return target.classList.add("invalid");
    let valid = false;
    switch (target.id) {
        case "xmin":
            valid = val < props.xmax;
            break;
        case "xmax":
            valid = val > props.xmin;
            break;
        case "ymin":
            valid = val < props.ymax;
            break;
        case "ymax":
            valid = val > props.ymin;
    }
    if (!valid)
        return target.classList.add("invalid")
    target.classList.remove("invalid");
    props[target.id] = val;
    setup();
}

setup();
window.onresize = setup;
canvas.addEventListener("mousemove", move_canvas);

document.getElementById("xmin").addEventListener("input", rescale);
document.getElementById("xmax").addEventListener("input", rescale);
document.getElementById("ymin").addEventListener("input", rescale);
document.getElementById("ymax").addEventListener("input", rescale);

document.getElementById("xzoom").addEventListener("click", zoom_square_x);
document.getElementById("yzoom").addEventListener("click", zoom_square_y);
document.getElementById("ctr").addEventListener("click", centre);
