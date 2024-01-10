<script setup lang="ts">
defineProps<{
    data: (() => string)[]
}>()
</script>

<template>
    <div id="info-bar">
        <span v-for="(d, i) in data" :key="i">{{ d() }}</span>
    </div>
</template>

<style scoped>
#info-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    column-gap: 1vh;

    font-size: 3vh;
    color: white;
    background-color: black;
}
</style>
