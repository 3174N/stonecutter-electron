/**
 * Used to parse HTML to plain text.
 * (i.e. convert HTML entities to ASCII characters.)
 *
 * @param {String} [value] Value to be parsed.
 */
function parseHTML(value) {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g,
        translate = {
            nbsp: String.fromCharCode(160),
            amp: '&',
            quot: '"',
            lt: '<',
            gt: '>',
        },
        translator = function ($0, $1) {
            return translate[$1];
        };
    value = value.replace(/<div>/gi, '\n');
    value = value.replace(/<(.*?)>/g, '');

    value = value.replace(translate_re, translator);

    return value;
}

/**
 * Used to update window title.
 */
function updateTitle() {
    let savedChar = isChanged ? '●' : '';

    let projectName;
    if (currentFile != '') {
        projectName = path.basename(findProject(filePaths[currentFile]));
    } else {
        projectName = 'Untitled Project';
    }

    document.title = `${savedChar} ${currentFile} - ${projectName} - Stonecutter`;
}

// These variables are used to keep track of opened files and tabs
var filePaths = {};
var currentFile = '';
var openTabs = [];

// Open file
document
    .querySelector('#openfileBtn')
    .addEventListener('click', function (event) {
        openFile();
    });

// Open folder
document
    .querySelector('#openfolderBtn')
    .addEventListener('click', function (event) {
        openFolder();
    });

/**
 * Used to open a file.
 */
function openFile() {
    dialog
        .showOpenDialog({
            title: 'Open File',
            filters: [
                {
                    name: 'Minecraft Function',
                    extensions: ['mcfunction'],
                },
                {
                    name: 'JavaScript Object Notation',
                    extensions: ['json', 'mcmeta'],
                },
                {
                    name: 'Text',
                    extensions: ['txt', 'md', 'markdown'],
                },
            ],
            properties: ['openFile'],
        })
        .then(function (response) {
            if (!response.canceled) {
                currentFile = path.basename(response.filePaths[0]);
                filePaths[currentFile] = response.filePaths[0];

                isChanged = false;
                updateTitle();

                let project = findProject(filePaths[currentFile]);
                if (project === 'Untitled Project') {
                    showTree(path.resolve(filePaths[currentFile], '..'));
                } else {
                    showTree(project); // TODO: Cascade folders from project root to file
                }
                displayFile(currentFile);

                fs.readFile(filePaths[currentFile], function (err, data) {
                    if (err) return console.log(err);

                    $('.file-content').text(data.toString());
                });
                console.log('File opened.');
            } else {
                console.log('No file selected.');
            }
        });
}

/**
 * Used for the 'Choose Folder' GUI.
 */
function openFolder() {
    dialog
        .showOpenDialog({
            title: 'Open Folder',
            properties: ['openDirectory'],
        })
        .then(function (response) {
            if (!response.canceled) {
                showTree(response.filePaths[0]);
                console.log('Folder opened.');
            } else {
                console.log('No folder selected.');
            }
        });
}

/**
 * Used to set the correct file tree.
 */
function showTree(chosenFolder) {
    fs.readdir(chosenFolder, function (err, files) {
        if (err) return console.log(err);

        for (let file of files) {
            filePaths[file] = path.join(chosenFolder, file);

            displayFile(file);
        }
    });
    // ? What to display in the file?
    // ? Display at all when opening folder?
    // updateTitle();
}

/**
 * Used to open a file from the explorer list to the file view.
 *
 * @param {String} [fileName] The file to open.
 */
function openFileFromList(fileName) {
    fileName = fileName.replace(' ', ''); // Removes '' from string

    // Open file on <li> click
    currentFile = fileName;
    filePath = filePaths[currentFile];

    if (!fs.lstatSync(filePaths[currentFile]).isDirectory()) {
        // * File is not a directory * //
        updateTitle();
        fs.readFile(filePaths[currentFile], function (err, data) {
            if (err) return console.log(err);

            $('.file-content').text(data.toString());
        });
        isChanged = false;
        updateTitle();

        if (!openTabs.includes(currentFile)) {
            // Add file tab
            $('.tabs').append(
                `<div class="tab-div" id="${currentFile}-tab">
                     <button class="tab-btn" onClick="openFileFromTab($(this).text());">${currentFile}</button>
                     <button class="close-tab-btn" onClick="closeTab('${currentFile}');">x</button>
                 </div>`
            );
            openTabs.push(currentFile);
        }
    } else {
        // * File is a directory * //

        // Check if filetree is showing or not
        if ($(`.${fileName}-folder`).css('display') == 'none') {
            // Replace image
            $(`.${fileName}-dir-img`).attr(
                'src',
                './styles/media/dir_open.png'
            );
            $(`.${fileName}-folder`).css('display', 'inline-block'); // Show sub-files
        } else if ($(`.${fileName}-folder`).css('display') == 'inline-block') {
            // Replace image
            $(`.${fileName}-dir-img`).attr(
                'src',
                './styles/media/dir_closed.png'
            );
            $(`.${fileName}-folder`).css('display', 'none'); // Hide sub-files
        }
    }
}

/**
 * Used to open a file from a tab to the file view.
 *
 * @param {String} [fileName] The file to open.
 */
function openFileFromTab(fileName) {
    currentFile = fileName;
    filePath = filePaths[currentFile];

    updateTitle();

    fs.readFile(filePaths[currentFile], function (err, data) {
        if (err) return console.log(err);

        $('.file-content').text(data.toString());
    });

    isChanged = false;
    updateTitle();
}

/**
 * Used to remove element from DOM.
 */
Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

/**
 * Used to close a tab.
 *
 * @param {String} [tabName] The tab to close.
 */
function closeTab(tabName) {
    document.getElementById(`${tabName}-tab`).remove();

    let index = openTabs.indexOf(tabName);

    if (index != 0) {
        openFileFromTab(openTabs[index - 1]);
    } else if (index != openTabs.length) {
        openFileFromTab(openTabs[index + 1]);
    } else {
        //closeCurrentFile() // TODO: Implement buffer closing
    }

    openTabs.splice(index, 1);
}

/**
 * Used to close the current tab.
 */
function closeCurrentTab() {
    closeTab(currentFile);
}

/**
 * Used to create an explorer list item for a file/folder
 *
 * @param {String} [fileName] The file/folder to display
 * @param {String} [ulClass] Class to which write file (default = '.files').
 */
function displayFile(fileName, ulClass = '.files') {
    if (/^\..*/g.test(fileName)) {
        console.log(`Ignoring dotfile: ${fileName}`);
        return;
    }

    if (!fs.lstatSync(filePaths[fileName]).isDirectory()) {
        // * File is not a directory * //

        $(`${ulClass}`).append(
            `<li onClick="openFileFromList($(this).text());" id="${fileName}" class="file">` +
                fileName +
                '</li>'
        );
    } else {
        // * File is a directory * //

        $(`${ulClass}`).append(
            `<li onClick="openFileFromList($(this).text());" id="${fileName}" class="folder">` +
                `<img src="./styles/media/dir_closed.png" class="dir-img ${fileName}-dir-img"> ` +
                fileName +
                '</li>'
        );

        if (!$(`.${fileName}-folder`).length) {
            // Generate filetree
            $(`${ulClass}`).append(`<ul class=${fileName}-folder></ul>`);

            fs.readdir(filePaths[fileName], function (err, files) {
                if (err) return console.log(err);

                // Put files in filetree
                for (let file of files) {
                    filePaths[file] = path.join(filePaths[fileName], file);

                    displayFile(file, `.${fileName}-folder`);
                }
            });

            // Hide filetree
            $(`.${fileName}-folder`).css('display', 'none');
        }
    }
}

/**
 * Used to get number of lines in .file-content.
 *
 * @returns Number of lines.
 */
function countLines() {
    var el = document.getElementById('file-content');

    // Get total height of the content
    var divHeight = el.offsetHeight;

    // Get line height
    var lineHeight = parseInt($('#file-content').css('line-height'));

    // Get lines
    var lines = divHeight / lineHeight;
    return lines;
}

/**
 * Used to update the gutter with the correct line numbers.
 */
function updateGutter() {
    lines = countLines();

    // Reset gutter
    $('.gutter').text('');

    for (var i = 1; i <= lines; i++) {
        $('.gutter').append(`${i}\n`);
    }
}

var buffer;
var isChanged = false;
var shouldUpdate = true;

// Detect changes to current file
$('.file-content').bind('DOMSubtreeModified', () => {
    buffer = parseHTML($('.file-content').html()); // Save changes to buffer
    isChanged = true;

    updateTitle();
    updateHighlight();
    updateGutter();
});

/**
 * Used to save current file.
 */
function saveFile() {
    // Check if file exists
    if (currentFile != '') {
        // Save buffer content to current file
        fs.writeFile(filePaths[currentFile], buffer, function (err) {
            if (err) return console.log(err);
        });
        console.log('File saved.');
    } else {
        // File does not exist
        saveFileAs();
    }
    isChanged = false;
    updateTitle();
}

/**
 * Used to save-as current file.
 */
function saveFileAs() {
    dialog
        .showSaveDialog({
            title: 'Save As',
            buttonLabel: 'Save',
            filters: [
                {
                    name: 'Minecraft Function',
                    extensions: ['mcfunction'],
                },
                {
                    name: 'JavaScript Object Notation',
                    extensions: ['json'],
                },
                {
                    name: 'Minecraft Metafile',
                    extensions: ['mcmeta'],
                },
                {
                    name: 'Plain Text',
                    extensions: ['txt'],
                },
                {
                    name: 'Markdown',
                    extensions: ['md'],
                },
            ],
            properties: [],
        })
        .then(function (response) {
            if (!response.canceled) {
                currentFile = path.basename(response.filePath.toString());
                filePaths[currentFile] = response.filePath.toString();

                updateTitle();

                displayFile(file);

                fs.writeFile(filePaths[currentFile], buffer, function (err) {
                    if (err) console.log(err);
                });
                console.log('File saved.');
            } else {
                console.log('No file selected.');
            }
        });
    updateTitle();
}

function updateHighlight() {
    console.log(shouldUpdate);

    if (shouldUpdate) {
        extension = currentFile.split('.')[1];

        let caretPos = $('#file-content').caret();

        if (extension == 'md') highlight('markdown');
        else if (extension == 'json' || extension == 'mcmeta')
            highlight('json'); // TODO: add mcfunction

        $('#file-content').caret(caretPos);

        shouldUpdate = false;
    } else {
        shouldUpdate = true;
    }
}

// Menu Actions

// The renderer gets ipc calls from main, and executes the corresponding function.
ipc.on('open-file', (event) => {
    openFile();
});

ipc.on('open-folder', (event) => {
    openFolder();
});

ipc.on('save', (event) => {
    saveFile();
});

ipc.on('save-as', (event) => {
    saveFileAs();
});

ipc.on('open-popup', (event) => {
    openPopup();
});

ipc.on('close-tab', (event) => {
    closeCurrentTab();
});
