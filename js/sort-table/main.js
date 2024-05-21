const tbls = document.querySelectorAll("table.sort-table");

function sortTable(event) {
    let image = event.target;
    let row = image.parentElement.parentElement;
    let index = image.getAttribute("st-index");
    let dir = image.getAttribute("st-dir");
    [...row.querySelectorAll(
        "img.st-image:not([st-dir='both'])"
    )].forEach((img) => {
        img.src = "https://misc.rujulnayak.com/js/sort-table/assets/updown.svg";
        img.setAttribute("st-dir", "both");
    });
    if (dir === "down") {
        image.src = "https://misc.rujulnayak.com/js/sort-table/assets/up.svg";
        image.setAttribute("st-dir", "up");
    } else {
        image.src = "https://misc.rujulnayak.com/js/sort-table/assets/down.svg";
        image.setAttribute("st-dir", "down");
    }
    let table = row.parentElement.parentElement;
    let rows = [...table.rows];
    rows.shift();
    let old_rows = [...rows];
    rows.sort((a, b) => {
        let x = [...a.children][index].innerText;
        let y = [...b.children][index].innerText;
        if (x === y) return 0;
        return (x > y) ? 1 : -1;
    });
    if (dir === "down") rows.reverse();
    old_rows.forEach((elem) => elem.remove());
    rows.forEach((elem) => table.appendChild(elem));
}

function makeSortable(tbl) {
    let rows = [...tbl.rows];
    if (rows.length === 0) throw Error("Empty table cannot be made sortable");
    let heads = [...rows.shift().children];
    heads.forEach((th, i) => {
        let img = document.createElement("img");
        img.src = "https://misc.rujulnayak.com/js/sort-table/assets/updown.svg";
        img.style.height = "100%";
        img.style.cursor = "pointer";
        img.classList.add("st-image");
        img.setAttribute("st-index", i);
        img.setAttribute("st-dir", "both");
        th.appendChild(img);
        img.addEventListener("click", sortTable);
    });
}

tbls.forEach(makeSortable);