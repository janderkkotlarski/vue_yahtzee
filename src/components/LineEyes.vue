<script setup>
import Eye from './EyeDot.vue';

// Another case of defineProps being better than defineModel
defineProps({
    // Default is for empty line
    selected: {type: Number, default: 0},
    inversion: {type: String, default: '______'},
});

// An eyeline is vertical from top to bottom
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
