<p align="center">
    <img height="60px" width="60px" src="src/styles/media/icon.png" />
    <h1 align="center">Stonecutter</h1>
</p>
<p align="center"> 
    <a href="https://github.com/3174N/stonecutter-electron/actions?query=workflow%3AMaster"><img src="https://badgen.net/github/checks/3174N/stonecutter-electron/master?label=build" /></a>
    <a href="LICENSE"><img src="https://badgen.net/github/license/3174N/stonecutter-electron" /></a>
    <a href="https://github.com/3174N/stonecutter-electron/releases"><img src="https://badgen.net/github/release/3174N/stonecutter-electron" /></a>
</p>
<p align="center">A text editor for creating Minecraft datapacks.</p>

<table align="right">
  	<tr><td>
        <a href="https://david-dm.org/3174N/stonecutter-electron"><img src="https://badgen.net/david/dep/3174N/stonecutter-electron" /></a>
    </td></tr>
    <tr><td>
        <a href="https://david-dm.org/3174N/stonecutter-electron?type=dev"><img src="https://badgen.net/david/dev/3174N/stonecutter-electron" /></a>
    </td></tr>
    <tr><td>
        <a href="https://david-dm.org/3174N/stonecutter-electron?type=optional"><img src="https://badgen.net/david/optional/3174N/stonecutter-electron" /></a>
    </td></tr>
</table>

### What?

Stonecutter is an all-in-one `.json` and `.mcfunction` editor. Our goal is for it to include **syntax highlighting**, **formatting**, **linting** and **debugging** for both formats. It is also built with tinkering in mind, so that you could build the environment that suits you best.

### Why?

The current state of datapack development is not good. Most novice to mid-level programmers use _Notepad++_ which, while not bad, is very rudimentary. We aim to fix that by creating an extensible, yet user-friendly and lightweight IDE which include tools you need as a datapack creator.

## Installation

[![GitHub Release](https://badgen.net/github/release/3174N/stonecutter-electron)](https://github.com/3174N/stonecutter-electron/releases) [![Flathub](https://img.shields.io/flathub/v/org.stonecutter.Stonecutter)](https://www.flathub.org/apps/details/org.stonecutter.Stonecutter)

If you're a _Windows_ or _macOS_ user, simply download the latest release package from our [releases page](https://github.com/3174N/stonecutter-electron/releases).

If you're a _Linux_ user, a Flatpak is available over at [Flathub](https://www.flathub.org/apps/details/org.stonecutter.Stonecutter)<sup>_Not yet implemented_</sup>. If you don't have Flatpak or don't know how to install apps from it, please consult [Flatpak's docs](https://flatpak.org/setup).

_Note: Stonecutter is still in very, **very** early development. Usage is likely to be lackluster and buggy at times._

### Building from Source

Prerequisites:

-   [`git`](https://git-scm.com)
-   [`node`](https://nodejs.org)
-   [`npm`](https://npmjs.com)
-   _For Linux:_
    -   `elfutils`
    -   [`flatpak`](https://flatpak.org)
    -   `flatpak-builder`

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

## Getting Help

Got stuck? Need help? The official documentation for Stonecutter is hosted [here](https://stonecutter.org/docs)<sup>_Not yet implemented_</sup>. If you've encountered a bug, please check [the issues page](https://github.com/3174N/stonecutter-electron/issues?q=is%3Aissue+label%3Abug) to see if we know of it, and if not, [file a bug report](https://github.com/3174N/stonecutter-electron/issues/new/choose)!

## License

Copyright (c) 2021 3174N & SFR

We strongly believe in and endorse the open source community, and as such, _Stonecutter_ is licensed under the MIT permissive license, and [_Craft Mono_](https://github.com/SFR-git/craft-mono) under the SIL Open Font license. Simply put, we grant you the right to freely mod, fork, change, give, sell and repackage this application, as long as you provide proper credit. Go nuts.
