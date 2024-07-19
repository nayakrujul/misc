// Each of these equations is
// of the form a = b * c,
// with the string being "abc".
// Example: F = m * a becomes "Fma"
const EQUATION_LIST = [
    "mDV", "EmL", "kpV", "svt", "Fma",
    "pmv", "WFd", "EPt", "Fkx", "Wmg",
    "FPA", "MFd", "QIt", "VIR", "EQV",
    "PVI", "vfl"
];

let symbols = EQUATION_LIST.map(s => new Set(s));

const eqSet = (xs, ys) =>
    xs.size === ys.size &&
    [...xs].every((x) => ys.has(x));

/**
 * 
 * @param {Object.<string, number>} given The {quantity: value} dictionary that we are given.
 * @param {string} find The quantity to find.
 * @returns {[string, number]} The equation that was used, and the result (or NaN if impossible). 
 */
function solve(given, find) {
    let have = new Set(Object.keys(given));
    have.add(find);
    let equation = undefined;
    for (let i = 0; i < symbols.length; i++) {
        if (eqSet(have, symbols[i])) {
            equation = EQUATION_LIST[i];
            break;
        }
    }
    if (equation === undefined) return ["ERROR", NaN];
    let [a, b] = Object.values(given);
    if (find === equation[0]) return [equation, a * b];
    if (a === given[equation[0]]) return [equation, a / b];
    return [equation, b / a];
}

function input_change() {
    let g = Object.fromEntries([
        [ document.getElementById("var1").value,
          document.getElementById("val1").value ],
        [ document.getElementById("var2").value,
          document.getElementById("val2").value ],
    ]);
    let f = document.getElementById("find").value;
    let [e, z] = solve(g, f);
    if (e.length === 3) e = e[0] + "=" + e.slice(1);
    document.getElementById("ans").innerHTML = z;
    document.getElementById("eqn").innerHTML = e;
}

document.getElementById("var1").addEventListener("input", input_change);
document.getElementById("val1").addEventListener("input", input_change);
document.getElementById("var2").addEventListener("input", input_change);
document.getElementById("val2").addEventListener("input", input_change);
document.getElementById("find").addEventListener("input", input_change);

input_change();