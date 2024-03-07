const sus = document.getElementById("dont-look-here");
const input = document.getElementById("inp");
const output = document.getElementById("out");
const button = document.getElementById("btn");

let generated = -1;
let cheat_num = -1;
let chance = 1.5;
let max = -1;
let id = -1;

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

function roll() {
    while ((n = randint(max)) === +output.innerHTML) {}
    output.innerHTML = n;
    chance -= 0.05;
    if (Math.random() >= chance) {
        clearInterval(id);
        chance = 1.5;
        output.innerHTML = generated;
        output.classList.add("red");
        generated = -1;
    }
}

function clicked() {
    if (generated !== -1) {
        return;
    }
    output.classList.remove("red");
    max = input.value;
    if (cheat_num !== -1) {
        generated = cheat_num;
    } else {
        generated = randint(max);
    }
    roll();
    id = setInterval(roll, 50);
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