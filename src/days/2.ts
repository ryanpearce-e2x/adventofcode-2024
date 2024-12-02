import { Day, IDay, Solution } from '../types/Day';

export default class Day2 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(2, skip);
    }

    // Check if the report is safe
    private isSafeReport(levels: number[]): boolean {
        return levels.every((level, i) => {
            if (i === levels.length - 1) return true;

            const diff = Math.abs(level - levels[i + 1]);

            const isValidDifference = diff >= 1 && diff <= 3;
            const isConsistentTrend = i === 0 || levels[i] < levels[i + 1] === levels[i - 1] < levels[i];

            return isValidDifference && isConsistentTrend;
        });
    }

    private isSafeReportWithOneRemoval(levels: number[]): boolean {
        for (let i = 0; i < levels.length; i++) {
            const levelsWithoutOne = [...levels.slice(0, i), ...levels.slice(i + 1)];

            if (this.isSafeReport(levelsWithoutOne)) {
                return true;
            }
        }

        return false;
    }

    partOne(): Solution {
        const reports = this.input
            .trim()
            .split('\n')
            .map((line) => line.split(' ').map(Number));

        return reports.filter(this.isSafeReport.bind(this)).length;
    }

    partTwo(): Solution {
        const reports = this.input
            .trim()
            .split('\n')
            .map((line) => line.split(' ').map(Number));

        return reports.filter((report) => this.isSafeReport(report) || this.isSafeReportWithOneRemoval(report)).length;
    }
}
