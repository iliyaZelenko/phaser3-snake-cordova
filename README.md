![](https://i.imgur.com/tfiFz2r.png)

### [Snake Demo](https://iliyazelenko.github.io/phaser3-snake-cordova/)

[![Greenkeeper badge](https://badges.greenkeeper.io/iliyaZelenko/phaser3-snake-cordova.svg)](https://greenkeeper.io/)

https://iliyazelenko.github.io/phaser3-snake-cordova/

## Getting started

### Installing the dependencies

Install the dependencies (yarn is recomended):

```
yarn # Or npm install
```

### Restoring platforms

Platforms are automatically restored from package.json and config.xml when the 'cordova prepare' command is run.

```
cordova prepare
```

### Running Dev Server

Easy development in [HMR (Hot Module Replacement) mode](https://webpack.js.org/concepts/hot-module-replacement/):

```
yarn dev # Or npm run dev
```

### Building for production

Perform a build (bundle.js) in `www` folder with copy assets and html page from src.

```
yarn build # Or npm run build
```

### Run on cordova

Run on real device:

```
cordova run android --device
```

Run on emulator (virtual device):

```
cordova run android
```

Run on specific emulator:

```
# shows list of devices
cordova run android --list
# specify device
cordova run android --target "Nexus_4_API_26"
```

## Cheat Sheets

- [Phaser.Game](https://github.com/iliyaZelenko/phaser3-typescript/blob/master/cheatsheets/game-config.md)
- [Phaser.Scene](https://github.com/iliyaZelenko/phaser3-typescript/blob/master/cheatsheets/scene-config.md)
- [Phaser.GameObject.Image](https://github.com/iliyaZelenko/phaser3-typescript/blob/master/cheatsheets/gameobjects/image.md)
- [Phaser.GameObject.Sprite](https://github.com/iliyaZelenko/phaser3-typescript/blob/master/cheatsheets/gameobjects/sprite.md)
- [Phaser.GameObject.Group](https://github.com/iliyaZelenko/phaser3-typescript/blob/master/cheatsheets/gameobjects/group.md)
- [Phaser.GameObject.Mesh](https://github.com/iliyaZelenko/phaser3-typescript/blob/master/cheatsheets/gameobjects/mesh.md)

## External Resources

- [Phaser 3 Framework](https://github.com/photonstorm/phaser)
- [Phaser 3 Docs with TypeScript Definition File](https://github.com/photonstorm/phaser3-docs)
- [Phaser 3 Online Docs](https://photonstorm.github.io/phaser3-docs/index.html)
- [Phaser 3 Official Examples](https://github.com/photonstorm/phaser3-examples)
- [Cordova off. site](https://cordova.apache.org/)

## Helpful tools

- [Leshy SpriteSheet Tool](https://www.leshylabs.com/apps/sstool)
- [Tiled](https://www.mapeditor.org)
- [Littera](http://kvazars.com/littera)

