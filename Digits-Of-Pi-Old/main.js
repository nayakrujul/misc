const input = document.getElementById("inputbox");
const peek = document.getElementById("peekbtn");
const col = document.getElementById("colours");
const out = document.getElementById("output");
const nc = document.getElementById("notice");

let peeks = 0;

function only_numbers(str) {
    return [...str.matchAll(/\d|\./g)].join("");
}

const insert = (arr, index, newItem) => [...arr.slice(0, index), newItem, ...arr.slice(index)];
const keep_first = (str, char) => [...str.slice(0, i = str.indexOf(char) + 1), ...str.slice(i).replaceAll(char, "")].join("");

const pi = only_numbers("3.1415926535 8979323846 2643383279 5028841971 6939937510 5820974944 5923078164 0628620899 8628034825 3421170679 8214808651 3282306647 0938446095 5058223172 5359408128 4811174502 8410270193 8521105559 6446229489 5493038196 4428810975 6659334461 2847564823 3786783165 2712019091 4564856692 3460348610 4543266482 1339360726 0249141273 7245870066 0631558817 4881520920 9628292540 9171536436 7892590360 0113305305 4882046652 1384146951 9415116094 3305727036 5759591953 0921861173 8193261179 3105118548 0744623799 6274956735 1885752724 8912279381 8301194912 9833673362 4406566430 8602139494 6395224737 1907021798 6094370277 0539217176 2931767523 8467481846 7669405132 0005681271 4526356082 7785771342 7577896091 7363717872 1468440901 2249534301 4654958537 1050792279 6892589235 4201995611 2129021960 8640344181 5981362977 4771309960 5187072113 4999999837 2978049951 0597317328 1609631859 5024459455 3469083026 4252230825 3344685035 2619311881 7101000313 7838752886 5875332083 8142061717 7669147303 5982534904 2875546873 1159562863 8823537875 9375195778 1857780532 1712268066 1300192787 6611195909 2164201989");

function adjust_height() {
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
}

function change() {
    let inp = only_numbers(input.value);
    if (inp.startsWith(".")) {
        inp = "3" + inp;
    }
    if (inp[0] !== "3") {
        inp = "3" + inp.slice(1);
    }
    if (inp.length >= 1 && inp[1] !== ".") {
        inp = insert(inp, 1, ".").join("");
    }
    inp = keep_first(inp, ".");
    input.value = inp;
    let code = "";
    let corr = 0;
    let atleast = false;
    for (i = 0; i < inp.length; i++) {
        let c = inp[i];
        let d = pi[i];
        if (c === d) {
            code += `<span class="green">${c}</span>`;
            if (d !== ".") corr++;
        } else if (d !== undefined) {
            code += `<span class="orange">${c}</span>`;
        } else {
            code += c;
            atleast = true;
        }
    }
    let len = inp.replaceAll(".", "").length;
    out.innerHTML =
        "<i>" + len + " digit" + (len !== 1 ? "s" : "") +
        " (" + (atleast ? "at least " : "") + corr + " correct)</i>";
    col.innerHTML = code || "&nbsp;";
    adjust_height();
}

function peeked() {
    input.disabled = true;
    let len = input.value.length + peeks * 5;
    col.innerHTML += `<i class="grey">` + pi.slice(len, len + 5) + `</i>`;
    nc.innerHTML = "<br />Refresh to restart.";
    peeks++;
}

input.addEventListener("input", change);
peek.addEventListener("click", peeked);

adjust_height();

input.focus();