const arr = [...document.querySelectorAll("h1.countdown-timer")];
const radios = [...document.querySelectorAll("input.radio-btn")];
const subjects = ["drama", "latin", "english", "physics", "spanish"];
const antisubjects = [["english", "latin"], ["drama", "english"], ["drama", "latin"], ["spanish"], ["physics"]];

function time_to(end) {
    let diff = Math.abs(end - Date.now()) / 1000;

    let after = end < Date.now();
    if (after) diff++;

    let days = Math.floor(diff / 86400);
    diff -= days * 86400;

    let hours = Math.floor(diff / 3600) % 24;
    diff -= hours * 3600;

    let minutes = Math.floor(diff / 60) % 60;
    diff -= minutes * 60;

    let seconds = Math.floor(diff % 60);
    if (after) days = "-" + days;

    return [days, hours, minutes, seconds];
}

function update() {
    out = "";
    arr.forEach((elem, index) => {
        let span = document.getElementById("timer" + index);
        let end_time = Date.parse(elem.getAttribute("countdown-to"));
        let [d, ...r] = time_to(end_time);
        span.innerHTML = `${d}d&nbsp;${r.map(n => ("" + n).padStart(2, "0")).join(":")}`;
        if (out === "" && ("" + d)[0] !== "-") out = +d + 1;
    });
    if (out) {
        if ((x = "Exam Countdown: " + out + " days left") !== document.title) document.title = x;
    } else {
        document.title = "Exam Countdown";
    }
}

function change_times(val) {
    if (val == "drama") {
        arr[0].setAttribute("countdown-to", "08 May 2025 08:30:00 GMT+1");
        localStorage.setItem("subject0", val);
    } else if (val == "latin") {
        arr[0].setAttribute("countdown-to", "09 May 2025 08:30:00 GMT+1");
        localStorage.setItem("subject0", val);
    } else if (val == "english") {
        arr[0].setAttribute("countdown-to", "12 May 2025 08:30:00 GMT+1");
        localStorage.setItem("subject0", val);
    } else if (val == "physics") {
        arr[1].setAttribute("countdown-to", "16 Jun 2025 10:30:00 GMT+1");
        localStorage.setItem("subject1", val);
    } else if (val == "spanish") {
        arr[1].setAttribute("countdown-to", "17 Jun 2025 10:00:00 GMT+1");
        localStorage.setItem("subject1", val);
    }
}

function update_text() {
    arr.forEach((elem, index) => {
        let name = elem.getAttribute("name");
        let end = (new Date(
            Date.parse(elem.getAttribute("countdown-to"))
            )
        ).toLocaleDateString("en-GB", {
            weekday: "short", month: "short", day: "numeric", year: "numeric",
            hourCycle: "h23", hour: "numeric", minute: "numeric"
        });
        elem.innerHTML = `<span class="text">${name.replaceAll("-", " ")} (${end.replaceAll(" ", "&nbsp;")}):</span> &ensp; <span class="timer" id="timer${index}">&nbsp;</span>`;
    });
    update();
}

function button_clicked(target) {
    let value = target.value;
    target.checked = true;
    antisubjects[subjects.indexOf(value)].forEach(s => radios[subjects.indexOf(s)].checked = false);
    change_times(value);
    update_text();
}

radios.forEach(radio => radio.addEventListener("input", ({target}) => button_clicked(target)));

let s0 = localStorage.getItem("subject0");
let s1 = localStorage.getItem("subject1");
if (s0 === "drama" || s0 === "latin" || s0 === "english") button_clicked(radios[subjects.indexOf(s0)]);
if (s1 === "physics" || s1 === "spanish") button_clicked(radios[subjects.indexOf(s1)]);

update_text();
setInterval(update, 200);