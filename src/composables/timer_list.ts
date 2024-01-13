class Timer {
    private readonly callback: () => void
    private duration: number

    private timerId: number | null = null
    private startTime: number = 0

    constructor(callback: () => void, duration: number) {
        this.callback = callback
        this.duration = duration

        this.resume()
    }

    public pause() {
        if (this.timerId !== null) {
            clearTimeout(this.timerId)
            this.duration -= Date.now() - this.startTime
            this.timerId = null
        }
    }

    public resume() {
        if (this.timerId === null) {
            this.timerId = setTimeout(this.callback, this.duration)
            this.startTime = Date.now()
        }
    }

    public clear() {
        if (this.timerId !== null) {
            clearTimeout(this.timerId)
            this.timerId = null
        }
    }
}

export default function useTimerList() {
    const timerSet = new Set<Timer>()

    return {
        add: (callback: () => void, duration: number) => {
            const timer = new Timer(() => {
                callback()
                timerSet.delete(timer)
            }, duration)

            timerSet.add(timer)
        },

        pause: () => {
            for (const timer of timerSet) {
                timer.pause()
            }
        },

        resume: () => {
            for (const timer of timerSet) {
                timer.resume()
            }
        },

        clear: () => {
            for (const timer of timerSet) {
                timer.clear()
            }

            timerSet.clear()
        }
    }
}
