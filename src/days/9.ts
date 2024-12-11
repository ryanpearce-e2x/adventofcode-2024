import { Day, IDay, Solution } from '../types/Day';

export default class Day9 extends Day implements IDay {
    constructor(skip: boolean = false) {
        super(9, skip);
    }

    partOne(): Solution {
        const input = this.input.trim();
        const blocks: (number | -1)[] = [];
        let fileId = 0;

        for (let i = 0; i < input.length; i += 2) {
            const fileLength = parseInt(input[i], 10);
            for (let j = 0; j < fileLength; j++) {
                blocks.push(fileId);
            }
            fileId++;

            if (i + 1 < input.length) {
                const freeLength = parseInt(input[i + 1], 10);
                for (let j = 0; j < freeLength; j++) {
                    blocks.push(-1);
                }
            }
        }

        let moved = true;
        while (moved) {
            moved = false;
            const firstFree = blocks.indexOf(-1);
            if (firstFree === -1) break;

            let lastFileIndex = -1;
            for (let i = blocks.length - 1; i > firstFree; i--) {
                if (blocks[i] !== -1) {
                    lastFileIndex = i;
                    break;
                }
            }

            if (lastFileIndex === -1) break;

            blocks[firstFree] = blocks[lastFileIndex];
            blocks[lastFileIndex] = -1;
            moved = true;
        }

        let checksum = 0;
        for (let pos = 0; pos < blocks.length; pos++) {
            const currentFileId = blocks[pos];
            if (currentFileId !== -1) {
                checksum += pos * currentFileId;
            }
        }

        return checksum;
    }

    partTwo(): Solution {
        const input = this.input.trim();
        const blocks: (number | -1)[] = [];
        let fileId = 0;

        for (let i = 0; i < input.length; i++) {
            const length = parseInt(input[i], 10);
            if (i % 2 === 0) {
                for (let j = 0; j < length; j++) {
                    blocks.push(fileId);
                }
                fileId++;
            } else {
                for (let j = 0; j < length; j++) {
                    blocks.push(-1);
                }
            }
        }

        interface FileInfo {
            fileId: number;
            start: number;
            length: number;
        }

        const files: FileInfo[] = [];
        let currentFileId: number | null = null;
        let currentStart: number = 0;
        let currentLength: number = 0;

        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i] !== -1) {
                if (currentFileId !== blocks[i]) {
                    if (currentFileId !== null) {
                        files.push({
                            fileId: currentFileId,
                            start: currentStart,
                            length: currentLength,
                        });
                    }
                    currentFileId = blocks[i];
                    currentStart = i;
                    currentLength = 1;
                } else {
                    currentLength++;
                }
            } else {
                if (currentFileId !== null) {
                    files.push({
                        fileId: currentFileId,
                        start: currentStart,
                        length: currentLength,
                    });
                    currentFileId = null;
                    currentLength = 0;
                }
            }
        }

        if (currentFileId !== null) {
            files.push({
                fileId: currentFileId,
                start: currentStart,
                length: currentLength,
            });
        }

        files.sort((a, b) => b.fileId - a.fileId);

        for (const file of files) {
            const { fileId, start, length } = file;

            let leftmostFitStart = -1;
            const maxLeftIndex = start;

            let currentFreeStart = -1;
            let currentFreeLength = 0;

            for (let i = 0; i < maxLeftIndex; i++) {
                if (blocks[i] === -1) {
                    if (currentFreeStart === -1) {
                        currentFreeStart = i;
                        currentFreeLength = 1;
                    } else {
                        currentFreeLength++;
                    }

                    if (currentFreeLength === length) {
                        leftmostFitStart = currentFreeStart;
                        break;
                    }
                } else {
                    currentFreeStart = -1;
                    currentFreeLength = 0;
                }
            }

            if (leftmostFitStart !== -1) {
                for (let j = 0; j < length; j++) {
                    blocks[leftmostFitStart + j] = fileId;
                }

                for (let j = 0; j < length; j++) {
                    blocks[start + j] = -1;
                }

                file.start = leftmostFitStart;
            }
        }

        let checksum = 0;
        for (let pos = 0; pos < blocks.length; pos++) {
            const currentFileId = blocks[pos];
            if (currentFileId !== -1) {
                checksum += pos * currentFileId;
            }
        }

        return checksum;
    }
}
