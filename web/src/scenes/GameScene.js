import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT, WORLD_HEIGHT, WORLD_START_Y, WORLD_CLEAR_Y, TOTAL_DISTANCE, NUM_MINES, NUM_ENEMY_SHIPS, SPOTLIGHT_RADIUS, ISLANDS, RADAR_X, RADAR_Y, RADAR_W, RADAR_H, PLAY_X1, PLAY_X2, } from '../constants';
import { generateCoastlines } from '../coastline';
import { PlayerShip } from '../objects/PlayerShip';
import { Mine } from '../objects/Mine';
import { Drone } from '../objects/Drone';
import { EnemyShip } from '../objects/EnemyShip';
const FONT_JP = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif';
export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.gameState = 'playing';
        this.alertLevel = 'LOW';
        this.gameTime = 0;
        this.flashTimer = 0;
        this.straitMessageTimer = 0;
        this.enteredStrait = false;
        this.endReason = 'mine';
    }
    create() {
        this.gameState = 'playing';
        this.alertLevel = 'LOW';
        this.gameTime = 0;
        this.flashTimer = 0;
        this.straitMessageTimer = 0;
        this.enteredStrait = false;
        const { iranCoast, omanCoast } = generateCoastlines();
        this.iranCoast = iranCoast;
        this.omanCoast = omanCoast;
        this.cameras.main.setBounds(0, 0, SCREEN_WIDTH, WORLD_HEIGHT);
        this.drawStaticMap();
        this.player = new PlayerShip(this, SCREEN_WIDTH / 2, WORLD_START_Y - 100);
        this.mines = Array.from({ length: NUM_MINES }, () => new Mine(this));
        this.drones = [
            new Drone(this, 300, 700),
            new Drone(this, 800, 1400),
        ];
        this.enemyShips = Array.from({ length: NUM_ENEMY_SHIPS }, () => new EnemyShip(this));
        this.buildUI();
        this.cursors = this.input.keyboard.createCursorKeys();
        this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
    // ─── static map (drawn once into a Graphics, depth 0) ───────────────────────
    drawStaticMap() {
        this.coastGfx = this.add.graphics().setDepth(0);
        // ocean
        this.coastGfx.fillStyle(0x19508c);
        this.coastGfx.fillRect(0, 0, SCREEN_WIDTH, WORLD_HEIGHT);
        this.coastGfx.fillStyle(0x4682b4);
        this.coastGfx.fillRect(80, 0, SCREEN_WIDTH - 160, WORLD_HEIGHT);
        // Iran coast (left)
        this.coastGfx.fillStyle(0xd28c50);
        this.drawPolygon(this.coastGfx, this.iranCoast);
        // Oman/UAE coast (right)
        this.coastGfx.fillStyle(0xd28c50);
        this.drawPolygon(this.coastGfx, this.omanCoast);
        // islands
        this.coastGfx.fillStyle(0x8b5a2b);
        for (const island of ISLANDS) {
            this.coastGfx.fillCircle(island.x, island.y, island.radius);
            this.coastGfx.lineStyle(2, 0x643c14, 1);
            this.coastGfx.strokeCircle(island.x, island.y, island.radius);
        }
        // clear line (red)
        this.coastGfx.lineStyle(4, 0xff0000, 1);
        this.coastGfx.beginPath();
        this.coastGfx.moveTo(150, WORLD_CLEAR_Y);
        this.coastGfx.lineTo(SCREEN_WIDTH - 150, WORLD_CLEAR_Y);
        this.coastGfx.strokePath();
        // country labels — world-space text
        this.add.text(30, 300, 'IRAN\n(イラン)', {
            fontSize: '22px', fontFamily: FONT_JP, color: '#323232', align: 'center',
        }).setDepth(1);
        this.add.text(SCREEN_WIDTH - 240, 300, 'OMAN / UAE\n(オマーン / UAE)', {
            fontSize: '22px', fontFamily: FONT_JP, color: '#323232', align: 'center',
        }).setDepth(1);
        // strait title
        this.add.text(SCREEN_WIDTH / 2, 30, '紛争地帯 2026', {
            fontSize: '48px', fontFamily: FONT_JP, color: '#ffffff',
        }).setOrigin(0.5, 0).setDepth(1);
    }
    drawPolygon(g, polygon) {
        g.beginPath();
        g.moveTo(polygon[0][0], polygon[0][1]);
        for (let i = 1; i < polygon.length; i++) {
            g.lineTo(polygon[i][0], polygon[i][1]);
        }
        g.closePath();
        g.fillPath();
    }
    // ─── fixed-camera UI ────────────────────────────────────────────────────────
    buildUI() {
        // status box (left bottom)
        const box = this.add.graphics().setScrollFactor(0).setDepth(20);
        box.lineStyle(2, 0xffff00, 1);
        box.strokeRect(10, SCREEN_HEIGHT - 120, 235, 110);
        box.fillStyle(0x000000, 0.8);
        box.fillRect(10, SCREEN_HEIGHT - 120, 235, 110);
        this.add.text(20, SCREEN_HEIGHT - 110, '航行中', {
            fontSize: '20px', fontFamily: FONT_JP, color: '#00ff00',
        }).setScrollFactor(0).setDepth(21);
        this.oilText = this.add.text(20, SCREEN_HEIGHT - 82, '燃料: 100%', {
            fontSize: '20px', fontFamily: FONT_JP, color: '#ffff00',
        }).setScrollFactor(0).setDepth(21);
        this.alertText = this.add.text(20, SCREEN_HEIGHT - 54, '警戒: 低', {
            fontSize: '20px', fontFamily: FONT_JP, color: '#00ff00',
        }).setScrollFactor(0).setDepth(21);
        // controls box (right bottom)
        const cbox = this.add.graphics().setScrollFactor(0).setDepth(20);
        cbox.lineStyle(2, 0xffff00, 1);
        cbox.strokeRect(SCREEN_WIDTH - 245, SCREEN_HEIGHT - 120, 235, 110);
        cbox.fillStyle(0x000000, 0.8);
        cbox.fillRect(SCREEN_WIDTH - 245, SCREEN_HEIGHT - 120, 235, 110);
        this.add.text(SCREEN_WIDTH - 235, SCREEN_HEIGHT - 110, '操作', {
            fontSize: '20px', fontFamily: FONT_JP, color: '#ffffff',
        }).setScrollFactor(0).setDepth(21);
        this.add.text(SCREEN_WIDTH - 235, SCREEN_HEIGHT - 82, '← → : 方向転換（30度）', {
            fontSize: '16px', fontFamily: FONT_JP, color: '#ffff00',
        }).setScrollFactor(0).setDepth(21);
        this.add.text(SCREEN_WIDTH - 235, SCREEN_HEIGHT - 58, '↑ : 加速  ↓ : 後退', {
            fontSize: '16px', fontFamily: FONT_JP, color: '#ffff00',
        }).setScrollFactor(0).setDepth(21);
        this.progressText = this.add.text(SCREEN_WIDTH - 235, SCREEN_HEIGHT - 34, '進度: 0%', {
            fontSize: '16px', fontFamily: FONT_JP, color: '#ffffff',
        }).setScrollFactor(0).setDepth(21);
        // progress bar (right edge)
        const barX = SCREEN_WIDTH - 50;
        const barTop = 90;
        const barH = SCREEN_HEIGHT - 180;
        const barW = 30;
        const barBg = this.add.graphics().setScrollFactor(0).setDepth(20);
        barBg.fillStyle(0x646464, 1);
        barBg.fillRect(barX - barW / 2, barTop, barW, barH);
        barBg.lineStyle(2, 0xffffff, 1);
        barBg.strokeRect(barX - barW / 2, barTop, barW, barH);
        this.add.text(barX - barW / 2 - 50, barTop - 22, 'GOAL', {
            fontSize: '16px', fontFamily: FONT_JP, color: '#ffffff',
        }).setScrollFactor(0).setDepth(21);
        this.add.text(barX - barW / 2 - 55, barTop + barH + 4, 'START', {
            fontSize: '16px', fontFamily: FONT_JP, color: '#ffffff',
        }).setScrollFactor(0).setDepth(21);
        this.progressBarFill = this.add.graphics().setScrollFactor(0).setDepth(21);
        // strait message (hidden initially)
        this.straitText = this.add.text(SCREEN_WIDTH / 2, 80, 'ホルムズ海峡に進入', {
            fontSize: '30px', fontFamily: FONT_JP, color: '#ffff00',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(25).setAlpha(0);
        // flash overlay
        this.flashOverlay = this.add.graphics().setScrollFactor(0).setDepth(14);
        // radar
        this.radarGfx = this.add.graphics().setScrollFactor(0).setDepth(22);
    }
    // ─── update ─────────────────────────────────────────────────────────────────
    update() {
        if (this.gameState !== 'playing')
            return;
        this.gameTime++;
        const justLeft = Phaser.Input.Keyboard.JustDown(this.leftKey);
        const justRight = Phaser.Input.Keyboard.JustDown(this.rightKey);
        this.player.move(this.cursors, { left: justLeft, right: justRight }, this.iranCoast, this.omanCoast);
        const progress = Math.max(0, (WORLD_START_Y - this.player.y) / (WORLD_START_Y - WORLD_CLEAR_Y));
        // drone update + detection
        let inSpotlight = false;
        for (const d of this.drones) {
            d.update();
            if (d.isPlayerInside(this.player.x, this.player.y))
                inSpotlight = true;
        }
        // alert level
        const prevAlert = this.alertLevel;
        let speedMult;
        if (inSpotlight) {
            this.alertLevel = 'HIGH';
            speedMult = 2.0;
        }
        else if (progress < 0.4) {
            this.alertLevel = 'LOW';
            speedMult = 1.0;
        }
        else if (progress < 0.7) {
            this.alertLevel = 'MEDIUM';
            speedMult = 1.4;
        }
        else {
            this.alertLevel = 'HIGH';
            speedMult = 2.0;
        }
        if (this.alertLevel !== prevAlert)
            this.flashTimer = 6;
        // strait message
        if (!this.enteredStrait && this.player.y >= 820 && this.player.y <= 1350) {
            this.enteredStrait = true;
            this.straitMessageTimer = 180;
        }
        // update entities
        for (const m of this.mines)
            m.update(speedMult, this.iranCoast, this.omanCoast);
        for (const s of this.enemyShips)
            s.update(this.iranCoast, this.omanCoast);
        // collision: mines
        const playerRect = this.player.getBounds();
        for (const m of this.mines) {
            if (Phaser.Geom.Intersects.CircleToRectangle(m.getCircle(), playerRect)) {
                this.endGame('mine');
                return;
            }
        }
        // collision: enemy ships
        for (const s of this.enemyShips) {
            if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, s.getBounds())) {
                this.endGame('ship');
                return;
            }
        }
        // clear
        if (this.player.y < WORLD_CLEAR_Y) {
            this.endGame('clear');
            return;
        }
        // fuel
        if (this.player.oil <= 0) {
            this.endGame('fuel');
            return;
        }
        // camera
        const camY = Math.max(0, Math.min(WORLD_HEIGHT - SCREEN_HEIGHT, this.player.y - SCREEN_HEIGHT * 0.6));
        this.cameras.main.setScroll(0, camY);
        // draw
        this.player.draw();
        for (const m of this.mines)
            m.draw();
        for (const d of this.drones)
            d.draw();
        for (const s of this.enemyShips)
            s.draw();
        this.updateFlash();
        this.updateUI(progress, camY);
        this.updateRadar(progress);
        this.updateStraitMessage();
    }
    // ─── flash overlay ───────────────────────────────────────────────────────────
    updateFlash() {
        this.flashOverlay.clear();
        if (this.flashTimer > 0) {
            const color = this.alertLevel === 'HIGH' ? 0xff0000 : 0xffff00;
            this.flashOverlay.fillStyle(color, 0.12);
            this.flashOverlay.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
            this.flashTimer--;
        }
    }
    // ─── HUD ─────────────────────────────────────────────────────────────────────
    updateUI(progress, _camY) {
        this.oilText.setText(`燃料: ${Math.max(0, Math.floor(this.player.oil))}%`);
        const alertLabels = { LOW: '低', MEDIUM: '中', HIGH: '高' };
        const alertColors = {
            LOW: '#00ff00', MEDIUM: '#ffff00', HIGH: '#ff4444',
        };
        this.alertText.setText(`警戒: ${alertLabels[this.alertLevel]}`);
        this.alertText.setColor(alertColors[this.alertLevel]);
        const pct = Math.floor(progress * 100);
        this.progressText.setText(`進度: ${pct}%`);
        // progress bar
        const barX = SCREEN_WIDTH - 50;
        const barTop = 90;
        const barH = SCREEN_HEIGHT - 180;
        const barW = 30;
        const fillH = Math.floor(barH * progress);
        const color = this.alertLevel === 'LOW' ? 0x00ff00 : (this.alertLevel === 'MEDIUM' ? 0xffff00 : 0xff4444);
        this.progressBarFill.clear();
        this.progressBarFill.fillStyle(color, 1);
        this.progressBarFill.fillRect(barX - barW / 2, barTop + barH - fillH, barW, fillH);
        const remaining = Math.max(0, Math.round(TOTAL_DISTANCE * (1 - progress)));
        this.progressText.setText(`進度: ${pct}%  残り ${remaining}km`);
    }
    // ─── radar minimap ────────────────────────────────────────────────────────────
    updateRadar(progress) {
        const g = this.radarGfx;
        g.clear();
        // background
        g.fillStyle(0x001428, 1);
        g.fillRect(RADAR_X, RADAR_Y, RADAR_W, RADAR_H);
        g.lineStyle(1, 0xffff00, 1);
        g.strokeRect(RADAR_X, RADAR_Y, RADAR_W, RADAR_H);
        const toRadar = (wx, wy) => {
            const rx = RADAR_X + ((wx - PLAY_X1) / (PLAY_X2 - PLAY_X1)) * RADAR_W;
            const ry = RADAR_Y + ((wy - WORLD_CLEAR_Y) / (WORLD_START_Y - WORLD_CLEAR_Y)) * RADAR_H;
            return [rx, Math.max(RADAR_Y, Math.min(RADAR_Y + RADAR_H, ry))];
        };
        // goal line
        const [, goalRY] = toRadar(0, WORLD_CLEAR_Y);
        g.lineStyle(1, 0xff0000, 1);
        g.beginPath();
        g.moveTo(RADAR_X, goalRY);
        g.lineTo(RADAR_X + RADAR_W, goalRY);
        g.strokePath();
        // mines
        g.fillStyle(0x8b4513, 1);
        for (const m of this.mines) {
            const [rx, ry] = toRadar(m.x, m.y);
            g.fillCircle(rx, ry, 2);
        }
        // enemy ships
        g.fillStyle(0x969696, 1);
        for (const s of this.enemyShips) {
            const [rx, ry] = toRadar(s.x, s.y);
            g.fillCircle(rx, ry, 2);
        }
        // player triangle
        const [px, py] = toRadar(this.player.x, this.player.y);
        const rad = (this.player.angle * Math.PI) / 180;
        const tri = [
            [px + 5 * Math.sin(rad), py - 5 * Math.cos(rad)],
            [px + 3 * Math.sin(rad + 2.3), py - 3 * Math.cos(rad + 2.3)],
            [px + 3 * Math.sin(rad - 2.3), py - 3 * Math.cos(rad - 2.3)],
        ];
        g.fillStyle(0xffffff, 1);
        g.beginPath();
        g.moveTo(tri[0][0], tri[0][1]);
        g.lineTo(tri[1][0], tri[1][1]);
        g.lineTo(tri[2][0], tri[2][1]);
        g.closePath();
        g.fillPath();
        // progress bar label inside radar area
        g.fillStyle(0x00ff00, 1);
        void progress; // used in updateUI
    }
    // ─── strait message ───────────────────────────────────────────────────────────
    updateStraitMessage() {
        if (this.straitMessageTimer <= 0) {
            this.straitText.setAlpha(0);
            return;
        }
        this.straitText.setAlpha(Math.min(1, this.straitMessageTimer / 30));
        this.straitMessageTimer--;
    }
    // ─── end ─────────────────────────────────────────────────────────────────────
    endGame(reason) {
        this.gameState = 'over';
        this.endReason = reason;
        // brief delay then switch scene
        this.time.delayedCall(1200, () => {
            this.scene.start('EndScene', {
                reason: this.endReason,
                time: this.gameTime,
            });
        });
    }
    destroy() {
        this.player.destroy();
        for (const m of this.mines)
            m.destroy();
        for (const d of this.drones)
            d.destroy();
        for (const s of this.enemyShips)
            s.destroy();
    }
}
