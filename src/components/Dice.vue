<script setup>
import Line from './Line.vue';

// Makes conditional displaying easier
const normal = '______';
const invert = 'invert';

// Default is for empty die
// const eyeValue = defineModel('eyeValue', {type: Number, default: 0});
// const inverted = defineModel('inverted', {type: String, default: normal});

const props = defineProps({
    eyeValue: {type: Number, default: 0},
    inverted: {type: String, default: normal},
});
// Most effective array config for v-for coding standards
const diceLines = [
    {id: 1, lines: [0, 0, 1, 1, 4, 4, 4]},
    {id: 2, lines: [0, 2, 0, 2, 0, 2, 4]},
    {id: 3, lines: [0, 0, 3, 3, 4, 4, 4]},
];
</script>

<template>
    <div class="dice">
        <Line
            v-for="diceLine in diceLines"
            :key="diceLine.id"
            :selected="diceLine.lines[eyeValue]"
            :inversion="inverted"
        />
        <b v-if="inverted === invert">Houden</b>
        <b v-else>Gooien</b>
    </div>
</template>
