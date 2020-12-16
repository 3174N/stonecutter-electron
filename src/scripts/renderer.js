// Import modules
const $ = require('jquery');
const fs = require('fs');
const path = require('path');
const { dialog } = require('electron').remote;
const ipc = require('electron').ipcRenderer;

// Used to get text with in-line breaks
function parseBreaks(value) {
    value = value.replace(/<div>/gi, '\n');
    value = value.replace(/<(.*?)>/g, '');

    return value;
}

function updateTitle() {
    document.title = `<saveStatus> ${currentFile} - <currentProject> - Stonecutter`;
}

var filePaths = {};
var currentFile = '';

// TODO: Add open file to context menu & keyboard shortcuts
// Open file
// Ctrl + O
document
    .querySelector('#openfileBtn')
    .addEventListener('click', function (event) {
        openFile();
    });

document
    .querySelector('#openfolderBtn')
    .addEventListener('click', function (event) {
        openFolder();
    });

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
                // TODO: Add file name & project name to title bar (like vscode)
                currentFile = path.basename(response.filePaths[0]);
                filePaths[currentFile] = response.filePaths[0];

                updateTitle();

                $('.files').append(
                    '<li onClick="openFileFromList($(this).text());">' +
                        currentFile +
                        '</li>'
                );

                fs.readFile(filePaths[currentFile], function (err, data) {
                    if (err) return console.log(err);

                    $('.file-content').text(data.toString());
                });
            } else {
                console.log('no file selected');
            }
        });
}

// Open folder
function openFolder() {
    dialog
        .showOpenDialog({
            title: 'Open Folder',
            properties: ['openDirectory'],
        })
        .then(function (response) {
            if (!response.canceled) {
                fs.readdir(response.filePaths[0], function (err, files) {
                    if (err) return console.log(err);

                    for (let file of files) {
                        filePaths[file] = response.filePaths[0] + '/' + file;

                        if (fs.lstatSync(filePaths[file]).isDirectory()) {
                            // Path leads to a directory
                            // TODO: Build file tree
                            console.log(file + ' : Folder');
                        } else {
                            // Path leads to a file
                            console.log(file);
                        }

                        $('.files').append(
                            '<li onClick="openFileFromList($(this).text());">' +
                                file +
                                '</li>'
                        );
                    }
                });
            } else {
                console.log('no folder selected');
            }
        });
}

function openFileFromList(fileName) {
    // Open file on <li> click
    currentFile = fileName;
    filePath = filePaths[currentFile];
    updateTitle();

    if (fs.lstatSync(filePaths[currentFile]).isDirectory()) {
        fs.readFile(filePaths[currentFile], function (err, data) {
            if (err) return console.log(err);

            $('.file-content').text(data.toString());
        });
    } else {
        // TODO: Show / Hide file tree
    }
}

// Save files
// TODO: Add save & save as to context menu & keyboard shortcuts
// TODO: Detect unsaved file and update saveStatus
function saveFile() {
    // Ctrl + S
    if (currentFile != '') {
        fs.writeFile(
            filePaths[currentFile],
            parseBreaks($('.file-content').html()),
            function (err) {
                if (err) return console.log(err);
            }
        );
    } else {
        saveFileAs();
    }
    updateTitle();
}

function saveFileAs() {
    // Save as
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

                $('.files').append(
                    '<li onClick="openFileFromList($(this).text());">' +
                        currentFile +
                        '</li>'
                );

                fs.writeFile(
                    filePaths[currentFile],
                    parseBreaks($('.file-content').html()),
                    function (err) {
                        if (err) console.log(err);
                    }
                );
            } else {
                console.log('no file selected');
            }
        });
    updateTitle();
}

ipc.on('open-file', function (event) {
    openFile();
});

ipc.on('open-folder', function (event) {
    openFolder();
});

ipc.on('save', function (event) {
    saveFile();
});

ipc.on('save-as', function (event) {
    saveFileAs();
});
