<p align="center">
    <img height="60px" width="60px" src="src/styles/media/icon.png" />
    <h1 align="center">Stonecutter</h1>
</p>
<p align="center"> 
    <a href="https://david-dm.org/3174N/stonecutter-electron"><img src="https://badgen.net/david/dep/3174N/stonecutter-electron" /></a>
    <a href="https://david-dm.org/3174N/stonecutter-electron?type=dev"><img src="https://badgen.net/david/dev/3174N/stonecutter-electron" /></a>
    <a href="LICENSE"><img src="https://badgen.net/github/license/3174N/stonecutter-electron" /></a>
    <a href="https://github.com/3174N/stonecutter-electron/releases"><img src="https://badgen.net/github/release/3174N/stonecutter-electron" /></a>
</p>
<p align="center">A text editor for creating Minecraft datapacks.</p>

[Roadmap](https://github.com/3174N/stonecutter-electron/projects/1)

## Build From Source

Prerequisites:

-   [`git`](https://git-scm.com)
-   [`node`](https://nodejs.org)
-   [`npm`](https://npmjs.com)
-   _For Linux:_
-   -   `elfutils`
-   -   [`flatpak`](https://flatpak.org)
-   -   `flatpak-builder`

```sh
# Clone the repository
$ git clone https://github.com/3174N/stonecutter-electron
$ cd stonecutter-electron
# Install dependencies
$ npm install
# Build the app
$ npm run make
# Open your app
## macOS:
$ open out/make/Stonecutter\ v0.1.0.dmg
## Windows:
$ "out\make\squirrel.windows\x64\Stonecutter-0.1.0 Setup.exe"
## Linux:
$ out/stonecutter-electron-linux-x64/stonecutter-electron
$ cd out/make/flatpak/x86_64
$ flatpak install org.stonecutter.Stonecutter_stable_x86_64.flatpak
```
