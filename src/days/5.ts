import { Day, IDay, Solution } from '../types/Day';

export default class Day5 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(5, skip);
    }

    private parseInput(input: string): { rules: [number, number][]; updates: number[][] } {
        const [rulesPart, updatesPart] = input.trim().split('\n\n');
        const rules = rulesPart.split('\n').map((line) => line.split('|').map(Number) as [number, number]);
        const updates = updatesPart.split('\n').map((line) => line.split(',').map(Number));
        return { rules, updates };
    }

    private isUpdateValid(update: number[], rules: [number, number][]): boolean {
        const indexMap = new Map<number, number>();
        update.forEach((page, index) => indexMap.set(page, index));

        for (const [before, after] of rules) {
            if (indexMap.has(before) && indexMap.has(after)) {
                if (indexMap.get(before)! >= indexMap.get(after)!) {
                    return false;
                }
            }
        }

        return true;
    }

    private topologicalSort(update: number[], rules: [number, number][]): number[] {
        const graph = new Map<number, Set<number>>();
        const inDegree = new Map<number, number>();

        update.forEach((page) => {
            graph.set(page, new Set());
            inDegree.set(page, 0);
        });

        for (const [before, after] of rules) {
            if (update.includes(before) && update.includes(after)) {
                graph.get(before)!.add(after);
                inDegree.set(after, (inDegree.get(after) || 0) + 1);
            }
        }

        const queue: number[] = [];
        inDegree.forEach((degree, page) => {
            if (degree === 0) queue.push(page);
        });

        const sorted: number[] = [];
        while (queue.length > 0) {
            const current = queue.shift()!;
            sorted.push(current);

            for (const neighbor of graph.get(current) || []) {
                inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
                if (inDegree.get(neighbor)! === 0) {
                    queue.push(neighbor);
                }
            }
        }

        return sorted;
    }

    private getMiddlePage(update: number[]): number {
        const middleIndex = Math.floor(update.length / 2);
        return update[middleIndex];
    }

    partOne(): Solution {
        const { rules, updates } = this.parseInput(this.input);
        let sumOfMiddlePages = 0;

        for (const update of updates) {
            if (this.isUpdateValid(update, rules)) {
                const middlePage = this.getMiddlePage(update);
                sumOfMiddlePages += middlePage;
            }
        }

        return sumOfMiddlePages;
    }

    partTwo(): Solution {
        const { rules, updates } = this.parseInput(this.input);
        let sumOfMiddlePages = 0;

        for (const update of updates) {
            if (!this.isUpdateValid(update, rules)) {
                const correctedUpdate = this.topologicalSort(update, rules);
                const middlePage = this.getMiddlePage(correctedUpdate);
                sumOfMiddlePages += middlePage;
            }
        }

        return sumOfMiddlePages;
    }
}
