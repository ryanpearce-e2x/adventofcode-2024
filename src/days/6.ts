import { Day, IDay, Solution } from '../types/Day';

enum Direction {
    Up,
    Right,
    Down,
    Left,
}

const dirVectors = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
];

export default class Day6 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(6, skip);
    }

    private parseMap(input: string): string[][] {
        return input
            .trim()
            .split('\n')
            .map((line) => line.split(''));
    }

    private findGuard(map: string[][]): { x: number; y: number; d: Direction } {
        let x = 0,
            y = 0,
            d = Direction.Up;
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                const c = map[i][j];
                if (c === '^') {
                    x = i;
                    y = j;
                    d = Direction.Up;
                } else if (c === 'v') {
                    x = i;
                    y = j;
                    d = Direction.Down;
                } else if (c === '<') {
                    x = i;
                    y = j;
                    d = Direction.Left;
                } else if (c === '>') {
                    x = i;
                    y = j;
                    d = Direction.Right;
                }
            }
        }
        return { x, y, d };
    }

    private simulate(
        map: string[][],
        x: number,
        y: number,
        d: Direction
    ): { visitedCount: number; path: [number, number][] } {
        const visited = new Set<string>();
        visited.add(`${x},${y}`);
        const path: [number, number][] = [[x, y]];
        for (;;) {
            const [dx, dy] = dirVectors[d];
            const nx = x + dx,
                ny = y + dy;
            if (nx < 0 || nx >= map.length || ny < 0 || ny >= map[0].length)
                return { visitedCount: visited.size, path };
            if (map[nx][ny] === '#') {
                d = (d + 1) % 4;
                continue;
            }
            x = nx;
            y = ny;
            visited.add(`${x},${y}`);
            path.push([x, y]);
        }
    }

    private simulateDetectLoop(
        map: string[][],
        startX: number,
        startY: number,
        startD: Direction,
        blockX: number,
        blockY: number
    ): boolean {
        const seen = new Set<string>();
        let x = startX,
            y = startY,
            d = startD;
        let movedForward = false;
        let attemptedBlockMove = false;

        for (;;) {
            const state = `${x},${y},${d}`;
            if (seen.has(state)) {
                return movedForward && attemptedBlockMove;
            }
            seen.add(state);

            const [dx, dy] = dirVectors[d];
            const nx = x + dx,
                ny = y + dy;

            if (nx < 0 || nx >= map.length || ny < 0 || ny >= map[0].length) return false;

            if ((nx === blockX && ny === blockY) || map[nx][ny] === '#') {
                if (nx === blockX && ny === blockY) attemptedBlockMove = true;
                d = (d + 1) % 4;
                continue;
            }

            movedForward = true;
            x = nx;
            y = ny;
        }
    }

    partOne(): Solution {
        const m = this.parseMap(this.input);
        const { x, y, d } = this.findGuard(m);
        m[x][y] = '.';
        return this.simulate(m, x, y, d).visitedCount;
    }

    partTwo(): Solution {
        const m = this.parseMap(this.input);
        const { x, y, d } = this.findGuard(m);
        m[x][y] = '.';

        const { path } = this.simulate(m, x, y, d);
        const uniqueCells = new Set<string>();

        for (let i = 1; i < path.length; i++) {
            const [ox, oy] = path[i];
            if (ox === x && oy === y) continue;
            uniqueCells.add(`${ox},${oy}`);
        }

        let count = 0;
        uniqueCells.forEach((cell) => {
            const [ox, oy] = cell.split(',').map(Number);
            if (this.simulateDetectLoop(m, x, y, d, ox, oy)) count++;
        });

        return count;
    }
}
