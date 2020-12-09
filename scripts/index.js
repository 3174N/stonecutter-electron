const fs = require('fs');
const $ = require('jquery');

const { dialog } = require('electron').remote;

document
    .querySelector('#openfileBtn')
    .addEventListener('click', function (event) {
        dialog
            .showOpenDialog({ properties: ['openFile'] })
            .then(function (response) {
                if (!response.canceled) {
                    console.log('file: ' + response.filePaths[0]);
                    fs.readFile(response.filePaths[0], function (err, data) {
                        if (err) return console.log(err);

                        $('.file-content').text('');

                        const lines = data.toString().split('\n');

                        for (let i = 0; i < lines.length; i++) {
                            $('.file-content').append(lines[i] + '<br>');
                            console.log(lines[i]);
                        }
                    });
                } else {
                    console.log('no file selected');
                }
            });
    });
