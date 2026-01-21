<script setup>
import {reactive} from 'vue';
import Dice from './Dice.vue';

// Simple constants
const valueMax = 6;
const diceAmount = 5;

const normal = '______';
const invert = 'invert';

const buttonMessage = 'Opnieuw rollen?';

// reactive() for arrays and simpler handling

const publicDice = defineModel('publicRolls', {type: Array, default: []});

const dicoid = index => {
    if (index > 0 && index <= diceAmount) {
        return publicDice.rolled[index - 1];
    }
};

const diceArray = reactive({
    dice: [],
    clicked: 0,
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
        diceArray.dice.push({id: index, rolled: roll(), inversion: normal});

        publicDice.value.push({id: index, rolled: diceArray.dice[index - 1].rolled});
    }
};

diceArrayFilling();

const diceRolling = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        const cubid = cuboid(index);

        if (cubid.inversion === normal) {
            cubid.rolled = roll();

            publicDice.value[index - 1].rolled = cubid.rolled;
        }
    }

    ++diceArray.clicked;
};

const flip = index => {
    if (index > 0 && index <= diceAmount) {
        if (diceArray.dice[index - 1].inversion === normal) {
            diceArray.dice[index - 1].inversion = invert;
        } else {
            diceArray.dice[index - 1].inversion = normal;
        }
    }
};

// const resum = () => {
//     total.value = 0;

//     for (let index = 1; index <= diceAmount; ++index) {
//         total.value += diceRolls[index - 1].entry;
//     }
// };

// const single = index => {
//     if (index > 0 && index < reactName.length + 1) {
//         diceInversions[index - 1].entry = diceInversions[index - 1].entry === normal ? invert : normal;

//         ++clicked;
//     }
// };

// @click="single(rolled.id)"

/*
<div>
        <Dice
            @click="single(rolled.id)"
            v-for="rolled in cubes.rolls"
            :key="rolled.id"
            v-model:eyeValue="rolled.entry"
            :class="cubes.inversions[rolled.id].entry"
            :inverted="cubes.inversions[rolled.id].entry"
        />
    </div>
    {{ cubes.inversions }}

    {{ cubes.clicked }}
    */
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
    <button @click="diceRolling">{{ buttonMessage }}</button>
    <br />
    <div>
        {{ publicDice }}
        <br />
        {{ diceArray.clicked }}
    </div>
    <br />
</template>
