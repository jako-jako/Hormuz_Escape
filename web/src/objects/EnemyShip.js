import Phaser from 'phaser';
import { SCREEN_WIDTH, WORLD_HEIGHT, WORLD_CLEAR_Y } from '../constants';
import { pointInPolygon } from '../coastline';
export class EnemyShip {
    constructor(scene) {
        this.gfx = scene.add.graphics().setDepth(3);
        this.x = 0;
        this.y = 0;
        this.speedY = 0;
        this.spawn();
    }
    spawn() {
        this.x = Phaser.Math.Between(200, SCREEN_WIDTH - 200);
        this.y = Phaser.Math.Between(WORLD_CLEAR_Y + 50, WORLD_HEIGHT - 50);
        this.speedY = Phaser.Math.FloatBetween(0.5, 1.5);
    }
    update(iranCoast, omanCoast) {
        this.y += this.speedY;
        const onLand = pointInPolygon(this.x, this.y, iranCoast) ||
            pointInPolygon(this.x, this.y, omanCoast);
        if (onLand || this.y > WORLD_HEIGHT) {
            this.spawn();
        }
    }
    draw() {
        const g = this.gfx;
        g.clear();
        for (const offset of [-20, 0, 20]) {
            const sx = this.x + offset;
            g.fillStyle(0x646e78);
            g.fillRect(sx - 5, this.y - 10, 10, 16);
            g.fillStyle(0xffffff);
            g.fillRect(sx - 2, this.y - 8, 4, 4);
            g.lineStyle(1, 0x505050, 1);
            g.beginPath();
            g.moveTo(sx, this.y - 8);
            g.lineTo(sx, this.y - 14);
            g.strokePath();
            g.fillStyle(0xff0000);
            g.fillCircle(sx + 3, this.y - 12, 1);
        }
    }
    getBounds() {
        return new Phaser.Geom.Rectangle(this.x - 25, this.y - 10, 50, 16);
    }
    destroy() {
        this.gfx.destroy();
    }
}
