import { Day, IDay, Solution } from '../types/Day';
import { ascendingSort } from '../util';

export default class Day1 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(1, skip);
    }

    private separateLeftAndRight(input: string): { left: number[]; right: number[] } {
        const lines = input.trim().split('\n');

        const left: number[] = [];
        const right: number[] = [];

        lines.forEach((line) => {
            const [num1, num2] = line.trim().split(/\s+/).map(Number);
            left.push(num1);
            right.push(num2);
        });

        return { left, right };
    }

    private calculateSimilarityScore(left: number[], right: number[]): number {
        const frequencyMap: Record<number, number> = {};
        for (const num of right) {
            frequencyMap[num] = (frequencyMap[num] || 0) + 1;
        }

        let similarityScore = 0;
        for (const num of left) {
            const frequency = frequencyMap[num] || 0;
            similarityScore += num * frequency;
        }

        return similarityScore;
    }

    partOne(): Solution {
        const { left, right } = this.separateLeftAndRight(this.input);
        const sortedLeft = left.sort(ascendingSort);
        const sortedRight = right.sort(ascendingSort);

        let solution = 0;
        for (let i = 0; i < sortedLeft.length; i++) {
            solution += Math.abs(sortedLeft[i] - sortedRight[i]);
        }

        return solution;
    }

    partTwo(): Solution {
        const { left, right } = this.separateLeftAndRight(this.input);
        const similarityScore = this.calculateSimilarityScore(left, right);
        return similarityScore;
    }
}
