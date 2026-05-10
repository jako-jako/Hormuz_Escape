import { SCREEN_WIDTH, SPOTLIGHT_RADIUS } from '../constants';
export class Drone {
    constructor(scene, x, worldY) {
        this.direction = 1;
        this.speed = 1.8;
        this.x = x;
        this.worldY = worldY;
        this.gfx = scene.add.graphics().setDepth(6);
    }
    update() {
        this.x += this.speed * this.direction;
        if (this.x > SCREEN_WIDTH - 200 || this.x < 200) {
            this.direction = (this.direction * -1);
        }
    }
    isPlayerInside(playerX, playerY) {
        return Math.hypot(playerX - this.x, playerY - this.worldY) < SPOTLIGHT_RADIUS;
    }
    draw() {
        const g = this.gfx;
        g.clear();
        g.x = this.x;
        g.y = this.worldY;
        g.fillStyle(0x1e1e1e);
        g.fillRect(-5, -5, 10, 10);
        g.lineStyle(1, 0xcc0000, 1);
        g.strokeRect(-5, -5, 10, 10);
    }
    destroy() {
        this.gfx.destroy();
    }
}
