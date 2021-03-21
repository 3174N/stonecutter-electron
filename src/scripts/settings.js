/**
 * Create a config file, settings.cutter,
 * in the OS's respective configuration directory
 * if one does not already exist.
 */

switch (process.platform) {
    case 'linux':
    case 'darwin':
        var settingsFolder = path.join(process.env.HOME, '.config/stonecutter');
        break;
    case 'win32':
        var settingsFolder = path.join(
            process.env.HOME,
            'AppData\\Roaming\\stonecutter'
        );
        break;
}

function initSettings() {
    switch (process.platform) {
        case 'linux':
        case 'darwin':
            var settingsFolder = path.join(
                process.env.HOME,
                '.config/stonecutter'
            );
            break;
        case 'win32':
            var settingsFolder = path.join(
                process.env.HOME,
                'AppData\\Roaming\\stonecutter'
            );
            break;
    }

    if (!fs.existsSync(path.join(settingsFolder, 'settings.cutter'))) {
        console.log('File settings.cutter not found. Creating...');
        if (!fs.existsSync(settingsFolder)) {
            fs.mkdirSync(settingsFolder);
        }
        fs.copyFile(
            './src/settings.cutter',
            path.join(settingsFolder, 'settings.cutter'),
            (err) => {
                return console.log(err);
            }
        );
    }
}

initSettings();

/**
 * Load settings from settings.cutter
 * into object 'settings'.
 */
try {
    const settings = yaml.load(
        fs.readFileSync(path.join(settingsFolder, 'settings.cutter'), 'utf8')
    );
    console.log('Loaded settings.');
    // Apply CSS
    $('.file-content').css({
        'font-family': settings.font.family,
        'font-style': settings.font.style,
        'font-weight': settings.font.weight,
        'font-size': settings.font.size,
        'font-variant-ligatures': settings.font.ligatures,
    });
    console.log('Applied settings.');
} catch (err) {
    throw err;
}
