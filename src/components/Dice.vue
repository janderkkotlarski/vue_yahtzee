<script setup>
import Line from './Line.vue';

// Default is for empty die
const value = defineModel('value', {type: Number, default: 0});
const inverted = defineModel('inverted', {type: String, default: '______'});

// Most effective array config for v-for coding standards
const diceLines = [
    {id: 1, lines: [0, 0, 1, 1, 4, 4, 4]},
    {id: 2, lines: [0, 2, 0, 2, 0, 2, 4]},
    {id: 3, lines: [0, 0, 3, 3, 4, 4, 4]},
];
</script>

<template>
    <div class="dice">
        <Line v-for="diceLine in diceLines" :key="diceLine.id" :selected="diceLine.lines[value]" :inverted="inverted" />
    </div>
</template>
