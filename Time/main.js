let timezones = [];

fetch("https://raw.githubusercontent.com/vvo/tzdb/refs/heads/main/time-zones-names.json")
    .then(response => response.json())
    .then(res => timezones = res);

function convert_offset(offset) {
    return (offset < 0 ? "-" : "+") +
        (Math.floor(Math.abs(offset) / 60) + "").padStart(2, "0") + 
        ":" + (Math.abs(offset) % 60 + "").padStart(2, "0");
}

function get_tz_offset(tz) {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    const parts = fmt.formatToParts(now);
    const get = (type) => parts.find(p => p.type === type).value;
    const localStr = `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
    const localDate = new Date(localStr + "Z"); // interpreted as UTC
    return Math.round((localDate - now) / 60000);
}

function update_times() {
    let [cdiv, ...odivs] = document.querySelectorAll("div.time-div");
    cdiv.querySelector("h1.time").innerHTML = (new Date()).toLocaleTimeString([], {timeZone: convert_offset(curr)});
    document.title = "Time is " + cdiv.querySelector("h1.time").innerHTML;
    odivs.forEach((odiv, i) => {
        odiv.querySelector("h1.time").innerHTML = (new Date()).toLocaleTimeString([], {timeZone: convert_offset(others[i])});
    });
}

function validate_tz(str) {
    for (let i = 0; i < timezones.length; i++) {
        if (timezones[i].split("/").at(-1).replace("_", "").toLowerCase() === str.replaceAll(" ", "").toLowerCase()) {
            let off = get_tz_offset(timezones[i]);
            return [`${timezones[i].split("/").at(-1).replace("_", " ")} (UTC ${convert_offset(off)})`, off];
        }
    }
    let groups = /^(?:UTC)?(\+|-)(\d\d?)(?::(\d\d))?$/i.exec(str.replaceAll(" ", ""));
    if (groups !== null) {
        groups[3] ||= "00";
        if (+groups[2] < 24 && +groups[3] < 60)
            return [`UTC ${groups[1]}${groups[2].padStart(2, "0")}:${groups[3]}`, +(groups[1] + (groups[2] * 60 + +groups[3]))];
    }
}

function add_tz() {
    let v = validate_tz(document.getElementById("tz-input").value);
    if (v === undefined) return;
    let [s, t] = v;
    others.push(t);
    let td = document.createElement("div");
    td.classList.add("time-div");
    td.innerHTML = `
        <h3 class="timezone">${s}</h3>
        <h1 class="time">00:00:00</h1>
        <div class="right">
            <input type="button" value="&times;" class="remove-btn" id="x${others.length}" />
        </div>
    `;
    document.body.insertBefore(td, document.getElementById("margin"));
    document.getElementById(`x${others.length}`).addEventListener("click", remove_tz);
    document.getElementById("tz-input").value = "";
    document.getElementById("submit-tz").disabled = true;
    update_times();
}

function remove_tz({target}) {
    let ix = target.id.slice(1) - 1;
    others.splice(ix, 1);
    for (; ix <= others.length; ix++) document.getElementById("x" + (ix + 1)).id = "x" + ix;
    target.parentElement.parentElement.remove();
    update_times();
}

let curr = -new Date().getTimezoneOffset();
document.getElementById("local-tz").innerHTML = convert_offset(curr);

let others = [];

update_times();
setInterval(update_times, 200);

document.getElementById("tz-input").addEventListener("input", ({target}) => {
    document.getElementById("submit-tz").disabled = !validate_tz(target.value);
})

document.getElementById("submit-tz").addEventListener("click", add_tz);
document.getElementById("tz-input").addEventListener("keyup", ({key}) => key == "Enter" ? add_tz() : null);

document.getElementById("tz-input").focus();
