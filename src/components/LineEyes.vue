<script setup>
import Eye from './EyeDot.vue';

// Another case of defineProps being better than defineModel
defineProps({
    // Default is for empty line
    selected: {type: Number, default: 0},
    // Default is for normal color scheme
    inversion: {type: String, default: '______'},
});

// An eyeline is vertical from top to bottom due how v-for interacts with arrays
const eyeLines = [
    {id: 1, eyes: ['_______', 'visible', '_______', '_______', 'visible']},
    {id: 2, eyes: ['_______', '_______', 'visible', '_______', '_______']},
    {id: 3, eyes: ['_______', '_______', '_______', 'visible', 'visible']},
];
</script>

<template>
    <div>
        <Eye v-for="eyeLine in eyeLines" :key="eyeLine.id" :visibility="eyeLine.eyes[selected]" :inverted="inversion" />
    </div>
</template>
