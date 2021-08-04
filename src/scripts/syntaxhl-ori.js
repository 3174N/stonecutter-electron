

console.log("syntaxhl works");

let txtbox = $("div.file-content");
//const commands = require("./linter/commandshl.json");



function textUpdate(e) {
    if (e.code != "Space") {
        return;
    }

    let range, start, end;
    if (typeof window.getSelection != "undefined") {
        range = window.getSelection().getRangeAt(0).cloneRange();
        start = range.startOffset;
        end = range.endOffset;
        console.log(start, end);
    }

    let words = txtbox.text().split(" ");
    let html = "";
    for (let i = 0; i < words.length; i++) {
        if (["execute", "kill"].indexOf(words[i]) != -1) {
            html += "<mark>" + words[i] + "</mark> ";
        }
        else if (words[i] != "") {
            html += words[i] + " ";
        }
    }
    
    txtbox.html(html);

    if (typeof window.getSelection != undefined) {
        range = window.getSelection().getRangeAt(0);
        range.setStart(range.startContainer.lastChild, range.endContainer.lastChild.length);
        range.setEnd(range.endContainer.lastChild, range.endContainer.lastChild.length);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        console.log(range);
    }
}

document.addEventListener("keyup", textUpdate);