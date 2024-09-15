/**
 * Equivalent of Python's `divmod` function. Returns integer division and remainder of `n` and `d`.
 * 
 * Example: `divmod(7, -2) == [-3, 1]`
 * 
 * @param {number} n Integer dividend.
 * @param {number} d Integer divisor.
 * @returns {[number, number]} Same as Python's `divmod` function.
 */
function divmod(n, d) {
    let div = Math.ceil(n / d) || 0;
    let mod = n - div * d;
    return [div, mod];
}

/**
 * Converts a decimal integer `n` to any base `b`, including negative bases.
 * 
 * Example: `dec_to_base(10, -4) == [1, 2, 2]`
 * 
 * @param {number} n Any integer, including negative integers if `b` is also negative.
 * @param {number} b Any integer with `abs(b) > 1`, including negative integers.
 * @returns {number[]} A list of digits in base `b`.
 */
function dec_to_base(n, b) {
    if (n === 0) return [0];
    let r = [];
    while (n !== 0) {
        [n, d] = divmod(n, b);
        r.push(d);
    }
    return r.reverse();
}

/**
 * Interleaves the two arrays, filling with 0s if one is exhausted.
 * 
 * Example: `interleave([1, 2], [3, 4, 5, 6]) == [1, 3, 2, 4, 0, 5, 0, 6]`
 * 
 * @param {number[]} arr1 The first array.
 * @param {number[]} arr2 The second array.
 * @returns {number[]} The result of interleaving.
 */
function interleave(arr1, arr2) {
    let mlen = Math.max(arr1.length, arr2.length);
    let ret = [];
    for (let i = 0; i < mlen; i++) {
        if (i >= arr1.length) {
            ret.push(0);
        } else {
            ret.push(arr1[i]);
        }
        if (i >= arr2.length) {
            ret.push(0);
        } else {
            ret.push(arr2[i]);
        }
    }
    return ret;
}

/**
 * Converts a complex number of the form `a + bi` to base 2i, assuming `a` and `b` are integers.
 * @param {number} a The real part of the number: can be any integer.
 * @param {number} b The imaginary part of the number: can be any integer.
 * @returns {number[]} A list of digits in base 2i. Last digit is the one after the decimal point.
 */
function to_base_2i(a, b) {
    let real = dec_to_base(a, -4);
    let imag = dec_to_base(-b * 2, -4);
    return interleave(imag.reverse(), real.reverse()).reverse();
}

function show_output() {
    result = to_base_2i(+inp_a.value, +inp_b.value).join("");
    out.innerHTML = result.slice(0, -1) + "." + result[result.length - 1];
}

function validate_input(event) {
    event.target.value = parseInt(event.target.value) || 0;
    show_output();
}

let inp_a = document.getElementById("inputa");
let inp_b = document.getElementById("inputb");
let out = document.getElementById("output");

inp_a.addEventListener("input", validate_input);
inp_b.addEventListener("input", validate_input);