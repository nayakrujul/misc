const arr = [...document.querySelectorAll("h1.countdown-timer")];

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
setInterval(update, 200);