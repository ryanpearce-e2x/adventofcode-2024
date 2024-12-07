import { Day, IDay, Solution } from '../types/Day';

type Operator = '+' | '*' | '||';

export default class Day7 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(7, skip);
    }

    partOne(): Solution {
        const allowedOperators: Operator[] = ['+', '*'];
        return this.calculateCalibrationResult(allowedOperators);
    }

    partTwo(): Solution {
        const allowedOperators: Operator[] = ['+', '*', '||'];
        return this.calculateCalibrationResult(allowedOperators);
    }

    private calculateCalibrationResult(operators: Operator[]): number {
        const lines = this.input.trim().split('\n');
        let totalCalibrationResult = 0;

        for (const line of lines) {
            const [testValueStr, numbersStr] = line.split(':').map((s) => s.trim());
            const testValue = parseInt(testValueStr, 10);
            const numbers = numbersStr.split(' ').map((s) => parseInt(s, 10));
            const operatorCount = numbers.length - 1;

            if (operatorCount === 0) {
                if (numbers[0] === testValue) {
                    totalCalibrationResult += testValue;
                }
                continue;
            }

            if (this.isValidEquation(numbers, testValue, operators)) {
                totalCalibrationResult += testValue;
            }
        }

        return totalCalibrationResult;
    }

    private isValidEquation(numbers: number[], testValue: number, allowedOperators: Operator[]): boolean {
        const recurse = (index: number, currentResult: number): boolean => {
            if (index === numbers.length) {
                return currentResult === testValue;
            }

            for (const op of allowedOperators) {
                let newResult: number;
                const nextNumber = numbers[index];

                if (op === '+') {
                    newResult = currentResult + nextNumber;
                } else if (op === '*') {
                    newResult = currentResult * nextNumber;
                } else if (op === '||') {
                    newResult = this.concatenate(currentResult, nextNumber);
                } else {
                    continue;
                }

                if (recurse(index + 1, newResult)) {
                    return true;
                }
            }

            return false;
        };

        return recurse(1, numbers[0]);
    }

    private concatenate(left: number, right: number): number {
        let digits = 0;
        let temp = right;
        if (temp === 0) return left * 10;
        while (temp > 0) {
            digits++;
            temp = Math.floor(temp / 10);
        }
        return left * Math.pow(10, digits) + right;
    }
}
