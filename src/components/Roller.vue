<script setup>
import {reactive} from 'vue';
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

// reactive() for arrays and simpler handling

const publicDice = defineModel('publicRolls', {type: Array, default: []});

const dicoid = index => {
    if (index > 0 && index <= diceAmount) {
        return publicDice.rolled[index - 1];
    }
};

const diceArray = reactive({
    dice: [],
    clicked: maxClicks,
});

// Really nested and powerful way of changing reactive objects
// Feels a bit like passing parameters by reference in C++
const cuboid = index => {
    if (index > 0 && index <= diceAmount) {
        return diceArray.dice[index - 1];
    }
};

// Simple dice roll function
const roll = () => Math.floor(valueMax * Math.random()) + 1;

// Fill the dice array in the diceArray object with sensible entries
// Do the same for the publicDice defineModel object
const diceArrayFilling = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        diceArray.dice.push({id: index, rolled: 0, inversion: normal});

        publicDice.value.push({id: index, rolled: 0});
    }
};

diceArrayFilling();

// For the next round
const diceArrayReset = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        const cubid = cuboid(index);

        cubid.rolled = 0;
        cubid.inversion = normal;

        publicDice.value[index - 1].rolled = 0;
    }

    diceArray.clicked = maxClicks;
};

// Roll all dice that are rollable
const diceRoll = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        const cubid = cuboid(index);

        // If not locked, then roll
        if (cubid.inversion === normal) {
            cubid.rolled = roll();

            publicDice.value[index - 1].rolled = cubid.rolled;
        }
    }
};

// Throw dice a number of times and space them apart in time
const diceRolling = () => {
    if (diceArray.clicked > 0) {
        for (let throws = 0; throws < maxThrows; ++throws) {
            setTimeout(function () {
                diceRoll();
            }, millis * throws);
        }

        --diceArray.clicked;
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

const restart = () => {
    location.reload();
};
</script>

<template>
    <div>
        <Dice
            @click="flip(cube.id)"
            v-for="cube in diceArray.dice"
            :key="cube.id"
            v-model:eyeValue="cube.rolled"
            :class="cube.inversion"
            :inverted="cube.inversion"
        />
    </div>
    {{ diceArray.dice }}
    <br />
    <button @click="diceRolling">{{ buttonMessage }} {{ diceArray.clicked }}</button>
    <br />
    <div>
        {{ publicDice }}
        <br />
        {{ diceArray.clicked }}
    </div>
    <br />
    <button @click="diceArrayReset">Nieuwe Ronde</button>
    <br />
    <br />
    <button @click="restart">Herstart</button>
</template>
