import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './constants';
import { TitleScene } from './scenes/TitleScene';
import { GameScene } from './scenes/GameScene';
import { EndScene } from './scenes/EndScene';
const config = {
    type: Phaser.AUTO,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000000',
    scene: [TitleScene, GameScene, EndScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
        antialias: true,
        pixelArt: false,
    },
};
new Phaser.Game(config);
