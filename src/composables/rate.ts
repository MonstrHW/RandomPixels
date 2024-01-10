import { ref, type Ref } from 'vue'

export default function useRate(data: Ref<number>, interval: number) {
    let prevData = 0
    const rate = ref(0)

    const intervalId = setInterval(() => {
        rate.value = data.value - prevData
        prevData = data.value
    }, interval)

    return {
        get: rate,

        stop: () => {
            clearInterval(intervalId)
        }
    }
}
