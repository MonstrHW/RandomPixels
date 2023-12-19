export async function useWakeLock() {
    if (!("wakeLock" in navigator)) {
        return null;
    }

    const lock = await navigator.wakeLock.request("screen");

    return {
        release: () => lock.release(),
    };
}
