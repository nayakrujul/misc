const box = document.getElementById("inputbox");
const btn = document.getElementById("checkbtn");
const rst = document.getElementById("restart");
const tbl = document.getElementById("mistake");
const col = document.getElementById("colours");
const out = document.getElementById("output");

const PI = "314159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259036001133053054882046652138414695194151160943305727036575959195309218611738193261179310511854807446237996274956735188575272489122793818301194912983367336244065664308602139494639522473719070217986094370277053921717629317675238467481846766940513200056812714526356082778577134275778960917363717872146844090122495343014654958537105079227968925892354201995611212902196086403441815981362977477130996051870721134999999837297804995105973173281609631859502445945534690830264252230825334468503526193118817101000313783875288658753320838142061717766914730359825349042875546873115956286388235378759375195778185778053217122680661300192787661119590921642019893809525720106548586327886593615338182796823030195203530185296899577362259941389124972177528347913151557485724245415069595082953311686172785588907509838175463746493931925506040092770167113900984882401285836160356370766010471018194295559619894676783744944825537977472684710404753464620804668425906949129331367702898915210475216205696602405803815019351125338243003558764024749647326391419927260426992279678235478163600934172164121992458631503028618297455570674983850549458858692699569092721079750930295532116534498720275596023648066549911988183479775356636980742654252786255181841757467289097777279380008164706001614524919217321721477235014144197356854816136115735255213347574184946843852332390739414333454776241686251898356948556209921922218427255025425688767179049460165346680498862723279178608578438382796797668145410095388378636095068006422512520511739298489608412848862694560424196528502221066118630674427862203919494504712371378696095636437191728746776465757396241389086583264599581339047802759009946576407895126946839835259570"


function check(input) {
    const n = input.length;
    const m = PI.length;

    // dp[i][j] = minimum mistakes to align input[0..i) with PI[0..j)
    const dp = Array.from({ length: n + 1 }, () =>
        Array(m + 1).fill(Infinity)
    );

    // store backtracking info
    const parent = Array.from({ length: n + 1 }, () =>
        Array(m + 1).fill(null)
    );

    dp[0][0] = 0;

    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            if (dp[i][j] === Infinity) continue;

            const cost = dp[i][j];

            // ---- 1. Exact match ----
            if (i < n && j < m && input[i] === PI[j]) {
                if (cost < dp[i + 1][j + 1]) {
                    dp[i + 1][j + 1] = cost;
                    parent[i + 1][j + 1] = { i, j, type: 0 };
                }
            }

            // ---- 2. Missing digits (1–4 in PI) ----
            for (let len = 1; len <= 4 && j + len <= m; len++) {
                if (cost + 1 < dp[i][j + len]) {
                    dp[i][j + len] = cost + 1;
                    parent[i][j + len] = {
                        i,
                        j,
                        type: 1,
                        length: len
                    };
                }
            }

            // ---- 3. Extra digits (1–2 in input) ----
            for (let len = 1; len <= 2 && i + len <= n; len++) {
                if (cost + 1 < dp[i + len][j]) {
                    dp[i + len][j] = cost + 1;
                    parent[i + len][j] = {
                        i,
                        j,
                        type: 2,
                        length: len
                    };
                }
            }

            // ---- 4. Substitution (1–2 digits) ----
            for (
                let len = 1;
                len <= 2 && i + len <= n && j + len <= m;
                len++
            ) {
                const a = input.slice(i, i + len);
                const b = PI.slice(j, j + len);

                if (a !== b) {
                    const newCost = cost + 1;
                    const existingCost = dp[i + len][j + len];
                    const existingParent = parent[i + len][j + len];

                    const shouldUpdate =
                        newCost < existingCost ||
                        (
                            newCost === existingCost &&
                            existingParent &&
                            existingParent.type === 4 &&
                            len < existingParent.length
                        );

                    if (shouldUpdate) {
                        dp[i + len][j + len] = newCost;
                        parent[i + len][j + len] = {
                            i,
                            j,
                            type: 4,
                            length: len
                        };
                    }

                    break; // prefer shortest substitution
                }
            }

            // ---- 5. Wrong order (2–4 digits, permutation match) ----
            for (
                let len = 2;
                len <= 4 && i + len <= n && j + len <= m;
                len++
            ) {
                const a = input.slice(i, i + len);
                const b = PI.slice(j, j + len);

                if (
                    a !== b &&
                    a.split("").sort().join("") ===
                        b.split("").sort().join("")
                ) {
                    const newCost = cost + 1;
                    const existingCost = dp[i + len][j + len];
                    const existingParent = parent[i + len][j + len];

                    const shouldUpdate =
                        newCost < existingCost ||
                        (
                            newCost === existingCost &&
                            existingParent &&
                            existingParent.type === 3 &&
                            len < existingParent.length
                        );

                    if (shouldUpdate) {
                        dp[i + len][j + len] = newCost;
                        parent[i + len][j + len] = {
                            i,
                            j,
                            type: 3,
                            length: len
                        };
                    }

                    break; // prefer shortest valid permutation
                }
            }
        }
    }

    // Find best end state (minimal cost over j)
    let bestJ = 0;
    let bestCost = Infinity;

    for (let j = 0; j <= m; j++) {
        if (dp[n][j] < bestCost) {
            bestCost = dp[n][j];
            bestJ = j;
        }
    }

    // Backtrack
    const mistakes = [];
    let i = n;
    let j = bestJ;

    while (i !== 0 || j !== 0) {
        const p = parent[i][j];
        if (!p) break;

        if (p.type !== 0) {
            if (p.type === 1) {
                // missing digits
                mistakes.push({
                    index: i,
                    length: p.length,
                    type: 1,
                    correct: PI.slice(p.j, p.j + p.length)
                });
            } else if (p.type === 2) {
                // extra digits
                mistakes.push({
                    index: p.i,
                    length: p.length,
                    type: 2,
                    correct: ""
                });
            } else if (p.type === 3 || p.type === 4) {
                mistakes.push({
                    index: p.i,
                    length: p.length,
                    type: p.type,
                    correct: PI.slice(p.j, p.j + p.length)
                });
            }
        }

        i = p.i;
        j = p.j;
    }

    return mistakes.reverse();
}


function handle() {
    box.disabled = true;
    btn.hidden = true;
    rst.hidden = false;
    col.hidden = false;
    tbl.hidden = false;

    let text = box.value.replaceAll(".", "");
    let mistakes = check(text);
    out.innerHTML = `Total ${text.length} digits <i>(${mistakes.length} mistakes)</i>`;

    let cols = "";
    let m = 0;

    for (let n = 0; n < text.length; n++) {
        if (m < mistakes.length && n === mistakes[m].index) {
            mst = mistakes[m]
            tbl.innerHTML += `
                <tr>
                    <td>${n + 1}</td>
                    <td>${['Missing digits', 'Extra digits', 'Wrong order', 'Substitution'][mst.type - 1]}</td>
                    <td><code class="orange">${mst.type !== 1 ? text.substring(n, n + mst.length) : '_'}</code></td>
                    <td><code class="green">${mst.correct || '_'}</code></td>
                </tr>
            `;
            if (mst.type === 1) {
                cols += `<span class="orange">${'_'.repeat(mst.length)}</span>`;
                n--;
            } else {
                cols += `<span class="orange">${text.substring(n, n + mst.length)}</span>`;
                n += mst.length - 1;
            }
            m++;
        } else {
            cols += `<span class="green">${text[n]}</span>`;
        }
        if (n === 0) cols += `<span class="green">.</span>`;
    }

    col.innerHTML = cols;
}

function reset() {
    box.disabled = false;
    btn.hidden = false;
    rst.hidden = true;
    col.hidden = true;
    tbl.hidden = true;

    out.innerHTML = "";
    col.innerHTML = "";

    box.value = "";
    tbl.innerHTML = `
        <tr>
            <th>Digit number</th>
            <th>Type of mistake</th>
            <th>Mistake</th>
            <th>Correct digits</th>
        </tr>
    `;
}

function only_numbers(str) {
    return [...str.matchAll(/\d|\./g)].join("");
}

const insert = (arr, index, newItem) => [...arr.slice(0, index), newItem, ...arr.slice(index)];
const keep_first = (str, char) => [...str.slice(0, i = str.indexOf(char) + 1), ...str.slice(i).replaceAll(char, "")].join("");

function input_change() {
    let inp = only_numbers(box.value);
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
    box.value = inp;
}

btn.addEventListener("click", handle);
rst.addEventListener("click", reset);
box.addEventListener("input", input_change);
