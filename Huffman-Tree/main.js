const inp = document.getElementById("inputbox");
const out1 = document.getElementById("output1");
const out2 = document.getElementById("output2");
const out3 = document.getElementById("output3");

/**
 * Returns the counts of each character in a string.
 * @param {String} str  The string to get the counts for.
 * @returns {Array[]}  An array of `[count, char]` pairs.
 */
function counts(str) {
    let unique = [...new Set(str)];
    return unique.map((char) => [str.split(char).length - 1, char]).sort((a, b) => a[0] - b[0]);
}

/**
 * Generates a Huffman Tree for a given string.
 * @param {String} string  The string to generate the Huffman Tree for.
 * @returns {Array}  A nested array representing the generated Huffman Tree.
 */
function huffman_tree(string) {
    let arr = counts(string);
    while (arr.length > 1) {
        let [a, x] = arr.shift();
        let [b, y] = arr.shift();
        let c = [a + b, [x, y]];
        arr.push(c);
        arr.sort((a, b) => a[0] - b[0]);
    }
    let ret = arr[0][1];
    if ((typeof ret) === "string") {
        return [ret]
    } else {
        return ret;
    }
}

/**
 * Returns the codes for each character from a Huffman Tree array.
 * @param {Array} arr  The nested array representing a Huffman Tree.
 * @returns {Array[]}  An array of `[char, code]` pairs.
 */
function codes(arr) {
    let ret = [];
    for (let i = 0; i < arr.length; i++) {
        if ((typeof arr[i]) === "string") {
            ret.push([arr[i], i + ""]);
        } else {
            ret.push(...codes(arr[i]).map(l => [l[0], i + l[1]]));
        }
    }
    return ret;
}

/**
 * Converts a given string into a bitstring from a given Huffman Tree.
 * @param {String} string  The string to convert into 1s and 0s.
 * @param {Array[]} tree  An array of `[char, code]` pairs representing the Huffman Tree.
 * @returns {String}  A series of 1s and 0s representing the encoded string.
 */
function bitstring(string, tree) {
    let dict = Object.fromEntries(tree);
    return [...string].map((c) => dict[c]).join("");
}

/**
 * Rounds and formats a decimal into a percentage change string.
 * @param {Number} number  An unrounded decimal number to format.
 * @returns {String}  The final formatted string.
 */
function format_num(number) {
    let rounded = Math.round(number * 100);
    if (rounded < 0) return "" + rounded;
    if (rounded > 0) return "+" + rounded;
    return "±0";
}

/**
 * Writes the codes to the output3 table element.
 * @param {Array[]} tree  An array of `[char, code]` pairs.
 */
function generate_table(tree) {
    let rows = [...out3.rows];
    rows.shift();
    rows.map(tr => tr.remove());
    tree.map(pair => {
        let [char, code] = pair;
        let row = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        td1.innerHTML = `<span class="char">${char}</span>`;
        td2.innerHTML = inp.value.split(char).length - 1;
        td3.innerHTML = `<span class="code">${code}</span>`;
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        out3.appendChild(row);
    });
}

/**
 * Event handler for the input box change event.
 */
function change() {
    let s = inp.value;
    if (s === "") {
        out1.innerHTML = "7-bit ASCII: <b>0 bits</b>";
        out2.innerHTML = "Encoded: <b>0 bits</b> (±0%)";
        generate_table([]);
        return;
    }
    out1.innerHTML = `7-bit ASCII: <b>${a = s.length * 7} bits</b>`;
    out2.innerHTML =
        `Encoded: <b>${n = bitstring(s, c = codes(huffman_tree(s))).length} bit${n !== 1 ? "s" : ""}</b> `
        + `<i>(${format_num((n - a) / a)}%)</i>`;
    generate_table(c);
}

inp.addEventListener("input", change);
change();

makeSortable(out3);