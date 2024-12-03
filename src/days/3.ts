import { Day, IDay, Solution } from '../types/Day';

export default class Day3 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(3, skip);
    }

    partOne(): Solution {
        const regex = /mul\((\d+),(\d+)\)/g;
        let total = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(this.input.trim())) !== null) {
            total += parseInt(match[1], 10) * parseInt(match[2], 10);
        }
        return total;
    }

    partTwo(): Solution {
        const regex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;
        let enabled = true,
            total = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(this.input.trim())) !== null) {
            const [fullMatch, x, y] = match;
            if (fullMatch === 'do()') enabled = true;
            else if (fullMatch === "don't()") enabled = false;
            else if (enabled && x && y) total += parseInt(x, 10) * parseInt(y, 10);
        }
        return total;
    }
}
