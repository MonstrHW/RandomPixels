import type Settings from '@/types/settings'
import { reactive, watch } from 'vue'

export default function useStorageSettings(): Settings {
    const defaultSettings: Settings = {
        isOpened: false,
        pixelWidth: 3,
        pixelHeight: 3,
        fadingTimeout: 1000,
        fading: false,
        infoBar: false,
        interval: 0
    }

    let settings: Settings

    const jsonSettings = localStorage.getItem('settings')

    if (jsonSettings === null) {
        localStorage.setItem('settings', JSON.stringify(defaultSettings))
        settings = reactive(defaultSettings)
    } else {
        settings = reactive(JSON.parse(jsonSettings))
    }

    watch(settings, () => {
        localStorage.setItem('settings', JSON.stringify(settings))
    })

    return settings
}
