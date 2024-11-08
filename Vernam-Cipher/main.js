const msg = document.getElementById("message");
const key = document.getElementById("keytext");
const bit = document.getElementById("bit-out");
const txt = document.getElementById("txt-out");

function toASCII(char) {
    return char.charCodeAt(0).toString(2).padStart(7, "0");
}

function xor(s1, s2) {
    return [...s1].map((_, i) => +s1[i] ^ +s2[i]).join("");
}

function fromASCII(str) {
    return String.fromCharCode(parseInt(str, 2));
}

function makePrintable(str) {
    return [...str].map(c => (32 <= c.charCodeAt(0) && c.charCodeAt(0) <= 126) ? c : "�").join("");
}

function bitCipher(s1, s2) {
    return [...s1].map((_, i) => xor(toASCII(s1[i]), toASCII(s2[i]))).join(" ");
}

function txtCipher(s1, s2) {
    return makePrintable([...s1].map((_, i) => fromASCII(xor(toASCII(s1[i]), toASCII(s2[i])))).join(""));
}

function allASCII(str) {
    return [...str].every(c => c.charCodeAt(0) < 128);
}

function handler() {
    let [a, b] = [msg.value, key.value];
    if (allASCII(a + b)) {
        if (a.length <= b.length) {
            bit.innerHTML = "Bitstring: <code>" + bitCipher(a, b) + "</code>";
            txt.innerHTML = "Text: <code>" + txtCipher(a, b) + "</code>";
        } else {
            bit.innerHTML = "ERROR!";
            txt.innerHTML = "Key must be at least as long as message.";
        }
    } else {
        bit.innerHTML = "ERROR!";
        txt.innerHTML = "Key and message must be ASCII only.";
    }
}

msg.addEventListener("input", handler);
key.addEventListener("input", handler);