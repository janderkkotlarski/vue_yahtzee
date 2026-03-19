<script setup>
import Dice from './Dice.vue';

const emit = defineEmits(['inFocus', 'rescan']);

const valueMax = 6;
const diceAmount = 5;

const normal = '______';

const roll = () => Math.floor(valueMax * Math.random()) + 1;

const numberLine = 0;
const diceLine = defineModel('diceLine');

// const diceLine = defineModel('diceLine', {
//     type: Object,
//     default: {
//         dice: [],
//         clicked: 0,
//     },
// });

const diceInit = () => {
    const dices = [];

    for (let index = 1; index <= diceAmount; ++index) {
        dices.push({id: index, rolled: 0});
    }

    const diceArray = {dice: dices, clicked: 0};

    diceLine.value = diceArray;
};

diceInit();

const rolling = () => {
    for (const cube of diceLine.value.dice) {
        if (numberLine > 0 && numberLine <= valueMax) {
            cube.rolled = numberLine;
        } else {
            cube.rolled = roll();
        }
    }
};

rolling();

// const cuboid = index => {
//     if (index > 0 && index <= diceAmount) {
//         return diceLine.value.dice[index - 1];
//     }
// };

const cuboid = index => {
    if (index > 0 && index <= diceAmount) {
        return diceLine.value.dice[index - 1];
    }
};

const uptick = index => {
    if (index > 0 && index <= diceAmount) {
        const cubid = cuboid(index);

        ++cubid.rolled;

        if (cubid.rolled > valueMax) {
            cubid.rolled -= valueMax;
        }
    }
};

const flip = index => {
    if (index > 0 && index <= diceAmount) {
        const cubid = cuboid(index);

        if (cubid.rolled > 0 && cubid.rolled <= valueMax) {
            cubid.inversion = cubid.inversion === normal ? invert : normal;
        }
    }
};

// @click="uptick(cube.id)"

// <Dice
//     v-for="cube in diceLine.dice"
//     :key="cube.id"
//     v-model:eyeValue="cube.rolled"
//     :class="normal"
//     :inverted="normal"
// />
</script>

<template>
    <Dice
        @click="uptick(cube.id)"
        v-for="cube in diceLine.dice"
        :key="cube.id"
        v-model:eyeValue="cube.rolled"
        :class="normal"
        :inverted="normal"
    />
</template>
