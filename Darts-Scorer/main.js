const inp = document.getElementById("input");
const lst = document.getElementById("ulist");
const tot = document.getElementById("total");

let sum = 0; let num = 0;

function valid_input(str) {
    if (str == "" + (+str)) return [0 <= +str && +str <= 20 || [25, 50].includes(+str), +str]
    else if (str.endsWith(",,")) return [0 <= (n = +str.substring(0, str.length - 2)) && n <= 20, n * 3];
    else if (str.endsWith(",")) return [0 <= (n = +str.substring(0, str.length - 1)) && n <= 20, n * 2];
    else return [false, 0];
}

function input_listener({key}) {
    let [valid, score] = valid_input(inp.value);
    if (!valid) return inp.value = "";
    if (key == "Enter") {
        sum += score; num++;
        lst.innerHTML += `<li class="no-padding"><code>${inp.value}</code> = ${score}</li>`;
        tot.innerHTML = `(Total: <b>${sum}</b> from ${num} throw` + (num !== 1 ? "s" : "") + `)`;
        inp.value = "";
    }
}

inp.addEventListener("keyup", input_listener);