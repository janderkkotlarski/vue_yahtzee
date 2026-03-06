<script setup>
import {ref, reactive} from 'vue';
import Dice from './Dice.vue';

// Simple constants
const valueMax = 6;
const diceAmount = 5;
const maxThrows = 25;
const millis = 25;
const maxClicks = 3;

const normal = '______';
const invert = 'invert';

const buttonMessage = 'Gooien: ';

const publicDice = defineModel('publicRolls', {type: Array, default: []});
const diceLine = defineModel('diceLine', {
    type: Object,
    default: {
        dice: [],
        clicked: maxClicks,
    },
});

// const diceArray = reactive({
//     dice: [],
//     clicked: maxClicks,
// });

// const diceLine = ref({
//     dice: [],
//     clicked: maxClicks,
// });

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

        // publicDice.value.push({id: index, rolled: 0});
    }
};

diceArrayFilling();

// For the next round
const diceArrayReset = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        const cubid = cuboid(index);

        cubid.rolled = 0;
        cubid.inversion = normal;

        // publicDice.value[index - 1].rolled = 0;
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

            // publicDice.value[index - 1].rolled = cubid.rolled;
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
        }, millis * maxThrows);

        --diceLine.value.clicked;
    }
};

const declick = () => {
    diceLine.value.clicked -= 1;
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

const restart = () => {
    location.reload();
};

/*
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
    <br />
    <br />
    <button @click="diceArrayReset">Nieuwe Ronde</button>
    <br />
    <br />
    <button @click="restart">Herstart</button>
    */
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
    <br />
    <button @click="declick">Gooier: {{ diceLine.clicked }}</button>
    <div>
        {{ diceLine }}
    </div>
</template>
