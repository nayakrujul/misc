// Elements
const btn = document.getElementById("balance-btn");
const lhs = document.getElementById("lhs-input");
const rhs = document.getElementById("rhs-input");
const out = document.getElementById("out-text");

// Constants for later
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const digits = "0123456789"

/**
 * Replicates Python's dict.items() function.
 * 
 * @param {Object} dict The dictionary.
 * @returns {Array[]} List of [key, value] pairs.
 */
function items(dict) {
    // Return list
    let ret = [];

    // Iterate
    for (key in dict) ret.push([key, dict[key]]);
    return ret;
}

/**
 * Checks if two dictionaries are equal. I hate JS.
 * 
 * @param {Object} d1 First dictionary.
 * @param {Object} d2 Second dictionary.
 * @returns {Boolean} Are they equal?
 */
function dict_equal(d1, d2) {
    return JSON.stringify(items(d1).sort()) === JSON.stringify(items(d2).sort())
}

/**
 * Similar to https://github.com/nayakrujul/balance-equation/blob/main/balance/balance.py#L5,
 * except that p is automatically defined as 1.
 *  
 * @param {Number} max Maximum value to count up to (q in the Python code).
 * @param {Number} len Length of list (r in the Python code).
 * @param {*} pref Prefix (used only for recursion)
 * @returns {Number[][]} Generator of integer arrays, counting up from [1, 1, ..., 1] to [max, max, ..., max]
 */
function* count_up(max, len, pref=null) {
    // Initialise prefix
    if (pref === null) pref = [];

    // Iterate through [1..max]
    for (let x = 1; x <= max; x++) {
        if (len === 1) {
            // No more recursion
            yield [...pref, x];
        } else {
            // Recurse
            yield* count_up(max, len - 1, [...pref, x]);
        }
    }
}

/**
 * Check if a given list of multipliers correctly balances the equation.
 * 
 * @param {Array[][]} left Left side of the equation: list of tokenised molecules.
 * @param {Array[][]} right Right side of the equation: list of tokenised molecules.
 * @param {Number[]} mults List of multipliers for each molecule.
 * @returns {Boolean} Does this list work?
 */
function check_balance(left, right, mults) {
    let newl = {};
    let newr = {};
    
    for (let i = 0; i < left.length; i++) {
        for (const [el, num] of left[i]) {
            if (newl[el] === undefined) newl[el] = 0;
            newl[el] += mults[i] * num;
        }
    }
    for (let j = 0; j < right.length; j++) {
        for (const [el, num] of right[j]) {
            if (newr[el] === undefined) newr[el] = 0;
            newr[el] += mults[left.length + j] * num;
        }
    }

    return dict_equal(newl, newr);
}

/**
 * Balances a tokenised chemical equation.
 * 
 * @param {Array[][]} l Left side of equation: list of tokenised molecules.
 * @param {Array[][]} r Right side of equation: list of tokenised molecules.
 * @param {Number} lim Maximum multiplier (limit) to brute-force up to.
 * @returns {Number[]} List of multipliers for each molecule.
 */
function balance(l, r, lim) {
    // Total length
    let total = l.length + r.length;

    // Iterate through, checking each list
    for (const lst of count_up(lim, total)) {
        if (check_balance(l, r, lst)) {
            return lst;
        }
    }

    // Nothing found
    return [];
}

/**
 * Splits a molecule string into its individual elements.
 * 
 * Example: tokenise("C6H12O6") == [["C", 6], ["H", 12], ["O", 6]]
 * 
 * @param {String} mol Molecule string.
 * @returns {Array[]} List of [elem, num] pairs.
 */
function tokenise(mol) {
    // Return list
    let r = [];

    // Current value (initialised to null)
    let c = null;

    for (let i = 0; i < mol.length; i++) {
        let char = mol[i];
        if (uppercase.includes(char)) {
            if (c !== null) {
                if (c[1] === null) c[1] = 1;
                r.push(c);
            }
            c = [char, null];
        } else if (lowercase.includes(char)) {
            if (c !== null) c[0] += char;
        } else if (digits.includes(char)) {
            if (c[1] === null) {
                c[1] = +char;
            } else {
                c[1] = c[1] * 10 + +char;
            }
        }
    }

    // Push anything left over
    if (c !== null) {
        if (c[1] === null) c[1] = 1;
        r.push(c);
    }

    return r;
}

/**
 * Formats a list of numbers into HTML.
 * 
 * @param {String[]} l List of elements on the left
 * @param {String[]} r List of elements on the right
 * @param {Number[]} nums List of multipliers from the balance function
 * @returns {String} HTML-formatted text for the output
 */
function format(l, r, nums) {
    if (nums.length === 0) return "";

    // Output text
    let o = [];

    for (let p = 0; p < l.length; p++) {
        // Put numbers in subscript
        let elem = l[p].replaceAll(/(\d+)/g, `<sub>$1</sub>`);
        if (nums[p] > 1) elem = elem = `<span class="highlight">` + nums[p] + `</span>` + elem;
        o.push(elem);
    }

    o.push("&rarr;");

    for (let q = 0; q < r.length; q++) {
        // Put numbers in subscript
        let elem = r[q].replaceAll(/(\d+)/g, `<sub>$1</sub>`);
        if (nums[q + l.length] > 1) elem = `<span class="highlight">` + nums[q + l.length] + `</span>` + elem;
        o.push(elem);
    }

    return o.join(" + ").replaceAll("+ &rarr; +", "&rarr;");
}

/**
 * The actual interface function: takes two strings and a number, and returns the HTML.
 * 
 * Example: interface("CH4+O2", "CO2+H2O") == "CH<sub>4</sub> + 2O<sub>2</sub> &rarr; CO<sub>2</sub> + 2H<sub>2</sub>O"
 * 
 * @param {String} lhst Left-hand side of the equation
 * @param {String} rhst Right-hand side of the equation
 * @param {Number} limit Limit of the count_up function
 * @returns {String} HTML-formatted string to put in the output element
 */
function interface(lhst, rhst, limit=10) {
    lt = lhst.replaceAll(" ", "").split("+").map(tokenise);
    rt = rhst.replaceAll(" ", "").split("+").map(tokenise);
    return format(
        lhst.replaceAll(" ", "").split("+"),
        rhst.replaceAll(" ", "").split("+"),
        balance(lt, rt, limit)
    );
}

// Event listener
btn.addEventListener("click", () => {
    let ret = interface(lhs.value, rhs.value);
    if (ret.length > 0) {
        out.innerHTML = ret;
    } else {
        // Do it a second time for speed reasons
        let ret = interface(lhs.value, rhs.value, 25);
        if (ret.length > 0) {
            out.innerHTML = ret;
        } else {
            out.innerHTML = "Error: could not balance";
        }
    }
});

btn.click();