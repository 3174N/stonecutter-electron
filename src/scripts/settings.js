var fs = require('fs');
var path = require('path');

function initSettings() {
    // TODO: OS-dependent file location
    var settingsFolder = path.join(process.env.HOME, '.config/stonecutter');

    if (!fs.existsSync(path.join(settingsFolder, 'settings.cutter'))) {
        console.log('File settings.cutter not found. Creating...');
        if (!fs.existsSync(settingsFolder)) {
            fs.mkdirSync(settingsFolder);
        }
        fs.writeFile(
            path.join(settingsFolder, 'settings.cutter'),
            '', // TODO: Pull file content from src
            (err) => {},
        );
    }
}

initSettings();
