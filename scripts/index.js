// Import modules
const $ = require('jquery');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { dialog } = require('electron').remote;

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

                    $('.files').append(
                        '<li>' + path.basename(filePath) + '</li>'
                    );

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
        fs.writeFile(filePath, $('.file-content').innerText(), function (err) {
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

                $('.files').append('<li>' + path.basename(filePath) + '</li>');

                fs.writeFile(
                    filePath,
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
