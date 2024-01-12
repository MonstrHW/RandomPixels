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

let {
    get: getNonRepeatCell,
    usedCount: usedCellCount,
    remainCount: remainCellCount,
    totalCount: totalCellCount
} = useNonRepeatCell(
    window.screen.width,
    window.screen.height,
    settings.pixelWidth,
    settings.pixelHeight
)

const refGetNonRepeatCell = ref(getNonRepeatCell)

let { get: rate, stop: stopRate } = useRate(usedCellCount, 1000)

let infoBarData = [
    () => Math.floor((usedCellCount.value * 100) / totalCellCount) + '%',
    () => `${usedCellCount.value}/${totalCellCount}`,
    () => rate.value + 'p/s',
    () => getRemainTime(remainCellCount.value, rate.value)
]

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

const pixelField = ref<InstanceType<typeof PixelField>>()
const appSettings = ref<InstanceType<typeof AppSettings>>()

watch(() => settings.pixelWidth, restart)
watch(() => settings.pixelHeight, restart)

function restart() {
    pixelField.value?.restart()

    const nonRepeatCell = useNonRepeatCell(
        window.screen.width,
        window.screen.height,
        Math.max(1, settings.pixelWidth),
        Math.max(1, settings.pixelHeight)
    )

    refGetNonRepeatCell.value = nonRepeatCell.get
    usedCellCount = nonRepeatCell.usedCount
    remainCellCount = nonRepeatCell.remainCount
    totalCellCount = nonRepeatCell.totalCount

    stopRate()
    const newRate = useRate(usedCellCount, 1000)
    rate = newRate.get
    stopRate = newRate.stop

    infoBarData = [
        () => Math.floor((usedCellCount.value * 100) / totalCellCount) + '%',
        () => `${usedCellCount.value}/${totalCellCount}`,
        () => rate.value + 'p/s',
        () => getRemainTime(remainCellCount.value, rate.value)
    ]
}

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
            restart()
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
        :get-non-repeat-cell="refGetNonRepeatCell"
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
