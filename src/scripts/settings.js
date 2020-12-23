var fs = require('fs');
var path = require('path');

function initSettings() {
    switch (process.platform) {
        case 'linux':
        case 'darwin':
            var settingsFolder = path.join(
                process.env.HOME,
                '.config/stonecutter',
            );
            break;
        case 'win32':
            var settingsFolder = path.join(
                process.env.HOME,
                'AppData\\Roaming\\stonecutter',
            );
            break;
    }

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
