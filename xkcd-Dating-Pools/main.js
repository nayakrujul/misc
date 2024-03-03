const input = document.getElementById("inputbox");
const outmin = document.getElementById("outputmin");
const outmax = document.getElementById("outputmax");

function change() {
    let n = input.value;
    n = n < 0 ? 0 : n > 120 ? 120: n;
    input.value = n;
    if (n < 14) {
        outmin.innerHTML = outmax.innerHTML = "--";
    } else {
        outmin.innerHTML = ("" + (n / 2 + 7)).replaceAll(".5", "&half;");
        outmax.innerHTML = 2 * (n - 7);
    }
}

input.addEventListener("input", change);