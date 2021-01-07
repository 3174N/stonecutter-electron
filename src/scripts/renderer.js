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

    let project = findProject(filePaths[currentFile]);

    document.title = `${savedChar} ${currentFile} - ${project} - Stonecutter`;
}

// These variables are used to keep track of opened files
var filePaths = {};
var currentFile = '';

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
 * Used to open a folder.
 */
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
                        filePaths[file] = path.join(
                            response.filePaths[0],
                            file,
                        );

                        displayFile(file);
                    }
                });

                // ? What to display in the file?
                // ? Display at all when opening folder?
                // updateTitle();

                console.log('Folder opened.');
            } else {
                console.log('No folder selected.');
            }
        });
}

/**
 * Used to open a file from the explorer list to the file view.
 *
 * @param {String} [fileName] The file to open.
 */
function openFileFromList(fileName) {
    // Open file on <li> click
    currentFile = fileName;
    filePath = filePaths[currentFile];

    if (!fs.lstatSync(filePaths[currentFile]).isDirectory()) {
    updateTitle();
        fs.readFile(filePaths[currentFile], function (err, data) {
            if (err) return console.log(err);

            $('.file-content').text(data.toString());
        });
        isChanged = false;
        updateTitle();
    } else {
        if ($(`.${fileName}-folder`).css('display') == 'none')
            $(`.${fileName}-folder`).css('display', 'inline-block');
        else if ($(`.${fileName}-folder`).css('display') == 'inline-block')
            $(`.${fileName}-folder`).css('display', 'none');
    }
}

/**
 * Used to create an explorer list item for a file/folder
 *
 * @param {String} [fileName] The file/folder to display
 */
function displayFile(fileName, ulClass = '.files') {
    if (/^\..*/g.test(fileName)) {
        console.log(`Ignoring dotfile: ${fileName}`);
        return;
    }

    $(`${ulClass}`).append(
        '<li onClick="openFileFromList($(this).text());" id="$(this).text()">' +
            fileName +
            '</li>',
    );
    if (!fs.lstatSync(filePaths[fileName]).isDirectory()) {
        // * File is not a directory * //

        $(`#${fileName}`).addClass('file');
    } else {
        // * File is a directory * //

        $(`#${fileName}`).addClass('folder');

        if (!$(`.${fileName}-folder`).length) {
            $('.files').append(`<ul class=${fileName}-folder></ul>`);

            fs.readdir(filePaths[fileName], function (err, files) {
                if (err) return console.log(err);

                for (let file of files) {
                    filePaths[file] = path.join(filePaths[fileName], file);

                    displayFile(file, `.${fileName}-folder`);
                }
            });

            $(`.${fileName}-folder`).css('display', 'none');
        }
    }
}

var buffer;
var isChanged = false;

// Detect changes to current file
$('.file-content').bind('DOMSubtreeModified', () => {
    buffer = parseHTML($('.file-content').html()); // Save changes to buffer
    isChanged = true;
    updateTitle();
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
