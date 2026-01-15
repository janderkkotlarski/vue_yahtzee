<script setup>
import Eye from './Eye.vue';

// Default is for empty line
const selected = defineModel('selected', {type: Number, default: 0});

const eyeLines = [
    {id: 1, eyes: ['_______', 'visible', '_______', '_______', 'visible']},
    {id: 2, eyes: ['_______', '_______', 'visible', '_______', '_______']},
    {id: 3, eyes: ['_______', '_______', '_______', 'visible', 'visible']},
];
</script>

<template>
    <div>
        <Eye v-for="eyeLine in eyeLines" :key="eyeLine.id" :visibility="eyeLine.eyes[selected]" />
    </div>
</template>
