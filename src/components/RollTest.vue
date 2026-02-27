<script setup>
import Dice from './Dice.vue';

const valueMax = 6;
const diceAmount = 5;

const normal = '______';

const diceArray = reactive({
    dice: [],
});

const diceArrayFilling = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        diceArray.dice.push({id: index, rolled: index});
    }
};

diceArrayFilling();

const roll = () => Math.floor(valueMax * Math.random()) + 1;

const diceReroll = () => {
    for (const cube of diceArray.dice) {
        cube.rolled = roll();
    }
};

const rollYahtzee = number => {
    for (const cube of diceArray.dice) {
        cube.rolled = number;
    }
};

const rolling = number => {
    if (number >= 1 && number <= valueMax) {
        rollYahtzee(number);
    } else {
        diceReroll();
    }
};

const number = 6;

rolling(number);
</script>

<template></template>
