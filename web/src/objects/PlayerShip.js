import Phaser from 'phaser';
import { SCREEN_WIDTH, WORLD_HEIGHT, WORLD_CLEAR_Y, PLAYER_SPEED, PLAYER_AUTO_SPEED, } from '../constants';
import { isOnLand } from '../coastline';
export class PlayerShip {
    constructor(scene, startX, startY) {
        this.angle = 0; // degrees, 0 = up
        this.oil = 100;
        this.x = startX;
        this.y = startY;
        this.gfx = scene.add.graphics().setDepth(5);
    }
    move(cursors, justDown, iranCoast, omanCoast) {
        const prevX = this.x;
        const prevY = this.y;
        if (justDown.left)
            this.angle = (this.angle - 30 + 360) % 360;
        if (justDown.right)
            this.angle = (this.angle + 30) % 360;
        const rad = (this.angle * Math.PI) / 180;
        // auto-advance
        const ax = this.x + PLAYER_AUTO_SPEED * Math.sin(rad);
        const ay = this.y - PLAYER_AUTO_SPEED * Math.cos(rad);
        if (this.inBounds(ax, ay) && !isOnLand(ax, ay, iranCoast, omanCoast)) {
            this.x = ax;
            this.y = ay;
            this.oil = Math.max(0, this.oil - 0.05);
        }
        // UP: accelerate
        if (cursors.up.isDown) {
            const nx = this.x + PLAYER_SPEED * Math.sin(rad);
            const ny = this.y - PLAYER_SPEED * Math.cos(rad);
            if (this.inBounds(nx, ny) && !isOnLand(nx, ny, iranCoast, omanCoast)) {
                this.x = nx;
                this.y = ny;
                this.oil = Math.max(0, this.oil - 0.10);
            }
        }
        // DOWN: reverse
        if (cursors.down.isDown) {
            const nx = this.x - PLAYER_SPEED * Math.sin(rad);
            const ny = this.y + PLAYER_SPEED * Math.cos(rad);
            if (this.inBounds(nx, ny) && !isOnLand(nx, ny, iranCoast, omanCoast)) {
                this.x = nx;
                this.y = ny;
            }
        }
        // extra coast push-back safety
        if (isOnLand(this.x, this.y, iranCoast, omanCoast)) {
            this.x = prevX;
            this.y = prevY;
        }
    }
    inBounds(x, y) {
        return (y > WORLD_CLEAR_Y - 10 &&
            y < WORLD_HEIGHT - 80 &&
            x > 150 &&
            x < SCREEN_WIDTH - 150);
    }
    draw() {
        const g = this.gfx;
        g.clear();
        g.x = this.x;
        g.y = this.y;
        g.setRotation((this.angle * Math.PI) / 180);
        // hull
        g.fillStyle(0x282832);
        g.beginPath();
        g.moveTo(0, -28);
        g.lineTo(14, -18);
        g.lineTo(16, 25);
        g.lineTo(0, 30);
        g.lineTo(-16, 25);
        g.lineTo(-14, -18);
        g.closePath();
        g.fillPath();
        // deck
        g.fillStyle(0xe6e6d2);
        g.beginPath();
        g.moveTo(-12, -20);
        g.lineTo(12, -20);
        g.lineTo(12, 20);
        g.lineTo(-12, 20);
        g.closePath();
        g.fillPath();
        // tanks
        g.fillStyle(0xc8c8c8);
        for (const [tx, ty] of [[-7, -8], [7, -8], [-7, 5], [7, 5]]) {
            g.fillCircle(tx, ty, 4);
        }
        // bridge (white block aft)
        g.fillStyle(0xffffff);
        g.fillRect(-6, 15, 12, 8);
        // funnel
        g.fillStyle(0x8b5a2b);
        g.fillRect(-2, 10, 4, 6);
        // bow line (yellow)
        g.lineStyle(2, 0xffff00, 1);
        g.beginPath();
        g.moveTo(-3, -28);
        g.lineTo(3, -28);
        g.strokePath();
        // waterline outline
        g.lineStyle(2, 0x6496c8, 1);
        g.beginPath();
        g.moveTo(0, -28);
        g.lineTo(14, -18);
        g.lineTo(16, 25);
        g.lineTo(0, 30);
        g.lineTo(-16, 25);
        g.lineTo(-14, -18);
        g.closePath();
        g.strokePath();
    }
    getBounds() {
        return new Phaser.Geom.Rectangle(this.x - 16, this.y - 28, 32, 58);
    }
    destroy() {
        this.gfx.destroy();
    }
}
