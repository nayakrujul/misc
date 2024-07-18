const PREFIXES = {
    a: -18,
    f: -15,
    p: -12,
    n: -9,
    u: -6,
    m: -3,
    c: -2,
    h: +2,
    k: +3,
    M: +6,
    G: +9,
    T: +12,
    P: +15,
    E: +18
}

const LENGTH = {
    1: "m",
    in: "0.0254m",
    ft: "12in",
    yd: "3ft",
    mi: "1760yd",
    nm: "1852m"
}

const MASS = {
    1: "g",
    oz: "28.34952g",
    lb: "16oz",
    st: "14lb",
    lt: "160st",
    tn: "2000lb",
    t: "1000kg"
}

const NUM_REGEX = /\d+(\.\d+)?/g;
const UNIT_REGEX = /[A-Z]+/gi;
const ALL_REGEX = /^(\d+(\.\d+)?)([A-Z]+)$/gi;

let current_set = LENGTH;

/**
 * A recursive function which finds the conversion factor between a given unit
 * in the given conversion dictionary and the base unit of the dictionary.
 * 
 * Example usage: `factor_base("mi", LENGTH)` returns `1609.344` (base unit is m).
 * 
 * @param {string} unit The unit to convert to. Must be a unit inside `dict`.
 * @param {Object.<string, string>} dict The conversion dictionary, e.g. `LENGTH` above.
 * @returns {number} The conversion factor between `unit` and the base unit.
 */
function factor_base(unit, dict) {
    let base_unit = dict["1"];
    let units = [...Object.keys(dict)];
    units.splice(units.indexOf("1"), 1);
    
    if (unit === base_unit) return 1;

    if (units.includes(unit)) {
        let val = dict[unit];
        let num = +val.match(NUM_REGEX)[0];
        let unt = val.match(UNIT_REGEX)[0];
        return num * factor_base(unt, dict);
    }

    else if ([...Object.keys(PREFIXES)].includes(pref = unit[0])) {
        let nu = unit.slice(1);
        if (units.includes(nu) || nu === base_unit) {
            return (10 ** PREFIXES[pref]) * factor_base(nu, dict);
        }
    }
}

/**
 * Using a conversion dictionary, find the conversion factor between one unit and another.
 * 
 * Example usage: `factor("mi", "km", LENGTH)` returns `1.609344` (number of km in 1mi).
 * 
 * @param {string} from The unit to convert from. Must be a unit inside `dict`.
 * @param {string} to The unit to convert to. Must be a unit inside `dict`.
 * @param {Object.<string, string>} dict The conversion dictionary, e.g. `LENGTH` above.
 * @returns {number} The conversion factor between `from` and `to`.
 */
function factor(from, to, dict) {
    return factor_base(from, dict) / factor_base(to, dict);
}

function listener() {
    let from = document.getElementById("from-box").value;
    let to = document.getElementById("to-box").value;
    let ans = document.getElementById("result");

    from = from.replaceAll(" ", "");

    let regex = [...from.matchAll(ALL_REGEX)];

    if (regex.length === 0) return ans.innerHTML = "ERROR";

    let num = regex[0][1];
    let unit = regex[0][3];

    let ret = +num * factor(unit, to, current_set);

    if (isNaN(ret) || ret === undefined) return ans.innerHTML = "ERROR";

    ans.innerHTML = +ret.toPrecision(7);
}

function set_change() {
    console.log(1)
    switch (document.getElementById("unit-set").value) {
        case "length":
            document.getElementById("from-box").value = "5.67 mi";
            document.getElementById("to-box").value = "km";
            document.getElementById("units-list").innerHTML = "m, in, ft, yd, mi, nm";
            current_set = LENGTH;
            break;
        case "mass":
            document.getElementById("from-box").value = "1.234 kg";
            document.getElementById("to-box").value = "oz";
            document.getElementById("units-list").innerHTML = "g, oz, lb, st, lt, tn, t";
            current_set = MASS;
            break;
    }
    listener();
}

document.getElementById("from-box").addEventListener("input", listener);
document.getElementById("to-box").addEventListener("input", listener);

document.getElementById("unit-set").addEventListener("input", set_change);

listener();
set_change();