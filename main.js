const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
// ! Does not work, document is undefined
//// const { foo } = require('./src/scripts/index.js');
const ipc = require('electron').ipcMain;
const { PerformanceObserver, performance } = require('perf_hooks');

const isMac = process.platform === 'darwin'; // Checks if running on macOS

/*
    Disable the app opening and closing rapidly
    when installing to Windows.
*/
if (require('electron-squirrel-startup')) {
    app.quit();
}

let win;

function createWindow() {
    /* 
        This part of the function handles the menu items
        in the menubar at the top of the window.
        macOS' guidelines are different from Windows',
        so the menu will change depending on OS.
        (Linux behaves like Windows) 
    */
    var menu = Menu.buildFromTemplate([
        ...(isMac
            ? [
                  {
                      label: app.name,
                      submenu: [
                          { label: 'About Stonecutter', role: 'about' },
                          { type: 'separator' },
                          {
                              label: 'Preferences...',
                              accelerator: 'CmdOrCtrl+,',
                          }, // TODO: Add preferences (new window?)
                          { role: 'services' },
                          { type: 'separator' },
                          { label: 'Hide Stonecutter', role: 'hide' },
                          { role: 'hideothers' },
                          { role: 'unhide' },
                          { type: 'separator' },
                          { label: 'Quit Stonecutter', role: 'quit' },
                      ],
                  },
              ]
            : []),
        ...(isMac
            ? [
                  {
                      label: 'File',
                      submenu: [
                          { label: 'New', accelerator: 'CmdOrCtrl+N' },
                          {
                              label: 'New Project...',
                              click() {
                                  win.webContents.send('open-popup');
                              },
                              accelerator: 'CmdOrCtrl+P',
                          },
                          {
                              label: 'New Window',
                              accelerator: 'CmdOrCtrl+Shift+N',
                          },
                          { type: 'separator' },
                          {
                              label: 'Open...',
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
                          { label: 'Close Tab', accelerator: 'CmdOrCtrl+W' },
                          {
                              label: 'Close Window',
                              role: 'close',
                              accelerator: 'CmdOrCtrl+Shift+W',
                          },
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
                      ],
                  },
              ]
            : [
                  {
                      label: 'File',
                      submenu: [
                          { label: 'New File', accelerator: 'CmdOrCtrl+N' },
                          {
                              label: 'New Project...',
                              click() {
                                  win.webContents.send('open-popup');
                              },
                              accelerator: 'CmdOrCtrl+P',
                          },
                          {
                              label: 'New Instance',
                              accelerator: 'CmdOrCtrl+Shift+N',
                          },
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
                          {
                              label: 'Preferences...',
                              accelerator: 'CmdOrCtrl+,',
                          }, // TODO: Add preferences (new window?) (if not new window then remove ellipsis)
                          { type: 'separator' },
                          { label: 'Close Tab', accelerator: 'CmdOrCtrl+W' },
                          {
                              label: 'Close Instance',
                              role: 'close',
                              accelerator: 'CmdOrCtrl+Shift+W',
                          },
                          { type: 'separator' },
                          { role: 'quit' },
                      ],
                  },
              ]),
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

    /* 
        This section contains window info,
        such as size, icon and permissions
        to interact with the code.
    */
    win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'src/styles/media/icon.ico'), // Icon path relative to root
        webPreferences: {
            nodeIntegration: true, // Enables use of node modules
            enableRemoteModule: true, // Enables showing system dialogs
        },
    });

    // Loads index.html
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, 'src/index.html'),
            protocol: 'file:',
            slashes: true,
        })
    );
}

/*
    macOS apps don't quit on close;
    they simply become windowless.
*/
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

console.log('Launching Stonecutter...');
var t0 = performance.now();
app.on('ready', createWindow);
var t1 = performance.now();
console.log('Stonecutter successfully launched (' + (t1 - t0) + 'ms)'); // Prints difference between times, i.e. time to launch
