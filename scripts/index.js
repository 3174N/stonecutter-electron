// Import modules
const $ = require('jquery');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { dialog } = require('electron').remote;

var filePath = '';

// Open files
document
    .querySelector('#openfileBtn')
    .addEventListener('click', function (event) {
        dialog
            .showOpenDialog({
                title: 'Select a File to Open',
                filters: [
                    {
                        name: 'MC Function',
                        extensions: ['mcfunction'],
                    },
                    {
                        name: 'JSON',
                        extensions: ['json'],
                    },
                    {
                        name: 'Text Files',
                        extensions: ['txt', 'md'],
                    },
                ],
                properties: ['openFile'],
            })
            .then(function (response) {
                if (!response.canceled) {
                    filePath = response.filePaths[0];

                    fs.readFile(filePath, function (err, data) {
                        if (err) return console.log(err);

                        $('.file-content').text(data.toString());
                    });
                } else {
                    console.log('no file selected');
                }
            });
    });

// Save files
function saveFile() {
    if (filePath != '') {
        fs.writeFile(filePath, $('.file-content').text(), function (err) {
            if (err) return console.log(err);
        });
    } else {
        saveFileAs();
    }
}

function saveFileAs() {
    // Save as
    dialog
        .showSaveDialog({
            title: 'Select the File Path to save',
            buttonLabel: 'Save',
            filters: [
                {
                    name: 'MC Function',
                    extensions: ['mcfunction'],
                },
                {
                    name: 'JSON',
                    extensions: ['json'],
                },
                {
                    name: 'Text Files',
                    extensions: ['txt', 'md'],
                },
            ],
            properties: [],
        })
        .then(function (response) {
            if (!response.canceled) {
                filePath = response.filePath.toString();

                fs.writeFile(
                    response.filePath.toString(),
                    $('.file-content').text(),
                    function (err) {
                        if (err) console.log(err);
                    }
                );
            } else {
                console.log('no file selected');
            }
        });
}
