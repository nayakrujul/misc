function divmod(p, q) {
    return [Math.floor(p / q), p % q];
}

function int_to_binary(num) {
    let ans = "";
    while (num >= 1) {
        [num, b] = divmod(num, 2);
        ans = b + ans;
    }
    return ans;
}

function int_from_binary(str) {
    let res = 0;
    for (let i = 0; i < str.length; i++) {
        res += 2 ** i * str[str.length - i - 1];
    }
    return res;
}

function float_to_binary(num, bits=23) {
    let i = -1;
    let ans = "";
    while (bits-- > -1) {
        let j = 2 ** i--;
        if (num >= j) {
            ans += 1;
            num -= j;
        } else {
            ans += 0;
        }
    }
    // Rounding
    if (ans[ans.length - 1] === "0") return ans.slice(0, -1);
    let k = 1;
    ans = [...ans];
    while (ans[ans.length - k] === "1") {
        ans[ans.length - k++] = "0";
    }
    ans[ans.length - k] = "1";
    return ans.join("").slice(0, -1);
}

function float_from_binary(str) {
    let res = 0;
    for (let i = 0; i < str.length; i++) {
        res += 2 ** ~i * str[i];
    }
    return res;
}

function find_exponent(num, min=-127, max=128) {
    if (num >= 1) {
        for (let i = 1; i <= max; i++) {
            if (2 ** i > num) return i - 1;
        }
        return max;
    } else {
        for (let i = -1; i >= min; i--) {
            if (2 ** i < num) return i;
        }
        return min;
    }
}

function zfill(str, len=8) {
    while (str.length < len) str = "0" + str;
    return str;
}

function floating_point_representation(num) {
    if (num === 0) return ["0", zfill("0", 8), zfill("0", 23), 0, 0, 0];
    let sgn = num < 0 ? 1 : 0;
    num = Math.abs(num);
    let exp = find_exponent(num);
    let man = float_to_binary(num / (2 ** exp) - 1);
    let mtr = float_from_binary(man);
    let tru = (sgn ? "-" : "") + (1 + mtr) * 2 ** exp;
    let bex = zfill(int_to_binary(exp + 127));
    return [sgn, bex, man, mtr, tru, exp];
}

function input_change() {
    let val = parseFloat(document.getElementById("num-input").value);
    if (!isNaN(val)) {
        let [s, b, m, r, t, e] = floating_point_representation(val);
        document.getElementById("output1").innerHTML = t;
        document.getElementById("output2").innerHTML = s;
        document.getElementById("output3").innerHTML = b;
        document.getElementById("output4").innerHTML = m;
        document.getElementById("output5").innerHTML = `Sign: ${s === 1 ? "neg (1)" : "pos (0)"}`;
        document.getElementById("output6").innerHTML = `Exponent: 2<sup>${e}</sup> (${int_from_binary(b)})`;
        document.getElementById("output7").innerHTML = `Mantissa: 1 + ${r} (${int_from_binary(m)})`;
    } else {
        document.getElementById("output1").innerHTML =
        document.getElementById("output2").innerHTML =
        document.getElementById("output3").innerHTML =
        document.getElementById("output4").innerHTML =
        document.getElementById("output5").innerHTML =
        document.getElementById("output6").innerHTML =
        document.getElementById("output7").innerHTML =
            `ERROR`;
    }
}

input_change();
document.getElementById("num-input").addEventListener("input", input_change);