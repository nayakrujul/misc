const q = document.getElementById("question");
const a = document.getElementById("answer");
const t = document.getElementById("time");
const s = document.getElementById("score");
const b = document.getElementById("timer-bar")

let corr = 0;
let trem = 150;
let ans = 0;
let over = false;

function randint(x, y=null) {
    // Range is [x..y)
    // i.e. inclusive lower bound, exclusive upper bound
    if (y === null) [x, y] = [0, x];
    return Math.floor(Math.random() * (y - x) + x);
}

function next_question() {
    let qn = "";

    // 1D = 1 digit number
    // 2D = 2 digit number
    // etc.

    if (corr < 5) {

        // Level 1:
        //   1D + 1D --> 2D
        //   2D - 1D --> 1D

        let p = randint(1, 10);
        let q = randint(1, 10);

        switch (randint(2)) {
            case 0:
                qn = p + " + " + q;
                ans = p + q;
                break;
            case 1:
                qn = (p + q) + " - " + p;
                ans = q;
                break;
        }

    } else if (corr < 15) {

        // Level 2:
        //   2D + 1D --> 2D
        //   2D - 1D --> 2D
        //   1D * 1D --> 2D
        //   2D / 1D --> 1D

        let p = randint(10, 100);
        let q = randint(1, 10);
        let r = randint(1, 10);

        switch (randint(4)) {
            case 0:
                qn = (p - q) + " + " + q;
                ans = p;
                break;
            case 1:
                qn = p + " - " + q;
                ans = p - q;
                break;
            case 2:
                qn = q + " &times; " + r;
                ans = q * r;
                break;
            case 3:
                qn = (q * r) + " &divide; " + q;
                ans = r;
                break;
        }

    } else if (corr < 25) {

        // Level 3:
        //   2D + 2D --> 3D
        //   2D + 1D + 1D --> 3D
        //   3D - 2D --> 2D
        //   2D - 1D - 1D --> 2D
        //   1D * 1D --> 2D
        //   2D / 1D --> 1D

        let p = randint(10, 100);
        let q = randint(10, 100);
        let r = randint(1, 10);
        let u = randint(1, 10);

        switch (randint(6)) {
            case 0:
                qn = p + " + " + q;
                ans = p + q;
                break;
            case 1:
                qn = q + " + " + r + " + " + u;
                ans = q + r + u;
                break;
            case 2:
                qn = (p + q) + " - " + p;
                ans = q;
                break;
            case 3:
                qn = (q + r + u) + " - " + r + " - " + u;
                ans = q;
                break;
            case 4:
                qn = r + " &times; " + u;
                ans = r * u;
                break;
            case 5:
                qn = (r * u) + " &divide; " + r;
                ans = u;
                break;
        }

    } else if (corr < 35) {

        // Level 4:
        //   3D + 2D --> 4D
        //   2D + 2D + 1D --> 3D
        //   4D - 3D --> 3D
        //   3D - 2D - 1D --> 2D
        //   2D * 1D --> 3D
        //   3D / 1D --> 2D

        let p = randint(100, 1000);
        let q = randint(10, 100);
        let r = randint(10, 100);
        let u = randint(1, 10);

        switch (randint(6)) {
            case 0:
                qn = p + " + " + q;
                ans = p + q;
                break;
            case 1:
                qn = q + " + " + r + " + " + u;
                ans = q + r + u;
                break;
            case 2:
                qn = (p + q) + " - " + p;
                ans = q;
                break;
            case 3:
                qn = (q + r + u) + " - " + r + " - " + u;
                ans = q;
                break;
            case 4:
                qn = r + " &times; " + u;
                ans = r * u;
                break;
            case 5:
                qn = (r * u) + " &divide; " + u;
                ans = r;
                break;
        }

    } else {

        // Level 5:
        //   3D + 3D --> 4D
        //   3D + 2D + 2D --> 4D
        //   4D - 3D --> 3D
        //   4D - 3D - 2D --> 2D
        //   2D * 2D --> 4D
        //   2D * 1D * 1D --> 4D
        //   4D / 2D --> 2D
        //   4D / 2D / 1D --> 1D

        let p = randint(100, 1000);
        let q = randint(100, 1000);
        let r = randint(10, 100);
        let u = randint(10, 100);
        let v = randint(1, 10);
        let w = randint(1, 10);

        switch (randint(8)) {
            case 0:
                qn = p + " + " + q;
                ans = p + q;
                break;
            case 1:
                qn = p + " + " + r + " + " + u;
                ans = p + r + u;
                break;
            case 2:
                qn = (p + q) + " - " + p;
                ans = q;
                break;
            case 3:
                qn = (p + r + u) + " - " + p + " - " + r;
                ans = u;
                break;
            case 4:
                qn = r + " &times; " + u;
                ans = r * u;
                break;
            case 5:
                qn = u + " &times; " + v + " &times; " + w;
                ans = u * v * w;
                break;
            case 6:
                qn = (r * u) + " &divide; " + r;
                ans = u;
                break;
            case 7:
                qn = (u * v * w) + " &divide; " + u + " &divide; " + v;
                ans = w;
                break;
        }

    }

    q.innerHTML = qn;
}

function handle_input() {
    if (a.value === "") n = 0;
    else n = a.value = Math.abs(Math.trunc(+a.value));
    if (n === ans && !over) {
        a.value = "";
        trem += Math.max(30 - corr++, 5);
        s.innerHTML = corr;
        next_question();
    }
}

function game_over() {
    t.innerHTML = "0.0";
    b.style.width = "0%";
    over = true;
    a.value = "";
    a.disabled = true;
    q.innerHTML = "Game over";
    clearInterval(id);
}

next_question();

let id = setInterval(() => {
    t.innerHTML = (--trem / 10).toFixed(1);
    b.style.width = Math.max(Math.min(trem / 1.5, 100), 0) + "%";
    if (trem <= 0) game_over();
}, 100);

a.addEventListener("input", handle_input);
a.focus();
