export function useRate(data, interval) {
    let prevData = 0;
    let rate = 0;
    let stop = false;

    const intervalId = setInterval(() => {
        const currentData = data();
        rate = currentData - prevData;
        prevData = currentData;

        if (stop) {
            clearInterval(intervalId);
        }
    }, interval);

    return {
        get: () => {
            return rate;
        },

        stop: () => {
            stop = true;
        },
    };
}
