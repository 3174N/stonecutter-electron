<p align="center">
    <img height="60px" width="60px" src="src/styles/media/icon.png" />
    <h1 align="center">Stonecutter</h1>
</p>
<p align="center"> 
    <a href="https://travis-ci.com/3174N/stonecutter-electron"><img src="https://badgen.net/travis/3174N/stonecutter-electron?label=build" /></a>
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
Stonecutter is an all-in-one `.json` and `.mcfunction` editor. Its goal is to include **syntax highlighting**, **formatting**, **linting** and **debugging** for both formats. It will also be very customizable, as you could tinker with *everything*, from colorschemes to settings to even changes in source code.
### Why?
The current state of datapack development is not good. Most novice to mid-level programmers use *Notepad++* which, while not bad, is very rudimentary. We aim to fix that. Our goal is to create an extensible, user-friendly and lightweight IDE that packs **all of** and **only** what you need as a datapack creator.

## Installation
[![GitHub Release](https://badgen.net/github/release/3174N/stonecutter-electron)](https://github.com/3174N/stonecutter-electron/releases) [![Flathub](https://img.shields.io/flathub/v/org.stonecutter.Stonecutter)](https://www.flathub.org/apps/details/org.stonecutter.Stonecutter)

Installing Stonecutter on your machine is easy as pie. If you're a *Windows* or *macOS* user, simply download the latest release package from our [releases page](https://github.com/3174N/stonecutter-electron/releases).

If you're a *Linux* user, a Flatpak is available over at [Flathub](https://www.flathub.org/apps/details/org.stonecutter.Stonecutter)<sup>*Not yet implemented*</sup>. If you don't have Flatpak or don't know how to install apps from it, please consult [Flatpak's docs](https://flatpak.org/setup). 

*Note: Stonecutter is still in very, **very** early development. Usage is likely to be lackluster and buggy at times.*

### Requirements

-   [Node.js](https://nodejs.org/)
-   [Git](https://git-scm.com/)

### Run the App

```bash
# Clone the repository
$ git clone https://github.com/3174N/stonecutter-electron
$ cd stonecutter-electron
# Install dependencies
$ npm install
# Build the app
$ npm run dist
# Open your app
$ open dist/Stonecutter-0.1.0.dmg # on macOS
$ dist/Stonecutter-0.1.0.AppImage # on Linux
$ "dist/Stonecutter Setup 0.1.0.exe" # on Windows
```

## Getting Help
Got stuck? Need help? The official documentation for Stonecutter is hosted [here](https://stonecutter.org/docs)<sup>*Not yet implemented*</sup>. If you've encountered a bug, please check [the issues page](https://github.com/3174N/stonecutter-electron/issues?q=is%3Aissue+label%3Abug) to see if we know of it, and if not, [file a bug report](https://github.com/3174N/stonecutter-electron/issues/new/choose)! 

## License
Copyright (c) 2021 3174N & SFR

We strongly believe in and endorse the open source community, and as such, *Stonecutter* is licensed under the MIT permissive license, and [*Craft Mono*](https://github.com/SFR-git/craft-mono) under the SIL Open Font license. Simply put, we grant you the right to freely mod, fork, change, give, sell and repackage this application, as long as you provide proper credit. Go nuts. 
