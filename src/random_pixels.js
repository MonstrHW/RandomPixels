import { useNonRepeatCell } from "./non_repeat_cell.js";
import { useRate } from "./rate.js";
import { useInfoBar } from "./info_bar.js";
import { useIdle } from "./idle.js";
import { useWakeLock } from "./wake_lock.js";

const canvas = document.getElementById("field");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

function getOptions() {
    let options = {
        pixelWidth: 2,
        pixelHeight: 2,
        fading: true,
    };

    const desc =
        "pixel width, pixel height, fade option\n(0: no fade, 1: fade)";
    const enter = prompt(desc, "2, 2, 1");
    if (enter === null || enter === "") {
        return options;
    }

    const validate = (value, min, max, def) => {
        if (isNaN(value)) {
            return def;
        }

        if (min !== null && value < min) {
            return min;
        }

        if (max !== null && value > max) {
            return max;
        }

        return value;
    };

    const args = enter.split(",");
    if (args.length > 0) {
        options.pixelWidth = validate(
            parseInt(args[0]),
            1,
            null,
            options.pixelWidth
        );
    }
    if (args.length > 1) {
        options.pixelHeight = validate(
            parseInt(args[1]),
            1,
            null,
            options.pixelHeight
        );
    }
    if (args.length > 2) {
        options.fading = validate(parseInt(args[2]), 0, 1, options.fading);
    }

    return options;
}

const options = getOptions();

const infoBar = document.getElementById("info-bar");
const infoBarDisplay = infoBar.style.display;
const bodyCursor = document.body.style.cursor;
let infoBarInFocus = false;

infoBar.addEventListener("mouseover", () => {
    infoBarInFocus = true;
});

infoBar.addEventListener("mouseleave", () => {
    infoBarInFocus = false;
});

function onIdle() {
    if (!infoBarInFocus) {
        infoBar.style.display = "none";
    }

    document.body.style.cursor = "none";
}

function onActive() {
    infoBar.style.display = infoBarDisplay;
    document.body.style.cursor = bodyCursor;
}

useIdle(onIdle, onActive, 3000);

const wakeLock = await useWakeLock();

const {
    get: getNonRepeatCell,
    usedCount: getUsedCellCount,
    remainCount: getRemainCellCount,
    totalCount: getTotalCellCount,
} = useNonRepeatCell(
    canvas.width,
    canvas.height,
    options.pixelWidth,
    options.pixelHeight
);

const { get: getRate, stop: stopRate } = useRate(getUsedCellCount, 1000);

const barData = [
    () => Math.floor((getUsedCellCount() * 100) / getTotalCellCount()) + "%",
    () => `${getUsedCellCount()}/${getTotalCellCount()}`,
    () => getRate() + "p/s",
    () => getRemainTime(getRemainCellCount(), getRate()),
];
const { stop: stopInfoBar } = useInfoBar("#info-bar", 1000, barData);

function setPixel(ctx, pixel) {
    const degree = Math.floor(Math.random() * 360);
    ctx.fillStyle = `hsl(${degree}, 100%, 50%)`;
    ctx.fillRect(pixel.x, pixel.y, pixel.width, pixel.height);

    if (pixel.fading) {
        setTimeout(() => {
            ctx.clearRect(pixel.x, pixel.y, pixel.width, pixel.height);
            ctx.fillStyle = `hsl(${degree}, 100%, 15%)`;
            ctx.fillRect(pixel.x, pixel.y, pixel.width, pixel.height);
        }, 500);
    }
}

function getRemainTime(remainCount, rate) {
    let remainTime = remainCount / rate;

    try {
        return new Date(remainTime * 1000).toISOString().slice(11, 19);
    } catch (e) {
        return new Date(0).toISOString().slice(11, 19);
    }
}

const intervalId = setInterval(loop);
function loop() {
    const point = getNonRepeatCell();

    if (point === null) {
        stop();
        return;
    }

    setPixel(ctx, {
        x: point.x,
        y: point.y,
        width: options.pixelWidth,
        height: options.pixelHeight,
        fading: options.fading,
    });
}

function stop() {
    clearInterval(intervalId);
    stopInfoBar(4, () => {
        stopRate();
    });

    wakeLock?.release();
}
