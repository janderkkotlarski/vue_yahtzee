<script setup>
import {ref, watch} from 'vue';
import Dice from './Dice.vue';

const emit = defineEmits(['inFocus', 'rescan']);

const valueMax = 6;
const diceAmount = 5;

const normal = '______';

const roll = () => Math.floor(valueMax * Math.random()) + 1;

const numberLine = 0;
const diceLine = defineModel('diceLine');

const diceInit = () => {
    const dices = [];

    for (let index = 1; index <= diceAmount; ++index) {
        dices.push({id: index, rolled: 0});
    }

    const diceArray = {dice: dices, clicked: 0};

    diceLine.value = diceArray;
};

const runs = ref(0);

// A way of initializing defineModel without needing outside initialization
const initDiceRolls = () => {
    if (diceLine.value === undefined) {
        diceInit();
    }
};

// Initialization
initDiceRolls();

// Check the initialization and needs watch to be imported from vue
watch(diceLine, initDiceRolls);

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

defineExpose({
    rolling,
});

// const diceLine = ref({
//     dice: [],
// });

// const diceArrayFilling = () => {
//     for (let index = 1; index <= diceAmount; ++index) {
//         diceLine.value.dice.push({id: index, rolled: index});
//     }
// };

// diceArrayFilling();

// const countNumber = number => {
//     let count = 0;

//     for (let index = 0; index < diceAmount; ++index) {
//         if (diceLine.value.dice[index].rolled === number) {
//             ++count;
//         }
//     }

//     return count;
// };

// let diceSum = 0;

// const summing = () => {
//     diceSum = 0;

//     for (const cube of diceLine.value.dice) {
//         diceSum += cube.rolled;
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

    // emit('rescan');
};

// @click="uptick(cube.id)"

// <div>
//         <Dice
//             v-for="cube in diceLine.dice"
//             :key="cube.id"
//             v-model:eyeValue="cube.rolled"
//             :class="normal"
//             :inverted="normal"
//         />
//     </div>
</script>

<template>
    <div v-for="cube in diceLine.dice" :key="cube.id">
        {{ cube.rolled }}
    </div>

    <Dice
        @click="uptick(cube.id)"
        v-for="cube in diceLine.dice"
        :key="cube.id"
        v-model:eyeValue="cube.rolled"
        :class="normal"
        :inverted="normal"
    />
</template>
