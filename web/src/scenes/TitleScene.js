import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';
const FONT_JP = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif';
export class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }
    create() {
        this.cameras.main.setBackgroundColor('#000000');
        this.add.text(SCREEN_WIDTH / 2, 140, '紛争地帯 2026', {
            fontSize: '52px', fontFamily: FONT_JP, color: '#ffffff',
        }).setOrigin(0.5);
        this.add.text(SCREEN_WIDTH / 2, 210, 'ホルムズ・エスケープ', {
            fontSize: '36px', fontFamily: FONT_JP, color: '#ffff00',
        }).setOrigin(0.5);
        const story = [
            '時は2026年。アメリカとイランの紛争により',
            'ホルムズ海峡は封鎖された。',
            '日本のエネルギーを支えるタンカーの船長であるあなたは、',
            '機雷とドローン監視網をかいくぐり、',
            '海峡を強行突破しなければならない。',
        ];
        story.forEach((line, i) => {
            this.add.text(SCREEN_WIDTH / 2, 320 + i * 44, line, {
                fontSize: '22px', fontFamily: FONT_JP, color: '#ffffff',
            }).setOrigin(0.5);
        });
        const controls = [
            '← → キー : 方向転換（30度刻み）',
            '↑ キー   : 加速前進',
            '↓ キー   : 後退',
        ];
        controls.forEach((line, i) => {
            this.add.text(SCREEN_WIDTH / 2, 560 + i * 30, line, {
                fontSize: '18px', fontFamily: FONT_JP, color: '#aaffaa',
            }).setOrigin(0.5);
        });
        const startText = this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 60, 'スペースキー または クリックでスタート', {
            fontSize: '26px', fontFamily: FONT_JP, color: '#00ff00',
        }).setOrigin(0.5);
        this.tweens.add({
            targets: startText,
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
