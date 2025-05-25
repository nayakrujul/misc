const EXTENSIONS = {
    "c": "C",
    "cpp": "C++",
    "cs": "C#",
    "css": "CSS",
    "go": "Go",
    "java": "Java",
    "js": "JavaScript",
    "txt": "Plain Text",
    "py": "Python",
    "rb": "Ruby",
    "scala": "Scala",
    "sql": "SQL",
    "ts": "TypeScript",
    "html": "HTML"
}

const cnv = document.getElementById("canvas");
const sb = document.getElementById("sandbox");

const start = document.getElementById("start-line");
const end = document.getElementById("end-line");

let start_value = 1;
let end_value = 1;

let code_text = `print("Hello, World!")`;
let language = "py";
let filename = "main.py";

cnv.width = 1000;
cnv.height = (24.62 / 15.92) * cnv.width;

let fontSize = 15;
let maxLines = Math.floor(cnv.height / (fontSize * 1.5));

function getHighlights(code, lang) {
    sb.removeAttribute("data-highlighted");
    sb.className = `language-${lang}`;
    sb.innerHTML = code;
    hljs.highlightElement(sb);
}

function tokenise() {
    let tokens = [];
    function walk(node, inheritedStyle = {}) {
        if (node.nodeType === Node.TEXT_NODE) {
            tokens.push({
                text: node.textContent,
                style: inheritedStyle
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const computed = window.getComputedStyle(node);
            const style = {
                colour: computed.color,
                fontWeight: computed.fontWeight,
                fontStyle: computed.fontStyle,
                fontFamily: computed.fontFamily,
                fontSize: computed.fontSize
            };
            node.childNodes.forEach(child => walk(child, style));
        }
    }
    walk(sb);
    return tokens;
}

function draw(arr, title, start_line=1) {
    const ctx = cnv.getContext("2d");
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    let x = 5;
    let y = 3;
    let add_line_num = false;
    ctx.font = `italic ${fontSize}px monospace`;
    ctx.fillStyle = "grey";
    if (arr.length > 0) ctx.fillText(start_line + "", 0, y * fontSize * 1.5);
    ctx.font = `${fontSize}px monospace`;
    arr.forEach(({text, style}) => {
        ctx.fillStyle = style.colour;
        text.split("\n").forEach((line, i) => {
            if (add_line_num) {
                ctx.font = `italic ${fontSize}px monospace`;
                ctx.fillStyle = "grey";
                ctx.fillText(y - 3 + start_line, 0, y * fontSize * 1.5);
                ctx.font = `${fontSize}px monospace`
                ctx.fillStyle = style.colour;
                add_line_num = false;
            }
            if (i > 0) {
                x = 5;
                y++;
                if (y > maxLines) return;
                add_line_num = true;
            }
            if (y > maxLines) return;
            ctx.fillText(line, x * fontSize * 0.6, y * fontSize * 1.5);
            x += line.length;
        });
    });
    ctx.font = `${fontSize * 1.25}px monospace`;
    ctx.fillStyle = "black";
    ctx.fillText("/ " + title, fontSize * 4, fontSize * 1.75);
    img = new Image();
    img.src = "./icon.png";
    img.addEventListener("load", () => ctx.drawImage(img, 0, 0, fontSize * 3, fontSize * 3 / 536 * 462));
}

function preview() {
    let selected = code_text.split("\n").slice(start_value - 1, end_value).join("\n");
    getHighlights(selected, language);
    draw(tokenise(), filename, start_value);
}

function update_boxes() {
    let lines = code_text.split("\n").length;
    start_value = +start.value;
    end_value = +end.value;
    if (start_value < 1) start_value = 1;
    if (start_value > lines) start_value = lines;
    if (end_value < start_value) end_value = start_value;
    if (end_value > lines) end_value = lines;
    preview();
}

function download_next_page(num) {
    preview();
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = cnv.toDataURL("image/png");
    a.download = filename + " (" + num + ").png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    start_value += maxLines - 2;
    if (start_value <= end_value) setTimeout(() => download_next_page(num + 1), 100);
    else update_boxes();
}

document.getElementById("input-upload").addEventListener("input", () => {
    let file = [...document.getElementById("input-upload").files][0];
    if (file) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            let spl = file.name.split(".");
            language = spl[spl.length - 1];
            code_text = reader.result;
            filename = file.name;
            start.value = 1;
            end.value = code_text.split("\n").length;
            update_boxes();
            preview();
        }, false);
        reader.readAsText(file);
    }
});

document.getElementById("size-slider").addEventListener("input", () => {
    fontSize = +document.getElementById("size-slider").value;
    maxLines = Math.floor(cnv.height / (fontSize * 1.5));
    document.getElementById("size-value").innerHTML = fontSize;
    preview();
});

start.addEventListener("input", update_boxes);
end.addEventListener("input", update_boxes);

document.getElementById("download").addEventListener("click", () => download_next_page(1));

preview();
