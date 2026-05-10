import Phaser from 'phaser';
import { SCREEN_WIDTH, WORLD_HEIGHT, WORLD_CLEAR_Y, MINE_SIZE, MINE_SPEED_MIN, MINE_SPEED_MAX } from '../constants';
import { pointInPolygon } from '../coastline';
export class Mine {
    constructor(scene) {
        this.gfx = scene.add.graphics().setDepth(4);
        this.x = 0;
        this.y = 0;
        this.speedY = 0;
        this.rotation = 0;
        this.spawn();
    }
    spawn() {
        this.x = Phaser.Math.Between(200, SCREEN_WIDTH - 200);
        this.y = Phaser.Math.Between(WORLD_CLEAR_Y - 200, WORLD_CLEAR_Y - 50);
        this.speedY = Phaser.Math.FloatBetween(MINE_SPEED_MIN, MINE_SPEED_MAX);
        this.rotation = Phaser.Math.FloatBetween(0, 360);
    }
    update(speedMultiplier, iranCoast, omanCoast) {
        this.y += this.speedY * speedMultiplier;
        this.rotation += 3;
        const onLand = pointInPolygon(this.x, this.y, iranCoast) ||
            pointInPolygon(this.x, this.y, omanCoast);
        if (onLand || this.y > WORLD_HEIGHT + 50) {
            this.spawn();
        }
    }
    draw() {
        const g = this.gfx;
        g.clear();
        g.x = this.x;
        g.y = this.y;
        g.fillStyle(0x8b4513);
        g.fillCircle(0, 0, MINE_SIZE);
        g.lineStyle(2, 0x8b4513, 1);
        for (let i = 0; i < 4; i++) {
            const a = (i * 90 + this.rotation) * Math.PI / 180;
            g.beginPath();
            g.moveTo(0, 0);
            g.lineTo(Math.cos(a) * (MINE_SIZE + 5), Math.sin(a) * (MINE_SIZE + 5));
            g.strokePath();
        }
    }
    getCircle() {
        return new Phaser.Geom.Circle(this.x, this.y, MINE_SIZE);
    }
    destroy() {
        this.gfx.destroy();
    }
}
