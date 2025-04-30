let words_list = [];
let answers = [];
let scores = {}

const init = [
    ['tares', 6.159378894632175], ['lares', 6.11479381798308], ['rales', 6.096830602742267], ['rates', 6.0845199911107635], ['ranes', 6.076799032713852], ['nares', 6.074924715980232], ['reais', 6.049569076778574], ['teras', 6.047397415697385], ['soare', 6.043722976131012], ['tales', 6.014640287568021], ['aeros', 6.0034604932341855], ['tears', 5.989718667131178], ['sater', 5.989388504595531], ['seria', 5.9888379539169465], ['saner', 5.987263364792887], ['arles', 5.985793951143076], ['tores', 5.984705612775614], ['dares', 5.979828349699211], ['serai', 5.973510715689035], ['pares', 5.972348930787758], ['reals', 5.972143083420103], ['salet', 5.969929559916998], ['mares', 5.963233943915545], ['saine', 5.960623541304149], ['lanes', 5.952380747802665], ['reans', 5.9456125734760334], ['lears', 5.944961382137098], ['lores', 5.9419498931331445], ['laers', 5.937771448109829], ['raise', 5.935103323920842], ['cares', 5.930408152590046], ['seral', 5.925247373136993], ['roles', 5.923362039821035], ['tires', 5.921842478322874], ['tarse', 5.912729383520453], ['aloes', 5.912520458171499], ['sared', 5.910407426630242], ['aures', 5.907598425957549], ['rotes', 5.906417082702032], ['nears', 5.903598074729812], ['nates', 5.902053283162284], ['rones', 5.90199758574293], ['toeas', 5.8992537732234105], ['earls', 5.898420996179849], ['teals', 5.8875980802986], ['taels', 5.88210627427867], ['rames', 5.881820401495084], ['sorel', 5.88119164895854], ['earns', 5.878654405560854], ['taros', 5.870534002532946], ['toras', 5.86981402509819], ['tries', 5.867878938087057], ['strae', 5.867306976633721], ['rapes', 5.8662117549614505], ['leats', 5.8648499534701815], ['raits', 5.863501039210342], ['taser', 5.860580473331334], ['riles', 5.857244997754548], ['hares', 5.851408008789647], ['arets', 5.847035669680766], ['laris', 5.846316136269497], ['aeons', 5.843103215996468], ['dales', 5.843012863250683], ['toles', 5.841455042425492], ['rites', 5.840866458484853], ['races', 5.840571991520622], ['gares', 5.8370544296719755], ['bares', 5.837038625105968], ['rails', 5.836975572043147], ['pales', 5.832018191562802], ['rines', 5.831423149492004], ['ranse', 5.8292130173753725], ['soler', 5.829014381830245], ['males', 5.826047259783026], ['dears', 5.823647887358556], ['leans', 5.821681734240614], ['slate', 5.818127902843981], ['tones', 5.815398147739743], ['ranis', 5.81184790053898], ['siren', 5.811379908828756], ['snare', 5.810241642878206], ['neats', 5.809686991612795], ['laser', 5.807662823220245], ['dores', 5.8065231174330405], ['naris', 5.806354399155042], ['lairs', 5.804148748204966], ['neals', 5.803075752288753], ['ratos', 5.802000473040957], ['rains', 5.801791847738993], ['pears', 5.801537380636952], ['reads', 5.799663160586365], ['pores', 5.799101433138711], ['rotas', 5.797313117230164], ['panes', 5.7937686334475345], ['mores', 5.793234973076999], ['dates', 5.792906297476462], ['stare', 5.7921426821377695], ['roues', 5.788496423686295], ['pates', 5.787756193133852], ['manes', 5.786891112853317]
];

fetch("https://raw.githubusercontent.com/Roy-Orbison/wordle-guesses-answers/main/guesses.txt")
    .then(res => res.text())
    .then(text => {
        if (text.includes("404")) throw new Error("404");
        words_list = text.split("\n").filter(s => s.length === 5);
        answers = [...words_list];
    })
    .catch(e => {
        console.error(e);
        document.getElementById("error").classList.add("show");
        document.getElementById("content").classList.add("hide");
    });

fetch("https://gist.githubusercontent.com/nayakrujul/2e039cd10dea9e4e102f6afc21a554f0/raw/dc7974ae243501f5b5d966ac23a4847c4fef499f/freqs.txt")
    .then(res => res.text())
    .then(text => {
        if (text.includes("404")) throw new Error("404");
        let lines = text.split("\n").length;
        text.split("\n").forEach((line, i) => {
            let x = (lines / 2 - i) / 200;
            if (line.length === 5) scores[line] = 1 / (1 + Math.exp(-x));
        });
        initialise();
    })
    .catch(e => {
        console.error(e);
        document.getElementById("error").classList.add("show");
        document.getElementById("content").classList.add("hide");
    })

function colours(guess, target) {
    let found = [false, false, false, false, false];
    let ret = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
        if (guess[i] === target[i]) {
            found[i] = true;
            ret[i] = 2;
        }
    }
    for (let j = 0; j < 5; j++) {
        for (let k = 0; k < 5; k++) {
            if (guess[j] === target[k] && !ret[j] && !found[k]) {
                found[k] = true;
                ret[j] = 1;
            }
        }
    }
    return ret.join("");
}

function sort_dict(dct, f=n=>n) {
    let arr = [];
    for (key in dct) arr.push([key, dct[key]]);
    return arr.sort((a, b) => f(a[1]) - f(b[1]));
}

function sum(arr) {
    return arr.reduce((s, a) => s + a, 0);
}

function best_guess(possible, num) {
    let dict = {};
    let len = possible.length;
    let probs = {};
    let s = sum(possible.map(p => (scores[p] || 0) + 0.001));
    possible.forEach(q => probs[q] = ((scores[q] || 0) + 0.001) / s);
    words_list.forEach(word => {
        let groups = {};
        possible.forEach(ans => {
            let c = colours(word, ans);
            if (!(c in groups)) groups[c] = 1;
            else groups[c] += 1;
        });
        let vals = Object.values(groups);
        dict[word] = sum(vals.map(val => (val / len) * Math.log2(len / val))) + 2 * (probs[word] || 0);
    });
    return sort_dict(dict, x => -x).slice(0, num);
}

function run() {
    let best = best_guess(answers, 100);
    update_guesses(best);
}

function update(guess, pattern) {
    answers = answers.filter(w => colours(guess, w) === pattern);
    update_answers();
    run();
}

function change_colour({target}) {
    let sq = document.querySelector(
        `div.wordle-row.current div.wordle-square` +
        `[row="${target.getAttribute("row")}"]` +
        `[letter="${target.getAttribute("letter")}"]`
    );
    sq.classList.remove("green", "yellow", "grey");
    sq.classList.add(target.getAttribute("colour"));
}

function update_answers() {
    let s = sum(answers.map(p => (scores[p] || 0) + 0.001));
    let d = {};
    answers.forEach(q => d[q] = ((scores[q] || 0) + 0.001) / s)
    document.getElementById("answers-box").innerHTML =
        sort_dict(d, x => -x).slice(0, 100).map(([a, p]) => `
            <div class="answer-row">
                <span class="answer-word">${a}</span>
                <span class="answer-score">${p > 0.01 ? (p >= 0.995 ? "100" : (p * 100).toPrecision(2)) : "<1"}%</span>
            </div>
        `).join("");
}

function update_guesses(lst) {
    let gs = document.getElementById("guesses-box");
    gs.innerHTML = "";
    lst.forEach(([s, x]) => {
        if (x === 0) return;
        gs.innerHTML += `
            <div class="guess-row">
                <span class="guess-word">${s}</span>
                <span class="guess-score">${x.toFixed(2)}</span>
            </div>
        `;
    });
}

function initialise() {
    let box = document.getElementById("wordle-box");
    Array(6).keys().forEach(i => {
        let str = `<div class="wordle-row${i === 0 ? " current" : ""}" row="${i}">`;
        Array(5).keys().forEach(j => {
            str += `
                <div class="wordle-letter" row="${i}" letter="${j}">
                    <div class="wordle-square" row="${i}" letter="${j}">&nbsp;</div>
                    <div class="wordle-colours">
                        <div class="wordle-colour green" row="${i}" letter="${j}" colour="green"></div>
                        <div class="wordle-colour yellow" row="${i}" letter="${j}" colour="yellow"></div>
                        <div class="wordle-colour grey" row="${i}" letter="${j}" colour="grey"></div>
                    </div>
                </div>
            `;
        });
        box.innerHTML += str + "</div>"
    });
    document.querySelectorAll("div.wordle-colour").forEach(c => c.addEventListener("click", change_colour));
    update_guesses(init);
    update_answers();
}

function type(evt) {
    let curr = document.querySelector("div.wordle-row.current");
    if (curr === null) return;
    let boxes = [...curr.querySelectorAll("div.wordle-square")];
    let full = boxes.filter(x => x.innerHTML !== "&nbsp;").length;
    if (evt.keyCode === 13) {
        if (full === 5) {
            let clrs = boxes.map(b => [...new Set(b.classList).intersection(new Set(["grey", "yellow", "green"]))]);
            if (clrs.every(p => p.length === 1)) {
                let ptn = clrs.map(c => ["grey", "yellow", "green"].indexOf(c[0])).join("");
                let wd = boxes.map(x => x.innerHTML.toLowerCase()).join("");
                update(wd, ptn);
                curr.classList.remove("current");
                document.querySelector(`div.wordle-row[row="${+curr.getAttribute("row") + 1}"]`)?.classList.add("current");
            }
        }
    }
    if (evt.keyCode === 8) {
        if (full > 0) boxes[full - 1].innerHTML = "&nbsp;";
        return;
    }
    if (full < 5) {
        if (65 <= evt.keyCode && evt.keyCode <= 90)
            boxes[full].innerHTML = evt.key.toUpperCase();
    }
}

document.body.addEventListener("keydown", type);
