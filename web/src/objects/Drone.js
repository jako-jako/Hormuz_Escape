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
        // 監視範囲の破線円
        g.lineStyle(2, 0xcc0000, 1);
        this.drawDashedCircle(g, 0, 0, SPOTLIGHT_RADIUS, 8);
        // ドローン本体
        g.fillStyle(0x1e1e1e);
        g.fillRect(-5, -5, 10, 10);
        g.lineStyle(1, 0xcc0000, 1);
        g.strokeRect(-5, -5, 10, 10);
    }
    drawDashedCircle(g, cx, cy, radius, dashLength) {
        const segments = 64;
        const segmentAngle = (Math.PI * 2) / segments;
        for (let i = 0; i < segments; i += 2) {
            const angle1 = i * segmentAngle;
            const angle2 = (i + 1) * segmentAngle;
            const x1 = cx + radius * Math.cos(angle1);
            const y1 = cy + radius * Math.sin(angle1);
            const x2 = cx + radius * Math.cos(angle2);
            const y2 = cy + radius * Math.sin(angle2);
            g.beginPath();
            g.moveTo(x1, y1);
            g.lineTo(x2, y2);
            g.strokePath();
        }
    }
    destroy() {
        this.gfx.destroy();
    }
}
