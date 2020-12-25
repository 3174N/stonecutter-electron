const { app, BrowserWindow, Menu } = require('electron');
const url = require('url');
const path = require('path');
// ! Does not work, document is undefined
//// const { foo } = require('./src/scripts/index.js');
const ipc = require('electron').ipcMain;
const { PerformanceObserver, performance } = require('perf_hooks');

let win;

function createWindow() {
    var menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                { label: 'New File', accelerator: 'CmdOrCtrl+N' },
                { label: 'New Instance', accelerator: 'CmdOrCtrl+Shift+N' },
                { type: 'separator' },
                {
                    label: 'Open File...',
                    click() {
                        win.webContents.send('open-file');
                    },
                    accelerator: 'CmdOrCtrl+O',
                },
                {
                    label: 'Open Folder...',
                    click() {
                        win.webContents.send('open-folder');
                    },
                    accelerator: 'CmdOrCtrl+Shift+O',
                },
                // ? { label: 'Open Recent' },
                { type: 'separator' },
                {
                    label: 'Save',
                    click() {
                        win.webContents.send('save');
                    },
                    accelerator: 'CmdOrCtrl+S',
                },
                {
                    label: 'Save As...',
                    click() {
                        win.webContents.send('save-as');
                    },
                    accelerator: 'CmdOrCtrl+Shift+S',
                },
                { type: 'separator' },
                { label: 'Preferences...', accelerator: 'CmdOrCtrl+,' }, // TODO: Add preferences (new window?) (if not new window then remove ellipsis)
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
            label: 'View',
            submenu: [
                { label: 'Actual Size', role: 'resetZoom' },
                {
                    label: 'Zoom In',
                    role: 'zoomIn',
                    accelerator: 'CmdOrCtrl+=',
                },
                { label: 'Zoom Out', role: 'zoomOut' },
                { type: 'separator' },
                { label: 'Toggle Fullscreen', role: 'togglefullscreen' },
                { label: 'Toggle Dev Tools', role: 'toggleDevTools' },
            ],
        },
    ]);
    Menu.setApplicationMenu(menu);
    win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Stonecutter',
        icon: path.join(__dirname, 'src/styles/media/icon.ico'),
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
        }),
    );
}

console.log('Launching Stonecutter...');
var t0 = performance.now();
app.on('ready', createWindow);
var t1 = performance.now();
console.log('Stonecutter succesfully launched (' + (t1 - t0) + 'ms)');
