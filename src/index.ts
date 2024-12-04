import { Day1, Day2, Day3, Day4 } from './days';
import { IDay } from './types/Day';

const measureExecutionTime = (callback: () => void): number => {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    return elapsedTime;
};

const currentDays = [new Day1(), new Day2(), new Day3(), new Day4()];

const runDay = (day: IDay, dayNumber: number) => {
    console.log(`-----Day ${dayNumber}-----`);
    const p1Time = measureExecutionTime(() => {
        console.log('Part 1:', day.partOne());
    });
    console.log('Part 1 executed in', p1Time, 'ms');
    const p2Time = measureExecutionTime(() => {
        console.log('Part 2:', day.partTwo());
    });
    console.log('Part 2 executed in', p2Time, 'ms');
    console.log('---------------');
};

const dayArg = parseInt(process.argv[2]);
if (!isNaN(dayArg) && dayArg >= 1 && dayArg <= currentDays.length) {
    runDay(currentDays[dayArg - 1], dayArg);
} else {
    currentDays.forEach((day, i) => {
        runDay(day, i + 1);
    });
}
