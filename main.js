const bar = document.getElementById("search-bar");
const tbl = document.getElementById("pages-table");

const pages = [
    ["Logic Gates", "All logic gates constructed from only NAND gates", "20240218"],
    ["Reaction Time", "Test your reaction time online", "20240224"],
    ["Digits Of Pi", "Learn the digits of Pi", "20240227"],
    ["Exam Score", "Makes marking tests easier", "20240301"],
    ["Random", "Random number generator", "20240305"],
    ["Exam Countdown", "How long until the exams?", "20240310"],
    ["Balance Equation", "Balance any chemical equation with brute force", "20240414"],
    ["Huffman Tree", "Create a Huffman Tree instantly", "20240520"],
    ["Convert", "Convert between different units", "20240704"],
    ["GCSE Posters", "Some posters that I made in the run-up to my GCSEs", "20240713"],
    ["Physics Equation Solver", "Solve Physics equation problems instantly", "20240719"],
    ["UKMT Grade Boundaries", "Past grade boundaries for UKMT Maths Challenges", "20240721"],
    ["Imaginary Base Converter", "Convert numbers to base 2i online", "20240915"],
    ["Vernam Cipher", "Encrypt a message using a Vernam cipher", "20241108"],
    ["Matrix Transformations", "Visualise matrix transformations on an interactive graph", "20250109"],
    ["Sorting Algorithms", "See how different sorting algorithms work", "20250110"],
    ["Wordle Solver", "Find the best Wordle guess using information theory", "20250213"],
    ["Chess Clock", "A fully functional online chess clock", "20250408"],
    ["Colours", "Find information about colours easily in one place", "20250412"],
    ["A Level Boundaries", "See all past grade boundaries for A Level exams", "20250502"],
    ["Highlight", "Convert your code to syntax-highlighted images", "20250525"],
    ["Time", "Check the time in any time zone on one page", "20250602"]
];

function add_row(r) {
    let [n, d, t] = r;
    let l = "./" + n.replaceAll(" ", "-") + "/";
    let c = t.slice(0, 4) + "&#8209;" + t.slice(4, 6) + "&#8209;" + t.slice(6);
    let tr = document.createElement("tr");
    tr.innerHTML = `
        <td><a href="${l}">${n}</a></td>
        <td>${d}</td>
        <td>${c}</td>
    `;
    tbl.appendChild(tr);
}

function clear_table() {
    while (tbl.rows.length > 1) tbl.deleteRow(1);
}

function only_alphabet(s) {
    return s.toLowerCase().replace(/[^a-z]/g, '');
}

function input() {
    let text = only_alphabet(bar.value);
    clear_table();
    pages.forEach(([name, desc, date]) => {
        let nm = only_alphabet(name);
        let ds = only_alphabet(desc);
        if (nm.includes(text) || ds.includes(text)) add_row([name, desc, date]);
    });
}

pages.forEach(add_row);
bar.placeholder = "Search from " + pages.length + " projects";
bar.addEventListener("input", input);
bar.focus();
