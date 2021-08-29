let txtbox = $("div.file-content");

function textUpdate(e) {
    if (e.code != "Space") {
        return;
    }
    // saving the start
    let range, start;
    if (typeof window.getSelection != "undefined") {
        range = window.getSelection().getRangeAt(0).cloneRange();
        start = range.startOffset;
        
        for (let i = 0; txtbox[0].childNodes[i] != range.startContainer; i++) {
            start += txtbox[0].childNodes[i].textContent.length;
        }
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

        if (txtbox[0].childNodes.length <= 1) {
            range.setStart(txtbox[0].childNodes[0], start);
            range.setEnd(txtbox[0].childNodes[0], start);
        }
        else {
            let sum = 0, i = -1;
            while (sum < start) {
                i++;
                sum += txtbox[0].childNodes[i].textContent.length;
            }
            sum -= txtbox[0].childNodes[i].textContent.length;

            range.setStart(txtbox[0].childNodes[i], start - sum);
            range.setEnd(txtbox[0].childNodes[i], start - sum);
        }
        
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        
    }
}

document.addEventListener("keyup", textUpdate);