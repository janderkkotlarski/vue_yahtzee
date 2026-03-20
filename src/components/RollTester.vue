<script setup>
import Dice from './Dice.vue';

// const emit = defineEmits(['inFocus', 'rescan']);

const valueMax = 6;
const diceAmount = 5;

const normal = '______';
const invert = 'invert';

const numberLine = 0;
// const diceLine = defineModel('diceLine');

const diceLine = defineModel('diceLine', {
    type: Object,
    default: {
        dice: [],
        clicked: 0,
    },
});

// const diceInit = () => {
//     const dices = [];

//     for (let index = 1; index <= diceAmount; ++index) {
//         dices.push({id: index, rolled: 0, inversion: normal});
//     }

//     const diceArray = {dice: dices, clicked: 0};

//     diceLine.value = diceArray;
// };

// diceInit();

const roll = () => Math.floor(valueMax * Math.random()) + 1;

const cuboid = index => {
    if (index > 0 && index <= diceAmount) {
        return diceLine.value.dice[index - 1];
    }
};

// const diceRoll = () => {
//     for (let index = 1; index <= diceAmount; ++index) {
//         const cubid = cuboid(index);

//         cubid.rolled = roll();

//         // // If not locked, then roll
//         // if (cubid.inversion === normal) {
//         //     cubid.rolled = roll();

//         //     // publicDice.value[index - 1].rolled = cubid.rolled;
//         // }
//     }
// };

// diceRoll();

const diceArrayFilling = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        diceLine.value.dice.push({id: index, rolled: roll(), inversion: normal});

        // publicDice.value.push({id: index, rolled: 0});
    }

    diceLine.value.clicked = 0;
};

diceArrayFilling();

const rolling = () => {
    for (const cube of diceLine.value.dice) {
        if (numberLine > 0 && numberLine <= valueMax) {
            cube.rolled = numberLine;
        } else {
            cube.rolled = roll();
        }
    }
};

// rolling();

// const cuboid = index => {
//     if (index > 0 && index <= diceAmount) {
//         return diceLine.value.dice[index - 1];
//     }
// };

const uptick = index => {
    if (index > 0 && index <= diceAmount) {
        const cubid = cuboid(index);

        // const cubid = diceLine.value.dice[index - 1];

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
    <div>
        <Dice
            @click="uptick(cube.id)"
            v-for="cube in diceLine.dice"
            :key="cube.id"
            v-model:eyeValue="cube.rolled"
            :class="cube.inversion"
            :inverted="cube.inversion"
        />
    </div>
    <div>Rolltester: {{ diceLine }}</div>
</template>
