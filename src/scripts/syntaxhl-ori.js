

console.log("syntaxhl works");

let txtbox = $("div.file-content");
//const commands = require("./linter/commandshl.json");



function textUpdate(e) {
    if (e.code != "Space") {
        return;
    }
    // saving the start and end point of the selection before messing it up
    let range, start, end;
    if (typeof window.getSelection != "undefined") {
        range = window.getSelection().getRangeAt(0).cloneRange();
        start = range.startOffset;
        end = range.endOffset;
        console.log(start, end);
    }
    
    // messing it up and marking the text need to be marked
    let words = txtbox.text().split(" ");
    let html = "";
    for (let i = 0; i < words.length; i++) {
        if (["execute", "kill"].indexOf(words[i]) != -1) { // change the list here to the list of the commands
            html += "<mark>" + words[i] + "</mark> "; // change the <mark> tags to change the style and stuff
        }
        else if (words[i] != "") {
            html += words[i] + " ";
        }
    }
    // update html
    txtbox.html(html);
    
    // unmessing the selection
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