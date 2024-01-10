<script setup lang="ts">
import { ref } from 'vue'
import type Settings from '@/types/settings'
import Control from '@/enums/control'
import useFullscreen from '@/composables/fullscreen'

const settings = defineModel<Settings>({ required: true })
const emit = defineEmits<{
    control: [type: Control]
}>()

let startStopState = Control.START
const startStopButtonName = ref('stop')

function onStartStop() {
    if (startStopState === Control.START) {
        startStopState = Control.STOP
        startStopButtonName.value = 'start'
    } else {
        startStopState = Control.START
        startStopButtonName.value = 'stop'
    }

    emit('control', startStopState)
}

function resetStartStopButton() {
    startStopState = Control.STOP
    startStopButtonName.value = 'start'
}

defineExpose({ resetStartStopButton })

const { toggle: toggleFullScreen } = useFullscreen()
</script>

<template>
    <div id="container" :class="{ open: settings.isOpened }">
        <button class="btn" @click="settings.isOpened = !settings.isOpened">
            <img class="icon" src="@/assets/settings-icon.svg" />
        </button>
        <div class="settngs" v-if="settings.isOpened">
            <div class="pixel-size">
                <div>
                    <label>w:</label>
                    <input
                        class="number_input"
                        type="number"
                        min="1"
                        v-model="settings.pixelWidth"
                    />
                </div>
                <div>
                    <label>h:</label>
                    <input
                        class="number_input"
                        type="number"
                        min="1"
                        v-model="settings.pixelHeight"
                    />
                </div>
            </div>
            <div class="interval">
                <label>interval:</label>
                <input class="number_input" type="number" min="0" v-model="settings.interval" />
            </div>
            <div class="fading">
                <label>fading:</label>
                <input type="checkbox" v-model="settings.fading" />
                <div v-if="settings.fading">
                    <label>timeout:</label>
                    <input
                        class="number_input"
                        type="number"
                        min="0"
                        v-model="settings.fadingTimeout"
                    />
                </div>
            </div>
            <div class="info_bar">
                <label>info bar:</label>
                <input type="checkbox" v-model="settings.infoBar" />
            </div>
            <div class="control_buttons">
                <button @click="onStartStop">{{ startStopButtonName }}</button>
                <button @click="$emit('control', Control.RESTART)">restart</button>
            </div>
            <button @click="toggleFullScreen">fullscreen</button>
        </div>
    </div>
</template>

<style scoped>
#container {
    position: fixed;
    top: 30px;
    left: 30px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    color: white;
}

#container.open {
    background-color: rgba(0, 0, 255, 0.705);
    border-radius: 5px;
}

.btn {
    position: relative;
    width: 30px;
    height: 30px;
    padding: 3px;

    border-radius: 5px;
    outline: none;
    border: none;
}

.icon {
    width: 100%;
}

.settngs {
    position: relative;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
}

.pixel-size {
    display: flex;
    column-gap: 5px;
}

.number_input {
    width: 50px;
    outline: none;
}

.fading,
.control_buttons,
.info_bar {
    display: flex;
    column-gap: 5px;
}

.control_buttons button {
    width: 100%;
}
</style>
