$ = require('jquery');
const remote = require('electron').remote;
const { BrowserWindow } = remote;
const url = require('url');

let win;

function openPopup() {
    win = new BrowserWindow({
        width: 500,
        height: 350,
        icon: path.join(__dirname, 'styles/media/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
    });
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, '/pages/popup.html'),
            protocol: 'file:',
            slashes: true,
        })
    );
    // * Comment next line for dev-tools access * //
    win.removeMenu();
    win.setResizable(false);
}

function closePopup() {
    remote.getCurrentWindow().close();
}

$('#create-project-form').on('submit', function (e) {
    // Stops form from refreshing
    e.preventDefault();

    // Get all inputs
    var inputs = $('#create-project-form :input');

    var values = {};
    inputs.each(function () {
        values[this.name] = $(this).val();
    });

    // TODO: Write info in project.cutter

    remote.getCurrentWindow().close();
});

document.querySelector('#closeBtn').addEventListener('click', function (event) {
    closePopup();
});
