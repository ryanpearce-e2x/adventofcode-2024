import { Day, IDay, Solution } from '../types/Day';
import { gcd } from '../util';

type Position = { x: number; y: number };
type Antenna = { position: Position; frequency: string };

export default class Day8 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(8, skip);
    }

    private parseInput(input: string): { antennas: Antenna[]; width: number; height: number } {
        const lines = input.trim().split('\n');
        const height = lines.length;
        const width = Math.max(...lines.map((line) => line.length));
        const antennas: Antenna[] = [];

        lines.forEach((line, y) => {
            line.split('').forEach((char, x) => {
                if (char !== '.' && char !== ' ') {
                    antennas.push({ position: { x, y }, frequency: char });
                }
            });
        });

        return { antennas, width, height };
    }

    private groupAntennasByFrequency(antennas: Antenna[]): Record<string, Antenna[]> {
        const frequencyMap: Record<string, Antenna[]> = {};

        antennas.forEach((antenna) => {
            if (!frequencyMap[antenna.frequency]) {
                frequencyMap[antenna.frequency] = [];
            }
            frequencyMap[antenna.frequency].push(antenna);
        });

        return frequencyMap;
    }

    private isValidPosition(x: number, y: number, width: number, height: number): boolean {
        return x >= 0 && x < width && y >= 0 && y < height;
    }

    private addPoint(set: Set<string>, x: number, y: number, width: number, height: number): void {
        if (this.isValidPosition(x, y, width, height)) {
            set.add(`${x},${y}`);
        }
    }

    private generateAntennaPairs(group: Antenna[]): [Antenna, Antenna][] {
        const pairs: [Antenna, Antenna][] = [];
        for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                pairs.push([group[i], group[j]]);
            }
        }
        return pairs;
    }

    private normalizeDirection(dx: number, dy: number): { dirx: number; diry: number } {
        const divisor = gcd(dx, dy);
        let dirx = dx / divisor;
        let diry = dy / divisor;

        if (dirx < 0 || (dirx === 0 && diry < 0)) {
            dirx = -dirx;
            diry = -diry;
        }

        return { dirx, diry };
    }

    private calculatePartOneAntinodes(antennas: Antenna[], width: number, height: number): number {
        const frequencyMap = this.groupAntennasByFrequency(antennas);
        const antinodes = new Set<string>();

        Object.values(frequencyMap).forEach((group) => {
            if (group.length < 2) return;

            const pairs = this.generateAntennaPairs(group);
            pairs.forEach(([A, B]) => {
                const transformed1 = { x: 2 * A.position.x - B.position.x, y: 2 * A.position.y - B.position.y };
                const transformed2 = { x: 2 * B.position.x - A.position.x, y: 2 * B.position.y - A.position.y };

                this.addPoint(antinodes, transformed1.x, transformed1.y, width, height);
                this.addPoint(antinodes, transformed2.x, transformed2.y, width, height);
            });
        });

        return antinodes.size;
    }

    private calculatePartTwoAntinodes(antennas: Antenna[], width: number, height: number): number {
        const frequencyMap = this.groupAntennasByFrequency(antennas);
        const antinodePositions = new Set<string>();

        Object.values(frequencyMap).forEach((group) => {
            if (group.length < 2) return;

            const processedLines = new Set<string>();
            const pairs = this.generateAntennaPairs(group);

            pairs.forEach(([A, B]) => {
                const dx = B.position.x - A.position.x;
                const dy = B.position.y - A.position.y;

                if (dx === 0 && dy === 0) {
                    this.addPoint(antinodePositions, A.position.x, A.position.y, width, height);
                    return;
                }

                const { dirx, diry } = this.normalizeDirection(dx, dy);

                const K = A.position.y * dirx - A.position.x * diry;
                const lineKey = `${dirx},${diry},${K}`;

                if (processedLines.has(lineKey)) return;
                processedLines.add(lineKey);

                this.traverseAndAddPoints(antinodePositions, A.position.x, A.position.y, -dirx, -diry, width, height);

                this.addPoint(antinodePositions, A.position.x, A.position.y, width, height);

                this.traverseAndAddPoints(antinodePositions, A.position.x, A.position.y, dirx, diry, width, height);
            });
        });

        return antinodePositions.size;
    }

    private traverseAndAddPoints(
        set: Set<string>,
        startX: number,
        startY: number,
        stepX: number,
        stepY: number,
        width: number,
        height: number
    ): void {
        let xCur = startX + stepX;
        let yCur = startY + stepY;

        while (this.isValidPosition(xCur, yCur, width, height)) {
            set.add(`${xCur},${yCur}`);
            xCur += stepX;
            yCur += stepY;
        }
    }

    partOne(): Solution {
        const { antennas, width, height } = this.parseInput(this.input);
        return this.calculatePartOneAntinodes(antennas, width, height);
    }

    partTwo(): Solution {
        const { antennas, width, height } = this.parseInput(this.input);
        return this.calculatePartTwoAntinodes(antennas, width, height);
    }
}
