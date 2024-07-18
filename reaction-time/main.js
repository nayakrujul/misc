const h1 = document.getElementById("instructions");
const score = document.getElementById("scoreboard");

let game = -1;
let green = 0;
let best = -1;
let id = -1;

/** Returns the current time */
function time_now() {
    return (new Date()).getTime();
}

/** Generates a random integer from the range [a..b) */
function randint(a, b) {
    return a + Math.floor(Math.random() * (b - a))
}

function start_game() {
    game = 0;
    document.body.style.backgroundColor = "red";
    h1.innerHTML = "Tap or click when the screen goes green.";
    let d = randint(3000, 5000);
    green = time_now() + d;
    id = setTimeout(() => {
        document.body.style.backgroundColor = "green";
        h1.innerHTML = "Click!";
    }, d);
}

function clicked(event) {
    if (this === event.target) {
        if (game === -1) {
            start_game();
        } else if (game === 0) {
            game = -1;
            let diff = time_now() - green;
            if (diff <= 100) {
                h1.innerHTML = "Too early. Tap to restart.";
                clearTimeout(id);
            } else {
                document.body.style.backgroundColor = "blue";
                h1.innerHTML = "Reaction time: " + diff + "ms. Tap to restart.";
                if (diff < best || best == -1) {
                    score.innerHTML = "Best: " + diff + "ms";
                    best = diff;
                }
            }
        }
    }
}

[...document.querySelectorAll("*")].map(el => el.addEventListener("click", clicked, true));
