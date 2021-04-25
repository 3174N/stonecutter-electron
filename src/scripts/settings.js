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

    if (!fs.existsSync(path.join(settingsFolder, 'defaults.cutter'))) {
        console.log('File defaults.cutter not found. Creating...');
        fs.copyFile(
            './src/defaults.cutter',
            path.join(settingsFolder, 'defaults.cutter'),
            (err) => {
                return console.log(err);
            }
        );
    }

    // ? Only run this on install?
    if (
        !fs.existsSync(path.join(settingsFolder, 'colorschemes/default.less'))
    ) {
        console.log('Default colorscheme not found. Creating...');
        if (!fs.existsSync(path.join(settingsFolder, 'colorschemes'))) {
            fs.mkdirSync(path.join(settingsFolder, 'colorschemes'));
        }
        fs.copyFile(
            './src/styles/colorschemes/default.less',
            path.join(settingsFolder, 'colorschemes/default.less'),
            (err) => {
                return console.log(err);
            }
        );
    }
}

initSettings();

/**
 * Load settings from object into CSS
 *
 * @param {Object} [file] - Either defaults or settings
 */
function loadToCSS(file) {
    $('.file-content').css({
        'font-family': file.font.family,
        'font-style': file.font.style,
        'font-weight': file.font.weight,
        'font-size': file.font.size,
        'font-variant-ligatures': file.font.ligatures,
    });

    $('<link/>', {
        rel: 'stylesheet/less',
        type: 'text/css',
        href: path.join(
            settingsFolder,
            `colorschemes/${file.colorscheme}.less`
        ),
    }).appendTo('head');
}

/**
 * Load settings from defailts.cutter into object 'settings',
 * then from settings.cutter.
 */
try {
    const defaults = yaml.load(
        fs.readFileSync(path.join(settingsFolder, 'defaults.cutter'), 'utf8')
    );
    console.log('Loaded default settings.');

    const settings = yaml.load(
        fs.readFileSync(path.join(settingsFolder, 'settings.cutter'), 'utf8')
    );
    console.log('Loaded settings.');

    loadToCSS(defaults);
    loadToCSS(settings);
    console.log('Applied settings.');
} catch (err) {
    // TODO: If defaults not found, freak out, scream and crash
    throw err;
}
