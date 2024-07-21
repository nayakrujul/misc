[...document.querySelectorAll(".js-target")].forEach(table => {
    let data = table.getAttribute("js-data").split("\n");
    data.forEach((row, index) => {
        let tr = document.createElement("tr");
        row.split("\t").forEach(str => {
            let cell = document.createElement(index === 0 ? "th" : "td");
            cell.innerHTML = str;
            tr.appendChild(cell);
        });
        table.appendChild(tr);
    });
});