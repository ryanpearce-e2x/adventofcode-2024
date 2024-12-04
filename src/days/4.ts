import { Day, IDay, Solution } from '../types/Day';

export default class Day4 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(4, skip);
    }

    private directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
    ];

    private countWord(grid: string[][], word: string): number {
        const [rows, cols, wordLength] = [grid.length, grid[0].length, word.length];
        let count = 0;
        grid.forEach((row, r) =>
            row.forEach((cell, c) => {
                if (cell !== word[0]) return;
                this.directions.forEach(([dr, dc]) => {
                    let [nr, nc, k] = [r, c, 0];
                    while (k < wordLength && nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === word[k]) {
                        [nr, nc, k] = [nr + dr, nc + dc, k + 1];
                    }
                    if (k === wordLength) count++;
                });
            })
        );
        return count;
    }

    private checkMASInXShape(grid: string[][], r: number, c: number): boolean {
        if (r + 2 >= grid.length || c + 2 >= grid[0].length) return false;

        const TLBR = grid[r][c] === 'M' && grid[r + 1][c + 1] === 'A' && grid[r + 2][c + 2] === 'S';
        const BLTR = grid[r + 2][c] === 'M' && grid[r + 1][c + 1] === 'A' && grid[r][c + 2] === 'S';
        const TRBL = grid[r][c + 2] === 'M' && grid[r + 1][c + 1] === 'A' && grid[r + 2][c] === 'S';
        const BRTL = grid[r + 2][c + 2] === 'M' && grid[r + 1][c + 1] === 'A' && grid[r][c] === 'S';

        return (
            (TLBR && (TRBL || BLTR)) || (BLTR && (TLBR || BRTL)) || (TRBL && (TLBR || BRTL)) || (BRTL && (BLTR || TRBL))
        );
    }

    partOne(): Solution {
        const grid = this.input
            .trim()
            .split('\n')
            .map((line) => line.split(''));
        return this.countWord(grid, 'XMAS');
    }

    partTwo(): Solution {
        const grid = this.input
            .trim()
            .split('\n')
            .map((line) => line.split(''));
        let count = 0;

        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[0].length; c++) {
                if (this.checkMASInXShape(grid, r, c)) {
                    count++;
                }
            }
        }

        return count;
    }
}
