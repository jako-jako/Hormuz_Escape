import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';
const FONT_JP = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif';
const MESSAGES = {
    mine: { text: 'ゲームオーバー：機雷に接触', color: '#ff4444' },
    ship: { text: 'ゲームオーバー：敵艦隊と衝突', color: '#ff4444' },
    fuel: { text: 'ゲームオーバー：燃料切れ', color: '#ff8800' },
    clear: { text: 'ミッション成功！海峡を通過', color: '#00ff88' },
};
export class EndScene extends Phaser.Scene {
    constructor() { super('EndScene'); }
    create(data) {
        this.cameras.main.setBackgroundColor('#000000');
        this.add.text(SCREEN_WIDTH / 2, 80, '紛争地帯 2026', {
            fontSize: '48px', fontFamily: FONT_JP, color: '#ffffff',
        }).setOrigin(0.5);
        const msg = MESSAGES[data.reason];
        this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 60, msg.text, {
            fontSize: '42px', fontFamily: FONT_JP, color: msg.color,
        }).setOrigin(0.5);
        const secs = Math.floor(data.time / 60);
        this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 20, `航行時間: ${secs} 秒`, {
            fontSize: '28px', fontFamily: FONT_JP, color: '#cccccc',
        }).setOrigin(0.5);
        const restartText = this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 120, 'スペースキー または クリックでリスタート', {
            fontSize: '26px', fontFamily: FONT_JP, color: '#ffffff',
        }).setOrigin(0.5);
        this.tweens.add({
            targets: restartText,
            alpha: 0,
            duration: 700,
            ease: 'Linear',
            yoyo: true,
            repeat: -1,
        });
        this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
        this.input.once('pointerdown', () => this.scene.start('GameScene'));
    }
}
