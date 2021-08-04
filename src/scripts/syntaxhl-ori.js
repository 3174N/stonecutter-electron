

let txtbox = document.getElementsByClassName("file-content");
const commands = require("./linter/commandshl.json");

alert("syntaxhl works");

function textUpdate(e) {
    if (e.code != "Space") {
        alert("hi");
        return;
    }
    alert('come on!')
    for (word in txtbox.innerHTML.split(" ")) {
        alert("typed that word " + word);
        let index = txtbox.indexOf(word);
        if (word in commands.commands) {
            print("Hello!");
            txtbox.innerHTML = txtbox.slice(0, index).join() + '<mark>' + txtbox.slice(index, index + word.length) + '</mark>' + txtbox.slice(index + word.length).join();
        }
    }
}

document.addEventListener("keypress", textUpdate);