const VALID_SCORES = [...Array(21).keys(), ...Array(21).keys().map(a => a * 2), ...Array(21).keys().map(a => a * 3), 25, 50];

let teams = {
    "Team 1": {"Player 1": []}
};

function check_valid_score(str) {
    if (str === +str + "") return [VALID_SCORES.includes(+str), +str];
    else if (str[str.length - 1] == "d") {
        let n = str.substring(0, str.length - 1);
        if (n === +n + "") return [VALID_SCORES.includes(+n * 2), +n * 2];
    } else if (str[str.length - 1] == "t") {
        let n = str.substring(0, str.length - 1);
        if (n === +n + "") return [VALID_SCORES.includes(+n * 3), +n * 3];
    }
    else return [false, 0];
}

function calculate_total_score(team) {
    return sum(Object.values(team).map(sum));
}

function sum(lst) {
    return lst.reduce((a, b) => a + b, 0);
}

function add_score(target, score) {
    target.value = "";
    let id = target.id.split("-");
    let x = +id[2]; let y = +id[3];
    let team = teams[Object.keys(teams)[x]];
    team[player = Object.keys(team)[y]].push(score);
    document.getElementById(`player-header-${x}-${y}`).innerHTML = `${player} <i>(${sum(team[Object.keys(team)[y]])})</i>`;
    document.getElementById(`player-scores-${x}-${y}`).innerHTML += `${score} `;
    document.getElementById(`team-score-${x}`).innerHTML = `<i>Total score: <b>${calculate_total_score(team)}</b></i>`;
}

function clear_scores(target) {
    target.value = "";
    let id = target.id.split("-");
    let x = +id[2]; let y = +id[3];
    let team = teams[Object.keys(teams)[x]];
    team[player = Object.keys(team)[y]] = [];
    document.getElementById(`player-header-${x}-${y}`).innerHTML = `${player} <i>(0)</i>`;
    document.getElementById(`player-scores-${x}-${y}`).innerHTML = `Scores: `;
    document.getElementById(`team-score-${x}`).innerHTML = `<i>Total score: <b>${calculate_total_score(team)}</b></i>`;
}

function input_listener(event) {
    let t = event.target;
    if (t.value == "c") {
        if (event.key == "Enter") clear_scores(t);
        return;
    }
    let [b, i] = check_valid_score(t.value);
    t.value = b ? i + "" : "";
    if (b && event.key === "Enter") add_score(t, i);
}

function new_player(event) {
    let team = +event.target.id.split("-")[2];
    let dict = teams[Object.keys(teams)[team]];
    let num = Object.keys(dict).length;
    dict["Player " + (num + 1)] = [];
    let new_div = document.createElement("div");
    new_div.classList.add("player-div");
    new_div.id = `player-div-${team}-${num}`;
    new_div.innerHTML = `
        <h3 class="player-header" id="player-header-${team}-${num}">Player ${num + 1} <i>(0)</i></h3>
        <input type="text" placeholder="Score" class="player-score" id="player-score-${team}-${num}" />
        <p class="player-scores" id="player-scores-${team}-${num}">Scores: </p>
    `
    document.getElementById(`team-div-${team}`).appendChild(new_div);
    document.getElementById(`player-score-${team}-${num}`).addEventListener("keyup", input_listener);
}

function add_team() {
    let n = Object.keys(teams).length;
    teams["Team " + (n + 1)] = {};
    let team_div = document.createElement("div");
    team_div.classList.add("team-div");
    team_div.id = `team-div-${n}`;
    team_div.innerHTML = `
        <p class="team-score" id="team-score-${n}"><i>Total score: <b>0</b></i></p>
        <input type="button" value="Add Player" class="new-player" id="new-player-${n}" />
    `;
    document.body.insertBefore(team_div, document.getElementById("bottom"));
    document.getElementById(`new-player-${n}`).addEventListener("click", new_player);
    let new_select = document.createElement("option");
    new_select.value = n + "";
    new_select.innerHTML = "Team " + (n + 1);
    document.getElementById("team-select").insertBefore(new_select, document.getElementById("add-team"));
    new_select.selected = true;
    switch_team();
}

function switch_team() {
    let new_team = document.getElementById("team-select").value;
    if (new_team == "+") return add_team();
    [...document.querySelectorAll("div.team-div")].map(d => d.hidden = true);
    document.getElementById("team-div-" + new_team).hidden = false;
}

document.getElementById("player-score-0-0").addEventListener("keyup", input_listener);
document.getElementById("new-player-0").addEventListener("click", new_player);
document.getElementById("team-select").addEventListener("input", switch_team);