const aqaFuse = new Fuse(Object.keys(aqa), {threshold: 0.4, shouldSort: true, findAllMatches: true, ignoreLocation: true});
let currFuse = aqaFuse;
let currDict = aqa;
let topResult = null;

function update_search_box() {
    let search = document.getElementById("subject").value;
    let lst = currFuse.search(search).map(r => r.item);
    document.getElementById("autocomplete").innerHTML = lst.map(item => `<li class="autocomplete-item">${item}</li>`).join(" ");
    [...document.getElementsByClassName("autocomplete-item")].forEach(li => li.addEventListener("click", li_click));
    if (lst.length !== 0) topResult = lst[0];
}

function li_click({target}) {
    topResult = target.innerText;
    showResults();
}

function clearResults() {
    let tbl = document.getElementById("results");
    while (tbl.rows.length > 1)
        tbl.deleteRow(1);
}

function showResults() {
    document.getElementById("subject").value = topResult;
    update_search_box();
    document.getElementById("subject").blur();
    let dct = currDict[topResult];
    clearResults();
    Object.keys(dct).reverse().forEach(k => {
        let [m, a_, a, b, c, d, e] = dct[k];
        document.getElementById("results").innerHTML += `
            <tr>
                <td>${k}</td>
                <td>${m}</td>
                <td>${a_} <i>(${(a_ * 100 / m).toFixed(1)}%)</i></td>
                <td>${a} <i>(${(a * 100 / m).toFixed(1)}%)</i></td>
                <td>${b} <i>(${(b * 100 / m).toFixed(1)}%)</i></td>
                <td>${c} <i>(${(c * 100 / m).toFixed(1)}%)</i></td>
                <td>${d} <i>(${(d * 100 / m).toFixed(1)}%)</i></td>
                <td>${e} <i>(${(e * 100 / m).toFixed(1)}%)</i></td>
            </tr>
        `;
    });
    document.getElementById("results").hidden = false;
}

document.getElementById("subject").addEventListener("input", update_search_box);
document.getElementById("subject").addEventListener("focusin", () => document.getElementById("autocomplete").hidden = false);
document.getElementById("subject").addEventListener("focusout", () => setTimeout(() => document.getElementById("autocomplete").hidden = true, 100));
document.getElementById("subject").addEventListener("keyup", ({key}) => key == "Enter" && topResult !== null ? showResults() : null);
document.getElementById("subject").focus();
