const data = document.getElementById("data-text");
const ver = document.getElementById("version");
const ec = document.getElementById("error-correction");
const style = document.getElementById("pixel-style");
const cnv = document.getElementById("canvas");
const tooltip = document.getElementById("error-tooltip");
const dl = document.getElementById("download");


async function generate_matrix(text, error, version) {
    let options = {
        version: version,
        errorCorrectionLevel: error,
    };

    let qr = await QRCode.create(text, options);
    let size = qr.modules.size;
    let matrix = [];

    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(qr.modules.get(i, j) ? 1 : 0);
        }
        matrix.push(row);
    }

    return matrix;
}


function draw_matrix(mat) {
    let shape = style.querySelector(".selected").getAttribute("data-style");
    cnv.width = cnv.height = 20 * mat.length;

    let ctx = cnv.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    ctx.fillStyle = "black";

    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat.length; j++) {
            if (mat[i][j] === 1) {
                if (shape === "square") {
                    ctx.fillRect(20 * j, 20 * i, 20, 20);
                } else if (shape === "circle") {
                    ctx.beginPath();
                    ctx.arc(20 * j + 10, 20 * i + 10, 9, 0, 2 * Math.PI);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.roundRect(20 * j + 1, 20 * i + 1, 18, 18, 6);
                    ctx.fill();
                }
            }
        }
    }

    data.classList.remove("error");
    tooltip.hidden = true;
    dl.disabled = false;
}

function show_error(message) {
    data.classList.add("error");
    tooltip.innerHTML = `<i>` + message + `</i>`;
    tooltip.hidden = false;
    dl.disabled = true;

    let ctx = cnv.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
}

function preview() {
    let data_text = data.value;
    let qr_version = ver.value !== "auto" ? ver.value : undefined;
    let ec_level = ec.querySelector(".selected").getAttribute("data-level");

    if (data_text === "") return show_error("Data cannot be empty");
    generate_matrix(data_text, ec_level, qr_version).then(draw_matrix)
        .catch(() => show_error("Data is too large for selected version"));
}


[...Array(40).keys()].forEach(n => {
    let optn = document.createElement("option");
    optn.value = n + 1;
    let s = 21 + n * 4;
    optn.innerHTML = `Version ${n + 1} (${s}&times;${s})`;
    ver.appendChild(optn);
});

data.addEventListener("input", preview);
ver.addEventListener("input", preview);

[...ec.children].forEach(c => c.addEventListener("click", ({target}) => {
    if (![...target.classList].includes("ec-option")) target = target.parentElement;
    ec.querySelector(".selected").classList.remove("selected");
    target.classList.add("selected");
    preview();
}));

[...style.children].forEach(c => c.addEventListener("click", ({target}) => {
    if (![...target.classList].includes("pixel-option")) target = target.parentElement;
    style.querySelector(".selected").classList.remove("selected");
    target.classList.add("selected");
    preview();
}));

dl.addEventListener("click", () => {
    let url = cnv.toDataURL("image/png");
    let a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
});

preview();
