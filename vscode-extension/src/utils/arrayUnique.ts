export const arrayUnique = <T>(arr: T[]) => {
    return [...new Set(arr)];
};
