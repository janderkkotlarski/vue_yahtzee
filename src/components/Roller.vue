<script setup>
import Dice from './Dice.vue';

// Simple constants
const valueMax = 6;
const diceAmount = 5;
const maxThrows = 25;
const millis = 25;
const maxClicks = 3;
const numberLine = 3;

const normal = '______';
const invert = 'invert';

const buttonMessage = 'Gooien: ';

/// define emits to let the parent do the recount function upon emitting this
const emit = defineEmits(['recounting']);

// the 'ref' that the parent can fill in and access
const diceLine = defineModel('diceLine', {
    type: Object,
    default: {
        dice: [],
        clicked: maxClicks,
    },
});

// Really nested and powerful way of changing reactive objects
// Feels a bit like passing parameters by reference in C++
const cuboid = index => {
    if (index > 0 && index <= diceAmount) {
        return diceLine.value.dice[index - 1];
    }
};

// Simple dice roll function
const roll = () => Math.floor(valueMax * Math.random()) + 1;

// Fill the dice array in the diceArray object with sensible entries
// Do the same for the publicDice defineModel object
const diceArrayFilling = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        diceLine.value.dice.push({id: index, rolled: 0, inversion: normal});
    }

    diceLine.value.clicked = maxClicks;
};

diceArrayFilling();

// For the next round
const diceArrayReset = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        const cubid = cuboid(index);

        cubid.rolled = 0;
        cubid.inversion = normal;
    }

    diceLine.value.clicked = maxClicks;
};

// Roll all dice that are rollable
const diceRoll = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        const cubid = cuboid(index);

        // If not locked, then roll
        if (cubid.inversion === normal) {
            cubid.rolled = roll();

            if (numberLine > 0 && numberLine <= valueMax) {
                cubid.rolled = numberLine;
            }
        }
    }
};

let throwing = false;

// Throw dice a number of times and space them apart in time
const diceRolling = () => {
    if (diceLine.value.clicked > 0 && !throwing) {
        throwing = true;

        for (let throws = 0; throws < maxThrows; ++throws) {
            setTimeout(function () {
                diceRoll();
            }, millis * throws);
        }

        // Pace throwing
        setTimeout(function () {
            throwing = false;

            emit('recounting');
        }, millis * maxThrows);

        --diceLine.value.clicked;
    }
};

// flip between free and locked
const flip = index => {
    if (index > 0 && index <= diceAmount) {
        const cubid = cuboid(index);

        if (cubid.rolled > 0 && cubid.rolled <= valueMax) {
            cubid.inversion = cubid.inversion === normal ? invert : normal;
        }
    }
};

// Give function access to the parent
defineExpose({
    diceArrayReset,
});
</script>

<template>
    <div>
        <Dice
            @click="flip(cube.id)"
            v-for="cube in diceLine.dice"
            :key="cube.id"
            v-model:eyeValue="cube.rolled"
            :class="cube.inversion"
            :inverted="cube.inversion"
        />
    </div>
    <br />
    <button @click="diceRolling">{{ buttonMessage }} {{ diceLine.clicked }}</button>
</template>
