const lst1 = document.getElementById("list1");
const lst2 = document.getElementById("list2");
const txt1 = document.getElementById("len1");
const txt2 = document.getElementById("len2");
const txt3 = document.getElementById("len3");
const out = document.getElementById("output");
const btn = document.getElementById("copy");

function pluralise(n, s, p=null) {
    if (p === null) p = s + "s";
    if (n === 1) return n + " " + s;
    else return n + " " + p; 
}

function handler() {
    btn.value = "Copy!";
    names1 = lst1.value.split("\n").filter(a => a.length);
    names2 = lst2.value.split("\n").filter(b => b.length);
    let res = names1.filter(x => !names2.includes(x));
    out.innerHTML = res.join("\n") || `<i>Nothing to display right now...</i>`;
    txt1.innerHTML = pluralise(names1.length, "name");
    txt2.innerHTML = pluralise(names2.length, "name");
    txt3.innerHTML = pluralise(res.length, "name");
}

lst1.addEventListener("input", handler);
lst2.addEventListener("input", handler);

btn.addEventListener("click", () => {
    btn.value = "Loading...";
    navigator.clipboard.writeText(out.innerHTML)
        .then(() => btn.value = "Copied!").catch(() => btn.value = "Error.");
});