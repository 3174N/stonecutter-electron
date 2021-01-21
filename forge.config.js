const path = require('path');
const url = require('url');

module.exports = {
    packagerConfig: {
        name:
            process.platform == 'linux'
                ? 'stonecutter-electron'
                : 'Stonecutter',
        executableName:
            process.platform == 'linux'
                ? 'stonecutter-electron'
                : 'Stonecutter',
        icon: './src/styles/media/icon',
        appCopyright: 'Copyright © 2021 SFR & 3174N',
        appBundleId: 'org.stonecutter.Stonecutter',
    },
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'org.stonecutter.Stonecutter',
                title: 'Stonecutter',
                copyright: 'Copyright © 2021 SFR & 3174N',
                iconUrl:
                    'file://' + path.resolve('./src/styles/media/icon.ico'),
                setupIcon: './src/styles/media/icon.ico',
            },
        },
        {
            name: '@electron-forge/maker-flatpak',
            config: {
                options: {
                    base: 'org.electronjs.Electron2.BaseApp',
                    categories: ['Development', 'Game'],
                    description: 'An extensible IDE for Minecraft datapacks',
                    genericName: 'Text Editor',
                    icon: './src/styles/media/icon.png',
                    id: 'org.stonecutter.Stonecutter',
                    mimeType: [
                        'text/plain',
                        'text/markdown',
                        'application/json',
                    ],
                    productName: 'Stonecutter',
                },
            },
        },
        {
            name: '@electron-forge/maker-dmg',
            config: {
                name: 'Stonecutter v0.1.0',
                background: './src/styles/media/dmg-background.png',
                icon: './src/styles/media/icon.icns',
                overwrite: true,
                additionalDMGOptions: {
                    window: {
                        size: {
                            height: 355,
                            width: 540,
                        },
                    },
                },
                contents: [
                    {
                        x: 130,
                        y: 220,
                        type: 'file',
                        path: path.join(
                            __dirname,
                            'out/Stonecutter-darwin-x64/Stonecutter.app',
                        ),
                    },
                    {
                        x: 410,
                        y: 220,
                        type: 'link',
                        path: '/Applications',
                        name: ' ',
                    },
                ],
            },
        },
    ],
};
