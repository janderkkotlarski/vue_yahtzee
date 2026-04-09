<script setup>
import {ref} from 'vue';
import Dice from './DiceLines.vue';

// Simple constants
const valueMax = 6;
const diceAmount = 5;
// Had numberLine as an imported value, worked wonky at times
// Simplify where possible
const numberLine = 0;
const maxThrows = 25;
const millis = 25;
const maxClicks = 3;
const clicked = ref(maxClicks);

const normal = '______';
const invert = 'invert';
const starts = 'starts';

const buttonMessage = 'Gooien: ';

const props = defineProps({
    buttonVisible: {type: Boolean, default: true},
});

/// define emits to let the parent do the recount function upon emitting this
const emit = defineEmits(['recounting']);

// the 'ref' that the parent can fill in and access
const diceLine = defineModel('diceLine', {
    type: Object,
    default: {
        dice: [],
    },
});

// Simple dice roll function
const roll = () => Math.floor(valueMax * Math.random()) + 1;

// Fill the dice array in the diceArray object with sensible entries
// Do the same for the publicDice defineModel object
const diceArrayFilling = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        diceLine.value.dice.push({id: index, rolled: 0, inversion: starts});
    }
};

diceArrayFilling();

// Feels a bit like passing parameters by reference in C++
// Got rid of the superfluous index restriction
const cuboid = index => {
    return diceLine.value.dice[index - 1];
};

// For the next round
const diceArrayReset = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        const cubid = cuboid(index);

        cubid.rolled = 0;
        cubid.inversion = starts;
    }

    clicked.value = maxClicks;
};

const normalDicing = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        if (cuboid(index).inversion === starts) {
            cuboid(index).inversion = normal;
        }
    }
};

// Roll all dice that are rollable
const diceRoll = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        const cubid = cuboid(index);

        // If not locked, then roll
        if (cubid.inversion != invert) {
            cubid.rolled = roll();

            if (numberLine > 0 && numberLine <= valueMax) {
                cubid.rolled = numberLine;
            }
        }
    }
};

let throwing = false;

const throwable = () => {
    return clicked.value > 0 && !throwing;
};

// Throw dice a number of times and space them apart in time
const diceRolling = () => {
    if (throwable()) {
        throwing = true;

        --clicked.value;

        normalDicing();

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
    }
};

// flip between free and locked
const flip = index => {
    // Once one cannot roll, flipping the roll/hold state is useless
    if (throwable()) {
        const cubid = cuboid(index);

        if (cubid.rolled > 0 && cubid.rolled <= valueMax) {
            cubid.inversion = cubid.inversion === normal ? invert : normal;
        }
    }
};

const restart = () => {
    location.reload();
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

    <button v-if="buttonVisible && clicked > 0" class="switch" @click="diceRolling">
        {{ buttonMessage }} {{ clicked }}
    </button>
    <button v-if="clicked === 0" class="switch" @click="diceArrayReset">Nieuwe Ronde</button>

    <button v-if="!buttonVisible" class="switch" @click="restart">Herstart</button>
</template>
