function prepareInfoElements(infoBar, size) {
    let preparedElements = [];

    for (let i = 0; i < size; i++) {
        const element = document.createElement("span");
        element.className = "element";
        infoBar.appendChild(element);

        preparedElements.push(element);
    }

    return preparedElements;
}

export function useInfoBar(selector, interval, data) {
    const infoBar = document.querySelector(selector);

    if (infoBar === null) {
        throw new Error("Element not found: " + selector);
    }

    let stop = false;
    let lastTicksCount = null;
    let onStopCallback = null;

    const elements = prepareInfoElements(infoBar, data.length);

    const intervalId = setInterval(() => {
        for (let i = 0; i < data.length; i++) {
            elements[i].innerHTML = data[i]();
        }

        if (stop) {
            lastTicksCount--;

            if (lastTicksCount <= 0) {
                clearInterval(intervalId);
                infoBar.innerHTML = "";
                onStopCallback();
            }
        }
    }, interval);

    return {
        stop: (lastTicks, onStop) => {
            stop = true;
            lastTicksCount = lastTicks;
            onStopCallback = onStop;
        },
    };
}
