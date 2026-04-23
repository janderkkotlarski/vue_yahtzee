<script setup>
import Line from './LineEyes.vue';

// Makes conditional displaying easier
const invert = 'invert';

// And more defineProps applicability
defineProps({
    // Default is for empty die
    eyeValue: {type: Number, default: 0},
    inverted: {type: String, default: '______'},
});

// A diceline is vertical from top to bottom due how v-for interacts with arrays
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
