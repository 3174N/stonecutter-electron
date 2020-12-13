// Import modules
const $ = require('jquery');
const fs = require('fs');
const path = require('path');

const { dialog } = require('electron').remote;

// Used to get text with in-line breaks
function parseBrakes(value) {
	value = value.replace(/<div>/gi, '\n');
	value = value.replace(/<(.*?)>/g, '');

	return value;
}

var filePaths = {};
var currentFile = '';

// Open file
document
	.querySelector('#openfileBtn')
	.addEventListener('click', function (event) {
		dialog
			.showOpenDialog({
				title: 'Select a File to Open',
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

// Open folder
document
	.querySelector('#openfolderBtn')
	.addEventListener('click', function (event) {
		dialog
			.showOpenDialog({
				title: 'Select a Folder to Open',
				properties: ['openDirectory'],
			})
			.then(function (response) {
				if (!response.canceled) {
					fs.readdir(response.filePaths[0], function (err, files) {
						if (err) return console.log(err);

						for (let file of files) {
							console.log(file);
						}
					});
				} else {
					console.log('no folder selected');
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
			parseBrakes($('.file-content').html()),
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

				$('.files').append(
					'<li onclick="openFile($(this).text());">' +
						currentFile +
						'</li>'
				);

				fs.writeFile(
					filePaths[currentFile],
					parseBrakes($('.file-content').html()),
					function (err) {
						if (err) console.log(err);
					}
				);
			} else {
				console.log('no file selected');
			}
		});
}
