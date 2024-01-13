<script setup lang="ts">
import PixelField from '@/components/PixelField.vue'
import InfoBar from '@/components/InfoBar.vue'
import AppSettings from '@/components/AppSettings.vue'
import useNonRepeatCell from '@/composables/non_repeat_cell'
import useRate from '@/composables/rate'
import useIdle from '@/composables/idle'
import useWakeLock from '@/composables/wake_lock'
import { computed, ref, watch } from 'vue'
import Control from '@/enums/control'
import useStorageSettings from '@/composables/storage_settings'
import { getRemainTime } from '@/helpers'

const settings = useStorageSettings()

let cell: ReturnType<typeof useNonRepeatCell>
let rate: ReturnType<typeof useRate>
let infoBarData: (() => string)[]
let refGetNonRepeatCell = ref<typeof cell.get>()

const pixelField = ref<InstanceType<typeof PixelField>>()
const appSettings = ref<InstanceType<typeof AppSettings>>()

function start() {
    pixelField.value?.restart()

    cell = useNonRepeatCell(
        window.screen.width,
        window.screen.height,
        Math.max(1, settings.pixelWidth),
        Math.max(1, settings.pixelHeight)
    )

    refGetNonRepeatCell.value = cell.get

    rate?.stop()
    rate = useRate(cell.usedCount, 1000)

    infoBarData = [
        () => Math.floor((cell.usedCount.value * 100) / cell.totalCount) + '%',
        () => `${cell.usedCount.value}/${cell.totalCount}`,
        () => rate.get.value + 'p/s',
        () => getRemainTime(cell.remainCount.value, rate.get.value)
    ]
}

start()

watch(() => settings.pixelWidth, start)
watch(() => settings.pixelHeight, start)

const showSettings = ref(true)
const showInfoBar = computed(() => settings.infoBar && showSettings.value)

function onIdle() {
    if (!settings.isOpened) {
        showSettings.value = false
        document.body.style.cursor = 'none'
    }
}

function onActive() {
    document.body.style.cursor = ''
    showSettings.value = true
}

useIdle(onIdle, onActive, 3000)

// const wakeLock = await useWakeLock()
useWakeLock()

function onControl(control: Control) {
    switch (control) {
        case Control.START: {
            pixelField.value?.start()
            break
        }
        case Control.STOP: {
            pixelField.value?.stop()
            break
        }
        case Control.RESTART: {
            start()
            break
        }
    }
}
</script>

<template>
    <header>
        <InfoBar v-if="showInfoBar" :data="infoBarData" />
    </header>
    <AppSettings v-if="showSettings" ref="appSettings" v-model="settings" @control="onControl" />
    <PixelField
        ref="pixelField"
        :get-non-repeat-cell="refGetNonRepeatCell!"
        :settings="settings"
        @end="appSettings?.resetStartStopButton()"
    />
</template>

<style scoped>
header {
    position: absolute;
    width: 100%;
    margin-top: 2vh;

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
