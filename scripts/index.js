// Import modules
const $ = require('jquery');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { dialog } = require('electron').remote;

// Used to get text with in-line breaks
(function ($) {
    $.fn.innerText = function (msg) {
        if (msg) {
            if (document.body.innerText) {
                for (var i in this) {
                    this[i].innerText = msg;
                }
            } else {
                for (var i in this) {
                    this[i].innerHTML
                        .replace(/&amp;lt;br&amp;gt;/gi, 'n')
                        .replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, '');
                }
            }
            return this;
        } else {
            if (document.body.innerText) {
                return this[0].innerText;
            } else {
                return this[0].innerHTML
                    .replace(/&amp;lt;br&amp;gt;/gi, 'n')
                    .replace(/(&amp;lt;([^&amp;gt;]+)&amp;gt;)/gi, '');
            }
        }
    };
})($);

var filePaths = {};
var currentFile = '';

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
                    currentFile = path.basename(response.filePaths[0]);
                    filePaths[currentFile] = response.filePaths[0];

                    $('.files').append(
                        '<li onclick="openFile($(this).text());">' +
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
    });

function openFile(fileName) {
    // Open file on <li> click

    currentFile = fileName;
    filePath = filePaths[currentFile];

    fs.readFile(filePaths[currentFile], function (err, data) {
        if (err) return console.log(err);

        $('.file-content').text(data.toString());
    });
}

// Save files
function saveFile() {
    if (currentFile != '') {
        fs.writeFile(
            filePaths[currentFile],
            $('.file-content').innerText(),
            function (err) {
                if (err) return console.log(err);
            }
        );
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
                currentFile = path.basename(response.filePath.toString());
                filePaths[currentFile] = response.filePath.toString();

                $('.files').append(
                    '<li onclick="openFile($(this).text());">' +
                        currentFile +
                        '</li>'
                );

                fs.writeFile(
                    filePaths[currentFile],
                    $('.file-content').innerText(),
                    function (err) {
                        if (err) console.log(err);
                    }
                );
            } else {
                console.log('no file selected');
            }
        });
}
