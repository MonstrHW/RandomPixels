import { ref } from 'vue'

export default function useFullScreen() {
    const isFullscreen = ref(false)

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            isFullscreen.value = false
        }
    })

    return {
        isFullscreen,
        toggle: async () => {
            if (!isFullscreen.value) {
                await document.documentElement.requestFullscreen()
                isFullscreen.value = true
            } else {
                await document.exitFullscreen()
                isFullscreen.value = false
            }
        }
    }
}
