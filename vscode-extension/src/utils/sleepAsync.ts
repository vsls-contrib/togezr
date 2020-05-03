export const sleepAsync = async (timeout: number) => {
    return new Promise((res) => {
        setTimeout(res, timeout);
    });
};
