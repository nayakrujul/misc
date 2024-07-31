const OPTIONS = {
    chassis: {
        _6U: {
            cost: 6400,
            weight: 850,
            capacity: 6
        }
    },
    payload: {
        im200: {
            cost: 27000,
            weight: 59,
            volume: 1,
            power: 3.5,
            time: 4
        },
        fft2g: {
            cost: 15000,
            weight: 750,
            volume: 2,
            power: 25,
            time: 1
        }
    },
    solar_panel: {
        _6U: {
            cost: 13000,
            weight: 390,
            pow_gen: 9.2
        },
        _6UD: {
            cost: 40000,
            weight: 757,
            pow_gen: 18.4
        },
        _8U: {
            cost: 17000,
            weight: 470,
            pow_gen: 24
        },
        _8UD: {
            cost: 45000,
            weight: 900,
            pow_gen: 48
        }
    },
    computer: {
        _1: {
            weight: 100,
            cost: 6000,
            power: 1,
            speed: 500,
            volume: 1
        },
        _2: {
            weight: 75,
            cost: 9500,
            power: 2,
            speed: 750,
            volume: 1
        },
        _3: {
            weight: 130,
            cost: 3500,
            power: 0.8,
            speed: 200,
            volume: 1
        }
    },
    transmitter: {
        xtm: {
            cost: 27000,
            weight: 250,
            volume: 1,
            power: 12
        },
        stm: {
            cost: 12000,
            weight: 250,
            volume: 1,
            power: 12
        },
        stc: {
            cost: 11000,
            weight: 150,
            volume: 0.5,
            power: 8.5
        },
        uhftc: {
            cost: 5000,
            weight: 100,
            volume: 0.5,
            power: 8.5
        }
    },
    antenna: {
        x_4p: {
            cost: 17000,
            weight: 53,
            power: 4,
            time: 1
        },
        x_2p: {
            cost: 15000,
            weight: 23,
            power: 4,
            time: 1
        },
        x_p: {
            cost: 13000,
            weight: 3,
            power: 4,
            time: 1
        },
        uhf: {
            cost: 15000,
            weight: 85,
            power: 4,
            time: 1
        },
        s_com: {
            cost: 16000,
            weight: 61,
            power: 4,
            time: 1
        },
        s_ism: {
            cost: 14000,
            weight: 80,
            power: 4,
            time: 1
        },
        s_wdb: {
            cost: 15000,
            weight: 115,
            power: 4,
            time: 1
        }
    },
    eps: {
        _1: {
            cost: 15250,
            weight: 500,
            volume: 1,
            energy: 30
        },
        _2: {
            cost: 18500,
            weight: 550,
            volume: 1,
            energy: 34
        },
        _3: {
            cost: 21000,
            weight: 750,
            volume: 1,
            energy: 42
        },
        _4: {
            cost: 27000,
            weight: 1240,
            volume: 1.5,
            energy: 50
        }
    },
    propulsion: {
        bradford: {
            cost: 38000,
            weight: 1400,
            volume: 1,
            thrust: 5.5,
            wclass: "C"
        },
        pm200: {
            cost: 45000,
            weight: 1800,
            volume: 1.5,
            thrust: 1,
            wclass: "B"
        },
        halo: {
            cost: 80000,
            weight: 2500,
            volume: 2,
            thrust: 0.085,
            wclass: "A"
        }
    }
};

const BUDGET = 525000;

function title_case(str) {
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

function add_element(elem) {
    document.getElementById("rest").appendChild(elem);
}

function sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
}

function calculate_totals() {
    let sels = [...document.querySelectorAll("select")];
    let weights = sels.map(sel => {
        let val = sel.value;
        let lab = sel.getAttribute("label");
        let dct = OPTIONS[lab][val];
        return dct["weight"] || 0;
    });
    document.getElementById("total-weight").innerHTML = `Total weight: <b>` + sum(weights) + `g</b>`;
    let costs = sels.map(sel => {
        let val = sel.value;
        let lab = sel.getAttribute("label");
        let dct = OPTIONS[lab][val];
        return dct["cost"] || 0;
    });
    let fuel = sum(weights) * 70;
    document.getElementById("total-cost").innerHTML =
        `Total cost: <i>£` + sum(costs) + `</i> (subtotal) + <i>£` + fuel + `</i> (fuel) = <b class="` +
        (sum(costs) + fuel > BUDGET ? 'red' : 'green') + `">£` + (sum(costs) + fuel) + `</b>`;
    let vols = sels.map(sel => {
        let val = sel.value;
        let lab = sel.getAttribute("label");
        let dct = OPTIONS[lab][val];
        return dct["volume"] || 0;
    });
    document.getElementById("total-volume").innerHTML = `Total volume: <b>` + sum(vols) + `U</b>`;

    if (document.getElementById("select-6") === null) return;

    let energy = OPTIONS["eps"][document.getElementById("select-6").value]["energy"];
    let use = sels.map(sel => {
        let val = sel.value;
        let lab = sel.getAttribute("label");
        let dct = OPTIONS[lab][val];
        return (dct["power"] || 0) * (dct["time"] || 1);
    });
    document.getElementById("total-power").innerHTML =
        `Available power: <i>` + energy + `Wh</i> - <i>` + sum(use) + `Wh</i> = <b class="` +
        (energy < sum(use) ? 'red' : 'green') + `">` + +(energy - sum(use)).toFixed(5) + `Wh</b>`;

    let s7 = document.getElementById("select-7");

    if (s7 === null) return;

    if (sum(weights.slice(0, -1)) > 3500) {
        if (s7.value !== "bradford") {
            s7.value = "bradford";
            show_details(s7);
        }
    } else if (sum(weights.slice(0, -1)) >= 2600) {
        if (s7.value !== "pm200") {
            s7.value = "pm200";
            show_details(s7);
        }
    } else {
        if (s7.value !== "halo") {
            s7.value = "halo";
            show_details(s7);
        }
    }
}

function show_details(el) {
    let val = el.value;
    let lab = el.getAttribute("label");
    let dct = OPTIONS[lab][val];
    let lst = document.getElementById(el.id.replace("select", "ul"));
    lst.innerHTML = [...Object.entries(dct)].map(([a, b]) => 
        `<li>${a}: <strong>${b}</strong></li>`
    ).join("");

    calculate_totals();
    antenna();
}

function antenna() {
    let s = document.getElementById("select-5");
    if (s === null) return;
    [...s.options].forEach(optn => {
        optn.disabled = optn.value[0] !== document.getElementById("select-4").value[0]
    });
}

[...Object.entries(OPTIONS)].map(([k, v], i) => {
    let select = document.createElement("select");
    select.id = `select-${i}`;
    select.setAttribute("label", k);
    select.innerHTML = Object.keys(v).map(s => 
        `<option value=${s}>${s.toUpperCase().replaceAll("_", " ")}</option>`
    ).join("");
    if (i === 7) select.disabled = true;
    let label = document.createElement("label");
    label.setAttribute("for", `select-${i}`);
    label.innerHTML = title_case(k.replaceAll("_", " ")) + ": &nbsp;";
    let det = document.createElement("ul");
    det.id = `ul-${i}`;
    add_element(label);
    add_element(select);
    add_element(det);
    show_details(select);
    select.addEventListener("input", (event) => show_details(event.target));
});