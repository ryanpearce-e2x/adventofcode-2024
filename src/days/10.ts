import { Day, IDay, Solution } from '../types/Day';

type Position = {
    x: number;
    y: number;
};

export default class Day10 extends Day implements IDay {
    private grid: number[][];
    private rows: number;
    private cols: number;

    constructor(skip: boolean = false) {
        super(10, skip);
        this.grid = this.parseGrid(this.input);
        this.rows = this.grid.length;
        this.cols = this.grid[0].length;
    }

    private parseGrid(input: string): number[][] {
        return input
            .trim()
            .split('\n')
            .map((line) =>
                line
                    .trim()
                    .split('')
                    .map((char) => parseInt(char, 10))
            );
    }

    private getNeighbors(x: number, y: number): Position[] {
        const directions = [
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
        ];
        return directions
            .map((dir) => ({ x: x + dir.dx, y: y + dir.dy }))
            .filter((pos) => pos.x >= 0 && pos.x < this.rows && pos.y >= 0 && pos.y < this.cols);
    }

    private getTrailheads(): Position[] {
        const trailheads: Position[] = [];
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                if (this.grid[x][y] === 0) {
                    trailheads.push({ x, y });
                }
            }
        }
        return trailheads;
    }

    partOne(): Solution {
        const trailheads = this.getTrailheads();
        const nines = new Set<string>();
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                if (this.grid[x][y] === 9) {
                    nines.add(`${x},${y}`);
                }
            }
        }
        let totalScore = 0;
        for (const trailhead of trailheads) {
            const visited: boolean[][] = Array.from({ length: this.rows }, () => Array(this.cols).fill(false));
            const queue: Array<{ pos: Position; height: number }> = [{ pos: trailhead, height: 0 }];
            visited[trailhead.x][trailhead.y] = true;
            const reachableNines: Set<string> = new Set();
            while (queue.length > 0) {
                const current = queue.shift()!;
                const { pos, height } = current;
                if (height === 9) {
                    reachableNines.add(`${pos.x},${pos.y}`);
                    continue;
                }
                const nextHeight = height + 1;
                for (const neighbor of this.getNeighbors(pos.x, pos.y)) {
                    if (this.grid[neighbor.x][neighbor.y] === nextHeight && !visited[neighbor.x][neighbor.y]) {
                        visited[neighbor.x][neighbor.y] = true;
                        queue.push({ pos: neighbor, height: nextHeight });
                    }
                }
            }
            totalScore += reachableNines.size;
        }
        return totalScore;
    }

    partTwo(): Solution {
        const trailheads = this.getTrailheads();
        const memo: number[][] = Array.from({ length: this.rows }, () => Array(this.cols).fill(-1));
        const countPaths = (x: number, y: number): number => {
            if (memo[x][y] !== -1) return memo[x][y];
            if (this.grid[x][y] === 9) {
                memo[x][y] = 1;
                return 1;
            }
            let paths = 0;
            for (const neighbor of this.getNeighbors(x, y)) {
                if (this.grid[neighbor.x][neighbor.y] === this.grid[x][y] + 1) {
                    paths += countPaths(neighbor.x, neighbor.y);
                }
            }
            memo[x][y] = paths;
            return paths;
        };
        let totalRating = 0;
        for (const trailhead of trailheads) {
            totalRating += countPaths(trailhead.x, trailhead.y);
        }
        return totalRating;
    }
}
