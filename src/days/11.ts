import { Day, IDay, Solution } from '../types/Day';

export default class Day11 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(11, skip);
    }

    private getStoneCount(blinks: number): string {
        let stonesMap: Map<string, bigint> = new Map();

        this.input
            .trim()
            .split(' ')
            .forEach((stoneStr) => {
                stonesMap.set(stoneStr, (stonesMap.get(stoneStr) || BigInt(0)) + BigInt(1));
            });

        for (let blink = 0; blink < blinks; blink++) {
            const newStonesMap: Map<string, bigint> = new Map();

            for (const [stone, count] of stonesMap.entries()) {
                if (stone === '0') {
                    newStonesMap.set('1', (newStonesMap.get('1') || BigInt(0)) + count);
                } else {
                    const numDigits = stone.length;

                    if (numDigits % 2 === 0) {
                        const half = numDigits / 2;
                        const leftStr = stone.slice(0, half);
                        const rightStr = stone.slice(half);
                        const left = leftStr.replace(/^0+/, '') || '0';
                        const right = rightStr.replace(/^0+/, '') || '0';
                        newStonesMap.set(left, (newStonesMap.get(left) || BigInt(0)) + count);
                        newStonesMap.set(right, (newStonesMap.get(right) || BigInt(0)) + count);
                    } else {
                        const multiplied = (BigInt(stone) * BigInt(2024)).toString();
                        newStonesMap.set(multiplied, (newStonesMap.get(multiplied) || BigInt(0)) + count);
                    }
                }
            }

            stonesMap = newStonesMap;
        }

        let totalStones: bigint = BigInt(0);
        for (const count of stonesMap.values()) {
            totalStones += count;
        }

        return totalStones.toString();
    }

    partOne(): Solution {
        return this.getStoneCount(25);
    }

    partTwo(): Solution {
        return this.getStoneCount(75);
    }
}
