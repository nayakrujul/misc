const tbs = [...document.getElementsByClassName("time-btn")];

let times = [6000, 6000];
let incr = 0;
let curr = 0;

let id = -1;

function time_button_clicked(evt) {
    tbs.forEach(b => b.classList.remove("selected"));
    evt.target.classList.add("selected");
    let [t, i] = evt.target.value.split(" + ");
    times = [t * 600, t * 600];
    incr = i * 10;
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
document.getElementById("start-btn").addEventListener("click", start);

document.getElementById("clock-div0").addEventListener("click", change_turn0);
document.getElementById("clock-div1").addEventListener("click", change_turn1);

