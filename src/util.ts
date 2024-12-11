export const range = (start: number, end: number): number[] => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const ascendingSort = (a: number, b: number): number => a - b;
export const descendingSort = (a: number, b: number): number => a + b;

export const gcd = (a: number, b: number): number => {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
};
