const tbs = [...document.getElementsByClassName("time-btn")];
const min = document.getElementById("minutes");
const sec = document.getElementById("seconds");
const inc = document.getElementById("increment");

let times = [1800, 1800];
let incr = 20;
let curr = 0;

let id = -1;

function time_button_clicked(evt) {
    document.getElementById("custom").open = false;
    tbs.forEach(b => b.classList.remove("selected"));
    evt.target.classList.add("selected");
    let [t, i] = evt.target.value.split(" + ");
    min.value = t;
    sec.value = 0;
    inc.value = i;
    times = [t * 600, t * 600];
    incr = i * 10;
}

function custom_opened() {
    if (document.getElementById("custom").open)
        tbs.forEach(b => b.classList.remove("selected"));
    else if ([...document.querySelectorAll(".selected")].length == 0)
        time_button_clicked({target: document.querySelector(`input.time-btn[value="3 + 2"]`)});
}

function handle_input(evt) {
    let val = +evt.target.value;
    evt.target.value = Math.max(val, 0);
    if (sec.value > 59) {
        [min.value, sec.value] = divmod(min.value * 60 + +sec.value, 60);
    }
    times = [min.value * 600 + sec.value * 10, min.value * 600 + sec.value * 10];
    incr = inc.value * 10;
}

function divmod(n, d) {
    return [Math.floor(n / d), n % d];
}

function pad(s, n) {
    return s.padStart(n, "0");
}

function update(plr) {
    let clk = document.getElementById("clock" + plr);
    let time = times[plr];
    if (time < 600) {
        let [a, b] = divmod(time, 10);
        clk.innerHTML = a + "." + b;
    } else {
        let [a, b] = divmod(Math.floor(time / 10), 60);
        clk.innerHTML = a + ":" + pad(b + "", 2);
    }
}

function decrement() {
    times[curr]--;
    if (times[curr] <= 0) {
        times[curr] = 0;
        clearInterval(id);
        id = -1;
        document.getElementById("clock-div" + curr).classList.remove("active");
        document.getElementById("clock-div" + curr).classList.add("lost");
    }
    update(0);
    update(1);
}

function start() {
    update(0);
    update(1);
    document.getElementById("options").classList.add("hide");
    document.getElementById("clocks").classList.remove("hide");
    id = setInterval(decrement, 100);
}

function change_turn0() {
    if (id == -1) return;
    if (curr == 0) {
        curr = 1;
        times[0] += incr;
        document.getElementById("clock-div0").classList.remove("active");
        document.getElementById("clock-div1").classList.add("active");
    }
}

function change_turn1() {
    if (id == -1) return;
    if (curr == 1) {
        curr = 0;
        times[1] += incr;
        document.getElementById("clock-div0").classList.add("active");
        document.getElementById("clock-div1").classList.remove("active");
    }
}

tbs.forEach(b => b.addEventListener("click", time_button_clicked));
document.getElementById("custom").addEventListener("toggle", custom_opened);
[min, sec, inc].forEach(a => a.addEventListener("input", handle_input));
document.getElementById("start-btn").addEventListener("click", start);

document.getElementById("clock-div0").addEventListener("click", change_turn0);
document.getElementById("clock-div1").addEventListener("click", change_turn1);
