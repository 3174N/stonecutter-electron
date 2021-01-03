/*
    This file doesn't have require statements,
    as those are handled by main.js
    unless only one specific file uses them.
*/

let win;

function openPopup() {
    /* 
        This section contains window info,
        such as size, icon and permissions
        to interact with the code.
    */
    win = new BrowserWindow({
        width: 500,
        height: 350,
        icon: path.join(__dirname, 'styles/media/icon.ico'), // Icon path relative to file
        webPreferences: {
            nodeIntegration: true, // Enables use of node modules
            enableRemoteModule: true, // Enables showing system dialogs
        },
    });

    // Loads popup.html
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, '/pages/popup.html'),
            protocol: 'file:',
            slashes: true,
        }),
    );

    // Comment next line for dev-tools access
    // win.removeMenu();
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
        values[this.name] = `"${$(this).val()}"`; // FIXME: Project name should have a regex of /^[a-z\d-_\.]+$/g
    });

    /*
        This part of the function creates a folder structure,
        and fills it with files that Minecraft and Stonecutter
        need in order to recognize it as a project.
    */

    var projPath = path.join(
        values['directory'].replace(/["]+/g, ''),
        `${values['name'].replace(/["]+/g, '')}`,
    );

    // Creates project folder if doesn't already exist
    if (fs.existsSync(projPath)) {
        console.log('Project already exists.');
        alert('Project already exists at specified location.'); // TODO: fancy errors
    } else {
        fs.mkdirSync(projPath);
    }

    // Creates project.cutter file
    fs.writeFileSync(
        path.join(projPath, `project.cutter`),
        `# Editing this file could break your Stonecutter project;
# Do not touch unless you know what you're doing.
${yaml.safeDump(values).replace(/[']+/g, '')}`,
    );

    // Creates pack.mcmeta
    fs.writeFileSync(
        path.join(projPath, 'pack.mcmeta'),
        `{
            "pack": {
                "pack_format": 6,
                "description": ${values['description']}
            }
        }`,
    );

    // Create data folder
    fs.mkdirSync(path.join(projPath, 'data'));

    // Create Minecraft folders
    fs.mkdirSync(path.join(projPath, 'data/minecraft'));
    fs.mkdirSync(path.join(projPath, 'data/minecraft/tags'));
    fs.mkdirSync(path.join(projPath, 'data/minecraft/tags/functions'));

    projPath = path.join(
        projPath,
        `data/${values['name'].replace(/["]+/g, '')}`,
    );

    // Create namespace folder
    fs.mkdirSync(projPath);

    // Create subfolders
    fs.mkdirSync(path.join(projPath, 'advancements'));
    fs.mkdirSync(path.join(projPath, 'functions'));
    fs.mkdirSync(path.join(projPath, 'loot_tables'));
    fs.mkdirSync(path.join(projPath, 'predicates'));
    fs.mkdirSync(path.join(projPath, 'recipes'));
    fs.mkdirSync(path.join(projPath, 'structures'));

    fs.mkdirSync(path.join(projPath, 'tags'));
    fs.mkdirSync(path.join(projPath, 'tags/blocks'));
    fs.mkdirSync(path.join(projPath, 'tags/entity_types'));
    fs.mkdirSync(path.join(projPath, 'tags/fluids'));
    fs.mkdirSync(path.join(projPath, 'tags/functions'));
    fs.mkdirSync(path.join(projPath, 'tags/items'));

    fs.mkdirSync(path.join(projPath, 'dimension_type'));
    fs.mkdirSync(path.join(projPath, 'dimension'));

    fs.mkdirSync(path.join(projPath, 'worldgen'));
    fs.mkdirSync(path.join(projPath, 'worldgen/biome'));
    fs.mkdirSync(path.join(projPath, 'worldgen/configured_carver'));
    fs.mkdirSync(path.join(projPath, 'worldgen/configured_feature'));
    fs.mkdirSync(path.join(projPath, 'worldgen/configured_structure_feature'));
    fs.mkdirSync(path.join(projPath, 'worldgen/configured_surface_builder'));
    fs.mkdirSync(path.join(projPath, 'worldgen/noise_settings'));
    fs.mkdirSync(path.join(projPath, 'worldgen/processor_list'));
    fs.mkdirSync(path.join(projPath, 'worldgen/template_pool'));

    remote.getCurrentWindow().close();
});

/*
    This function looks for project.cutter,
    going up the directory tree until
    it finds the file, reaches the top 
    or times out.
*/
function findProject(file) {
    let searchDir = file;
    var t0 = performance.now();
    while (
        !(
            (
                searchDir == '/' || // Halt if reached top (macOS/Linux)
                searchDir == path.parse(__dirname).root || // Halt if reached top (Windows)
                performance.now() - t0 == 300
            ) // Halt if timer reached 300ms
        )
    ) {
        searchDir = path.resolve(searchDir, '..'); // Go one directory up
        if (fs.existsSync(path.join(searchDir, 'project.cutter'))) {
            console.log('Found project file at ' + searchDir);
            return path.basename(searchDir);
        }
    }
    // If loop halted
    console.log('No project file found.');
    return 'Untitled Project';
}

// Open a directory and list its contents
document.querySelector('#dirBtn').addEventListener('click', (event) => {
    dialog
        .showOpenDialog({
            title: 'Choose directory',
            properties: ['openDirectory'],
        })
        .then((response) => {
            if (!response.canceled) {
                $('#dirField').val(response.filePaths[0]);
            } else {
                console.log('No folder selected.');
            }
        });
});

document.querySelector('#closeBtn').addEventListener('click', (event) => {
    closePopup();
});
