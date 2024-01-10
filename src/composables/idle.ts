export default function useIdle(onIdle: () => void, onActive: () => void, timeout: number) {
    let activeCalled = false

    const onIdleEvent = () => {
        onIdle()
        activeCalled = false
    }

    let timer = setTimeout(onIdleEvent, timeout)

    const onActiveEvent = () => {
        if (!activeCalled) {
            onActive()
            activeCalled = true
        }

        clearTimeout(timer)
        timer = setTimeout(onIdleEvent, timeout)
    }

    document.addEventListener('mousemove', onActiveEvent)
    document.addEventListener('mousedown', onActiveEvent)
    document.addEventListener('keydown', onActiveEvent)
}
