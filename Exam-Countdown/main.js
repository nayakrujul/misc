const arr = [...document.querySelectorAll("h1.countdown-timer")];

function time_to(end) {
    let diff = (end - Date.now()) / 1000;

    let days = Math.floor(diff / 86400);
    diff -= days * 86400;

    let hours = Math.floor(diff / 3600) % 24;
    diff -= hours * 3600;

    let minutes = Math.floor(diff / 60) % 60;
    diff -= minutes * 60;

    let seconds = Math.round(diff % 60);

    return [days, hours, minutes, seconds];
}

function update() {
    arr.forEach((elem, index) => {
        let span = document.getElementById("timer" + index);
        let end_time = Date.parse(elem.getAttribute("countdown-to"));
        let [d, ...r] = time_to(end_time);
        span.innerHTML = `${d}d&nbsp;${r.map(n => ("" + n).padStart(2, "0")).join(":")}`;
    });
}

arr.forEach((elem, index) => {
    let name = elem.getAttribute("name");
    elem.innerHTML = `<span class="text">${name.replaceAll("-", " ")}:</span> &ensp; <span class="timer" id="timer${index}">&nbsp;</span>`;
});

update();
setInterval(update, 200);