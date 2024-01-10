<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type Settings from '@/types/settings'

const field = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let intervalId: number | null = null

const props = defineProps<{
    getNonRepeatCell: () => { x: number; y: number } | null
    settings: Settings
}>()

const emit = defineEmits<{
    end: []
}>()

onMounted(() => {
    field.value!.width = window.screen.width
    field.value!.height = window.screen.height
    ctx = field.value!.getContext('2d')

    intervalId = setInterval(loop, props.settings.interval)
})

const restart = () => {
    ctx?.clearRect(0, 0, field.value!.width, field.value!.height)
}

const start = () => {
    if (intervalId === null) {
        intervalId = setInterval(loop, props.settings.interval)
    }
}

const stop = () => {
    if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
    }
}

defineExpose({ restart, start, stop })

watch(
    () => props.settings.interval,
    () => {
        if (intervalId !== null) {
            clearInterval(intervalId)
            intervalId = setInterval(loop, props.settings.interval)
        }
    }
)

function setPixel(
    ctx: CanvasRenderingContext2D,
    pixel: { x: number; y: number; width: number; height: number; fading: boolean }
) {
    const degree = Math.floor(Math.random() * 360)
    ctx.fillStyle = `hsl(${degree}, 100%, 50%)`
    ctx.fillRect(pixel.x, pixel.y, pixel.width, pixel.height)

    if (pixel.fading) {
        setTimeout(() => {
            ctx.clearRect(pixel.x, pixel.y, pixel.width, pixel.height)
            ctx.fillStyle = `hsl(${degree}, 100%, 15%)`
            ctx.fillRect(pixel.x, pixel.y, pixel.width, pixel.height)
        }, props.settings.fadingTimeout)
    }
}

function loop() {
    const point = props.getNonRepeatCell()

    if (point === null) {
        end()
        return
    }

    setPixel(ctx!, {
        x: point.x,
        y: point.y,
        width: props.settings.pixelWidth,
        height: props.settings.pixelHeight,
        fading: props.settings.fading
    })
}

function end() {
    stop()
    emit('end')
}
</script>

<template>
    <canvas ref="field" id="field"></canvas>
</template>

<style scoped>
#field {
    image-rendering: pixelated;
    background-color: black;
}
</style>
