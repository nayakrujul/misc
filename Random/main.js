const sus = document.getElementById("dont-look-here");
const input = document.getElementById("inp");
const output = document.getElementById("out");
const button = document.getElementById("btn");

let cheat_num = -1;

function randint(n) {
    return Math.floor(Math.random() * n) + 1;
}

function animate(element) {
    element.classList.remove("animation");
    element.offsetWidth;
    element.classList.add("animation");
}

function child(index) {
    let elem = document.createElement("div");
    elem.id = "smalldiv" + index;
    elem.classList.add("small-div");
    elem.setAttribute("style", `width: ${sus.offsetWidth / input.value}px;`);
    elem.offsetWidth = sus.offsetWidth / input.value + "px";
    elem.addEventListener("click", cheat);
    sus.appendChild(elem);
    if (index % 2 === 0) {
        animate(elem);
    }
}

function change() {
    cheat_num = -1;
    input.value = +input.value ? Math.abs(input.value) : "";
    input.value = input.value > 99 ? 99 : input.value;
    if (input.value === "") {
        button.disabled = true;
    } else {
        button.disabled = false;
    }
    sus.replaceChildren();
    [...Array(+input.value).keys()].forEach(i => child(i));
}

function clicked() {
    if (cheat_num !== -1) {
        generated = cheat_num;
        cheat_num = -1;
        animate(sus);
    } else {
        generated = randint(input.value);
    }
    output.innerHTML = generated;
}

function cheat(event) {
    let target = event.target;
    let num = +target.id.slice(-1) + 1;
    if (cheat_num === num) {
        cheat_num = -1;
        animate(sus);
    } else {
        cheat_num = num;
        animate(target);
    }
}

input.addEventListener("input", change);
button.addEventListener("click", clicked);

window.onresize = change;

change();