import { SCREEN_WIDTH, WORLD_HEIGHT, IRAN_WAYPOINTS, OMAN_WAYPOINTS, ISLANDS } from './constants';
function interpolateCoast(waypoints, steps = 75) {
    const edge = [];
    const yStep = WORLD_HEIGHT / steps;
    for (let i = 0; i <= steps; i++) {
        const y = yStep * i;
        let x = waypoints[0][0];
        for (let j = 0; j < waypoints.length - 1; j++) {
            const [wx0, wy0] = waypoints[j];
            const [wx1, wy1] = waypoints[j + 1];
            if (wy0 <= y && y <= wy1) {
                const t = wy1 !== wy0 ? (y - wy0) / (wy1 - wy0) : 0;
                x = wx0 + t * (wx1 - wx0);
                break;
            }
        }
        edge.push([Math.round(x), Math.round(y)]);
    }
    return edge;
}
export function generateCoastlines() {
    const iranEdge = interpolateCoast(IRAN_WAYPOINTS);
    const omanEdge = interpolateCoast(OMAN_WAYPOINTS);
    const iranCoast = [[0, 0], ...iranEdge, [0, WORLD_HEIGHT]];
    const omanCoast = [[SCREEN_WIDTH, 0], ...omanEdge, [SCREEN_WIDTH, WORLD_HEIGHT]];
    return { iranCoast, omanCoast };
}
export function pointInPolygon(px, py, polygon) {
    let inside = false;
    let [x1, y1] = polygon[0];
    for (let i = 1; i <= polygon.length; i++) {
        const [x2, y2] = polygon[i % polygon.length];
        if (Math.min(y1, y2) < py && py <= Math.max(y1, y2)) {
            if (px <= Math.max(x1, x2)) {
                if (y1 !== y2) {
                    const xInt = ((py - y1) * (x2 - x1)) / (y2 - y1) + x1;
                    if (x1 === x2 || px <= xInt)
                        inside = !inside;
                }
            }
        }
        [x1, y1] = [x2, y2];
    }
    return inside;
}
export function isOnLand(px, py, iranCoast, omanCoast) {
    const corners = [
        [px - 14, py - 22], [px + 14, py - 22],
        [px - 14, py + 25], [px + 14, py + 25],
    ];
    for (const [cx, cy] of corners) {
        if (pointInPolygon(cx, cy, iranCoast))
            return true;
        if (pointInPolygon(cx, cy, omanCoast))
            return true;
    }
    for (const island of ISLANDS) {
        if (Math.hypot(px - island.x, py - island.y) < island.radius + 15)
            return true;
    }
    return false;
}
