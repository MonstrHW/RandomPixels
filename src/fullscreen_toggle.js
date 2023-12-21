async function toggleFullScreen() {
    if (!document.fullscreenElement) {
        await document.body.requestFullscreen();
    } else {
        await document.exitFullscreen();
    }
}

export function useFullScreenToggle() {
    document.body.addEventListener("dblclick", toggleFullScreen);
}
