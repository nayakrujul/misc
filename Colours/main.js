function extractRgb(rgb) {
    return rgb.match(/\d+/g).slice(0, 3).map(x => +x);
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join("");
}

function rgbToHslHelper(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let d = max - min;
    let h = 0, s = 0, l = (max + min) / 2;
    if (d !== 0) {
        s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
    }
    h = Math.round(h * 60);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return [h, s, l];
}

function rgbToHsl(r, g, b) {
    let [h, s, l] = rgbToHslHelper(r, g, b);
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function update_rgb() {
    let r = document.getElementById("red-slider").value;
    let g = document.getElementById("green-slider").value;
    let b = document.getElementById("blue-slider").value;
    document.getElementById("rgb-sliders-box").style.cssText += `--colour: rgb(${r}, ${g}, ${b});`;
    document.getElementById("red-label").innerHTML = r;
    document.getElementById("green-label").innerHTML = g;
    document.getElementById("blue-label").innerHTML = b;
}

function update_hsl() {
    let h = document.getElementById("hue-slider").value;
    let s = document.getElementById("sat-slider").value;
    let l = document.getElementById("light-slider").value;
    document.getElementById("hsl-sliders-box").style.cssText += `--colour: hsl(${h}, ${s}%, ${l}%);`;
    document.getElementById("hue-label").innerHTML = h;
    document.getElementById("sat-label").innerHTML = s;
    document.getElementById("light-label").innerHTML = l;
}

let [href, args] = location.href.split("?", 2);
let d = Object.fromEntries(decodeURI(args || "").split("&").map(x => x.split("=")));
let colour = (d["h"] == "1" ? "#" : "") + d["c"];
if (colour == "undefined") colour = "black";

document.title = "Colour: " + colour;

document.getElementById("colour-info-box").style.cssText += `--colour: ${colour};`;
let [r1, g1, b1] = extractRgb(getComputedStyle(document.getElementById("colour-info-box")).backgroundColor);

document.getElementById("colour-info-box").style.cssText += `--colour: rgb(${r1}, ${g1}, ${b1})`;
document.getElementById("colour-info-rgb").innerHTML = `rgb(${r1}, ${g1}, ${b1})`;
document.getElementById("colour-info-hex").innerHTML = rgbToHex(r1, g1, b1);
document.getElementById("colour-info-hsl").innerHTML = rgbToHsl(r1, g1, b1);

let [r2, g2, b2] = [255 - r1, 255 - g1, 255 - b1];
document.getElementById("comp-colour-box").style.cssText += `--colour: rgb(${r2}, ${g2}, ${b2});`;
document.getElementById("comp-colour-rgb").innerHTML = `rgb(${r2}, ${g2}, ${b2})`;
document.getElementById("comp-colour-hex").innerHTML = rgbToHex(r2, g2, b2);
document.getElementById("comp-colour-hsl").innerHTML = rgbToHsl(r2, g2, b2);

document.getElementById("red-slider").value = r1;
document.getElementById("green-slider").value = g1;
document.getElementById("blue-slider").value = b1;
update_rgb();

let [h1, s1, l1] = rgbToHslHelper(r1, g1, b1);
document.getElementById("hue-slider").value = h1;
document.getElementById("sat-slider").value = s1;
document.getElementById("light-slider").value = l1;
update_hsl();


[...document.querySelectorAll(".select")].forEach(el => el.addEventListener("click", ({target}) => {
    let range = document.createRange();
    let selection = window.getSelection();
    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
}));

[...document.querySelectorAll("#red-slider, #green-slider, #blue-slider")].forEach(sl => sl.addEventListener("input", update_rgb));
[...document.querySelectorAll("#hue-slider, #sat-slider, #light-slider")].forEach(sl => sl.addEventListener("input", update_hsl));

[...document.querySelectorAll(".colour-box")].forEach(box => box.addEventListener("click", ({target}) => search(getComputedStyle(target).backgroundColor)))

function search(v) {
    if (v[0] == "#") location.replace(href + "?c=" + v.slice(1, v.length) + "&h=1");
    else location.replace(href + "?c=" + v);
}

document.getElementById("search-button").addEventListener("click", () => search(document.getElementById("search-input").value));
document.getElementById("search-input").addEventListener("keyup", ({key}) => key == "Enter" ? search(document.getElementById("search-input").value) : null);
document.getElementById("search-input").focus();
