const { app, BrowserWindow, Menu, shell } = require('electron');
const url = require('url');
const path = require('path');
// const { openFile } = require('./testfile.js');

let win;

function createWindow() {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		icon: __dirname + 'src/styles/media/icon.ico',
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
		},
	});
	win.loadURL(
		url.format({
			pathname: path.join(__dirname, 'src/index.html'),
			protocol: 'file:',
			slashes: true,
		})
	);
	var menu = Menu.buildFromTemplate([
		{
			label: 'File',
			submenu: [
				{ label: 'New File', accelerator: 'CmdOrCtrl+N' },
				{ label: 'New Instance', accelerator: 'CmdOrCtrl+Shift+N' },
				{ type: 'separator' },
				{
					label: 'Open File',
					click() {
						// openFile();
					},
					accelerator: 'CmdOrCtrl+O',
				},
				{ label: 'Open Folder', accelerator: 'CmdOrCtrl+Shift+O' },
				// ? { label: 'Open Recent' },
				{ type: 'separator' },
				{
					label: 'Save',
					click() {
						// TODO: Save from index.js
					},
					accelerator: 'CmdOrCtrl+S',
				},
				{ label: 'Save As', accelerator: 'CmdOrCtrl+Shift+S' },
				{ type: 'separator' },
				{ label: 'Preferences', accelerator: 'CmdOrCtrl+,' }, // TODO: Add preferences (new window?)
				{ type: 'separator' },
				{ label: 'Close Tab', accelerator: 'CmdOrCtrl+W' },
				{
					label: 'Close Instance',
					role: 'close',
					accelerator: 'CmdOrCtrl+Shift+W',
				},
				{ type: 'separator' },
				{
					label: 'Exit',
					role: 'quit',
					accelerator: 'CmdOrCtrl+Q',
				},
			],
		},
		{
			label: 'Edit',
			submenu: [
				{ label: 'Undo', role: 'undo' },
				{ label: 'Redo', role: 'redo' },
				{ type: 'separator' },
				{ label: 'Cut', role: 'cut' },
				{ label: 'Copy', role: 'copy' },
				{ label: 'Paste', role: 'paste' },
			],
		},
		{
			label: 'Debug',
			submenu: [
				{
					label: 'Toggle Dev Tools',
					role: 'toggleDevTools',
				},
			],
		},
	]);
	Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);
